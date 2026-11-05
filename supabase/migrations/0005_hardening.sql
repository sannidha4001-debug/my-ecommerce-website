-- ============================================================================
-- GameXchange · 0005 hardening
-- Apply after 0004. Closes the remaining client-tampering paths found in the
-- final RLS review. Safe to run more than once.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Orders are recalculated on insert. A client may create only its own
--    awaiting-payment order for a listing that is actually for sale.
-- ----------------------------------------------------------------------------
create or replace function public.guard_order_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_listing public.listings%rowtype;
  v_fee numeric;
  v_payout numeric;
  v_winner uuid;
begin
  select * into v_listing from public.listings where id = new.listing_id;
  if not found then
    raise exception 'Listing not found';
  end if;

  if v_listing.seller_id = new.buyer_id then
    raise exception 'You cannot buy your own listing';
  end if;

  -- Auction listings can only be bought by the recorded winner.
  if v_listing.kind = 'auction' then
    if v_listing.status not in ('active', 'sold') then
      raise exception 'This auction is not available';
    end if;
    select winner_id into v_winner from public.auctions where listing_id = v_listing.id;
    if v_winner is null or v_winner <> new.buyer_id then
      raise exception 'Only the auction winner can start this order';
    end if;
  elsif v_listing.status <> 'active' then
    raise exception 'This listing is not available';
  end if;

  select fee, payout into v_fee, v_payout from public.commission_for(v_listing.price);
  new.seller_id := v_listing.seller_id;
  new.amount := v_listing.price;
  new.fee := v_fee;
  new.payout := v_payout;
  new.status := 'awaiting_payment';
  new.payment_reference := null;
  new.inspection_ends_at := null;
  new.completed_at := null;

  if new.auction_id is not null and not exists (
    select 1 from public.auctions a
    where a.id = new.auction_id and a.listing_id = new.listing_id
  ) then
    raise exception 'Auction does not match this listing';
  end if;

  return new;
end;
$$;

drop trigger if exists orders_guard_insert on public.orders;
create trigger orders_guard_insert
  before insert on public.orders
  for each row execute function public.guard_order_insert();

-- A buyer must not undo an admin's payment verification by moving the order
-- back to awaiting_payment; order_transition() normally blocks this, and this
-- trigger protects against future direct updates.
create or replace function public.guard_order_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null
     and not public.is_admin()
     and old.status = 'payment_submitted'
     and new.status = 'awaiting_payment' then
    raise exception 'Only an administrator can reset a submitted payment';
  end if;
  return new;
end;
$$;

drop trigger if exists orders_guard_update on public.orders;
create trigger orders_guard_update
  before update on public.orders
  for each row execute function public.guard_order_update();

-- ----------------------------------------------------------------------------
-- 2. Sellers may accept or decline an offer, but cannot rewrite it.
-- ----------------------------------------------------------------------------
create or replace function public.guard_offer_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.listing_id <> old.listing_id
       or new.buyer_id <> old.buyer_id
       or new.seller_id <> old.seller_id
       or new.amount <> old.amount
       or new.message is distinct from old.message then
      raise exception 'Offer terms cannot be edited';
    end if;
    if new.status not in ('accepted', 'declined') then
      raise exception 'A seller may only accept or decline an offer';
    end if;
    new.counter_amount := old.counter_amount;
    new.admin_note := old.admin_note;
  end if;
  return new;
end;
$$;

drop trigger if exists offers_guard_update on public.offers;
create trigger offers_guard_update
  before update on public.offers
  for each row execute function public.guard_offer_update();

-- ----------------------------------------------------------------------------
-- 3. Bid flood protection (8 bids per 10 seconds per account). This runs in
--    addition to the row lock inside place_bid().
-- ----------------------------------------------------------------------------
create or replace function public.guard_bid_rate()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_recent integer;
begin
  select count(*) into v_recent
  from public.bids
  where bidder_id = new.bidder_id
    and created_at > now() - interval '10 seconds';

  if v_recent >= 8 then
    raise exception 'Too many bids. Please wait a few seconds.';
  end if;
  return new;
end;
$$;

drop trigger if exists bids_rate_limit on public.bids;
create trigger bids_rate_limit
  before insert on public.bids
  for each row execute function public.guard_bid_rate();

-- ----------------------------------------------------------------------------
-- 4. Support threads must belong to the creator (or to an order they are part
--    of), which prevents attaching a thread to a stranger's order.
-- ----------------------------------------------------------------------------
drop policy if exists "threads: authenticated create" on public.threads;
create policy "threads: authenticated create"
  on public.threads for insert
  with check (
    created_by = auth.uid()
    and (
      order_id is null
      or exists (
        select 1 from public.orders o
        where o.id = order_id
          and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
      )
    )
  );

drop policy if exists "thread messages: participant insert" on public.thread_messages;
create policy "thread messages: participant insert"
  on public.thread_messages for insert
  with check (
    author_id = auth.uid()
    and (is_internal = false or public.is_admin())
    and exists (
      select 1 from public.threads t
      where t.id = thread_id
        and (
          t.created_by = auth.uid()
          or public.is_admin()
          or exists (
            select 1 from public.orders o
            where o.id = t.order_id
              and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
          )
        )
    )
  );

-- ----------------------------------------------------------------------------
-- 5. Buyers and sellers can still open a listing they bought/sold after it
--    leaves the public "active" state.
-- ----------------------------------------------------------------------------
drop policy if exists "listings: public active, own or admin" on public.listings;
create policy "listings: public active, own or admin"
  on public.listings for select
  using (
    status = 'active'
    or seller_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.listing_id = listings.id
        and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
    )
  );

-- ----------------------------------------------------------------------------
-- 6. Audit helper is internal only. Security-definer functions still call it.
-- ----------------------------------------------------------------------------
revoke all on function public.write_audit(text, text, jsonb) from authenticated;
revoke all on function public.write_audit(text, text, jsonb) from anon;

-- ----------------------------------------------------------------------------
-- 7. Auction payment deadline fallback.
--    If the winner does not pay within 24 hours, give one strike and offer the
--    sale to the next-highest bidder (or mark unsold).
-- ----------------------------------------------------------------------------
create or replace function public.expire_auction_winner(p_auction_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_auction public.auctions%rowtype;
  v_old_winner uuid;
  v_next uuid;
  v_next_amount numeric;
  v_strikes smallint;
begin
  if auth.role() <> 'service_role' and not public.is_admin() then
    raise exception 'Only an administrator can release an unpaid winner';
  end if;

  select * into v_auction from public.auctions where id = p_auction_id for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  if v_auction.winner_due_at is null or now() < v_auction.winner_due_at then
    return jsonb_build_object('ok', false, 'error', 'not_due');
  end if;
  if exists (select 1 from public.orders where auction_id = p_auction_id) then
    return jsonb_build_object('ok', false, 'error', 'order_exists');
  end if;

  v_old_winner := v_auction.winner_id;

  if v_old_winner is not null then
    update public.profiles
    set strikes = least(3, strikes + 1),
        suspended = (strikes + 1) >= 3
    where id = v_old_winner
    returning strikes into v_strikes;

    insert into public.notifications (user_id, title_en, title_bn, body_en, body_bn, href)
    values (
      v_old_winner,
      'Auction payment missed',
      'নিলামের পেমেন্ট মিস হয়েছে',
      'The 24-hour payment window expired. A strike was added to your account.',
      '২৪ ঘণ্টার পেমেন্ট সময় শেষ। আপনার অ্যাকাউন্টে একটি স্ট্রাইক যোগ হয়েছে।',
      '/dashboard/orders'
    );
  end if;

  select bidder_id, amount into v_next, v_next_amount
  from public.bids
  where auction_id = p_auction_id
    and bidder_id <> coalesce(v_old_winner, '00000000-0000-0000-0000-000000000000'::uuid)
    and (v_auction.reserve_price is null or amount >= v_auction.reserve_price)
  order by amount desc, created_at asc
  limit 1;

  if v_next is null then
    update public.auctions
    set status = 'unsold', winner_id = null, winner_due_at = null, updated_at = now()
    where id = p_auction_id;

    update public.listings
    set status = 'active', updated_at = now()
    where id = v_auction.listing_id;

    perform public.write_audit('auction.payment_missed', 'auction:' || p_auction_id::text,
      jsonb_build_object('old_winner', v_old_winner, 'next', null));
    return jsonb_build_object('ok', true, 'status', 'unsold');
  end if;

  update public.auctions
  set winner_id = v_next,
      winner_due_at = now() + interval '24 hours',
      updated_at = now()
  where id = p_auction_id;

  insert into public.notifications (user_id, title_en, title_bn, body_en, body_bn, href)
  values (
    v_next,
    'Second-chance auction win',
    'দ্বিতীয় সুযোগে নিলাম জয়',
    'The previous winner did not pay. You have 24 hours to complete payment.',
    'আগের বিজয়ী পেমেন্ট করেননি। পেমেন্ট সম্পন্ন করতে আপনার ২৪ ঘণ্টা আছে।',
    '/dashboard/orders'
  );

  perform public.write_audit('auction.payment_missed', 'auction:' || p_auction_id::text,
    jsonb_build_object('old_winner', v_old_winner, 'next', v_next, 'amount', v_next_amount, 'strikes', v_strikes));

  return jsonb_build_object(
    'ok', true,
    'status', 'second_chance',
    'winner', v_next,
    'amount', v_next_amount,
    'due_at', now() + interval '24 hours'
  );
end;
$$;

revoke all on function public.expire_auction_winner(uuid) from public;
grant execute on function public.expire_auction_winner(uuid) to authenticated;

-- ----------------------------------------------------------------------------
-- 8. One pending KYC submission per user.
-- ----------------------------------------------------------------------------
create unique index if not exists kyc_one_pending_per_user
  on public.kyc_submissions (user_id)
  where status = 'pending';

-- ----------------------------------------------------------------------------
-- 9. Listings: sellers can edit their own rows, but cannot self-approve,
--    change ownership, or edit a sold/archived listing. Editing an active
--    listing sends it back to review.
-- ----------------------------------------------------------------------------
create or replace function public.guard_listing_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.seller_id <> old.seller_id
       or new.created_at <> old.created_at
       or new.approved_by is distinct from old.approved_by
       or new.approved_at is distinct from old.approved_at
       or new.views <> old.views then
      raise exception 'Protected listing fields cannot be changed';
    end if;

    if old.status not in ('draft', 'pending_review', 'paused', 'active') then
      raise exception 'This listing can no longer be edited';
    end if;

    if new.status not in ('draft', 'pending_review', 'paused', 'active') then
      raise exception 'Sellers cannot set this listing status';
    end if;

    if new.status = 'active' and old.status <> 'active' then
      raise exception 'Only an administrator can approve a listing';
    end if;

    -- Any material edit to a live listing needs a fresh review.
    if old.status = 'active' and new.status = 'active' then
      new.status := 'pending_review';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists listings_guard_update on public.listings;
create trigger listings_guard_update
  before update on public.listings
  for each row execute function public.guard_listing_update();

drop policy if exists "listings: seller edit or admin" on public.listings;
create policy "listings: seller edit or admin"
  on public.listings for update
  using (seller_id = auth.uid() or public.is_admin())
  with check (public.is_admin() or seller_id = auth.uid());

-- ----------------------------------------------------------------------------
-- 10. Profiles: the join date is immutable too.
-- ----------------------------------------------------------------------------
create or replace function public.guard_profile_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;

  if new.id is distinct from old.id
     or new.created_at is distinct from old.created_at
     or new.role is distinct from old.role
     or new.kyc_status is distinct from old.kyc_status
     or new.wallet_balance is distinct from old.wallet_balance
     or new.strikes is distinct from old.strikes
     or new.suspended is distinct from old.suspended
     or new.trust_score is distinct from old.trust_score
     or new.phone_verified is distinct from old.phone_verified
     or new.totp_enabled is distinct from old.totp_enabled
     or new.email is distinct from old.email then
    raise exception 'Protected profile fields can only be changed by an administrator';
  end if;

  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 11. Shill-bid signal for admins: several accounts bidding from one IP.
--     security_invoker means the base bids RLS still applies, so only admins
--     (who can read every bid) see meaningful rows.
-- ----------------------------------------------------------------------------
create or replace view public.auction_shill_signals
with (security_invoker = true)
as
select
  b.auction_id,
  b.ip_hash,
  count(distinct b.bidder_id) as accounts,
  count(*) as bids,
  min(b.created_at) as first_seen,
  max(b.created_at) as last_seen
from public.bids b
where b.ip_hash is not null
group by b.auction_id, b.ip_hash
having count(distinct b.bidder_id) > 1;

grant select on public.auction_shill_signals to authenticated;

select '0005 hardening complete' as result;
