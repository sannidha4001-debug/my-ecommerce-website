-- ============================================================================
-- GameXchange · 0002 functions & triggers
-- Business rules live here so the API cannot be tricked by a modified client.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Helpers
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('super_admin', 'moderator')
      and suspended = false
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'super_admin'
      and suspended = false
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Commission is calculated in one place: 7% with a ৳50 floor by default.
create or replace function public.commission_for(p_amount numeric)
returns table (fee numeric, payout numeric)
language sql
stable
security definer
set search_path = public
as $$
  select
    greatest(s.min_fee, round(p_amount * (s.commission_rate / 100), 2)) as fee,
    greatest(
      0,
      p_amount - greatest(s.min_fee, round(p_amount * (s.commission_rate / 100), 2))
    ) as payout
  from public.admin_settings s
  where s.id = true;
$$;

-- Create a profile automatically when Supabase Auth creates a user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    coalesce(new.email, new.id::text),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- A user may edit their own name/phone, but never role, KYC, balance or strikes.
create or replace function public.guard_profile_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Service-role/server jobs have no end-user JWT.
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;

  if new.role is distinct from old.role
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

drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard
  before update on public.profiles
  for each row execute function public.guard_profile_changes();

-- Append-only audit helper. Client calls record the caller; server jobs may
-- supply their own metadata through the service role.
create or replace function public.write_audit(
  p_action text,
  p_target text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role user_role;
begin
  select role into v_role from public.profiles where id = auth.uid();

  insert into public.audit_log (actor_id, actor_role, action, target, metadata)
  values (auth.uid(), v_role, p_action, p_target, coalesce(p_metadata, '{}'::jsonb));
end;
$$;

-- ----------------------------------------------------------------------------
-- Atomic bidding
--
-- Rules enforced here, not in React:
--   • auction must be live and inside its time window
--   • bidder must be phone verified, not suspended, and not the seller
--   • English bids >= current + increment; sealed bids strictly increasing
--   • refundable deposit is required when the auction sets one
--   • anti-sniping extends the clock by the configured number of minutes
-- The row lock (`for update`) makes simultaneous bids serialise correctly.
-- ----------------------------------------------------------------------------
create or replace function public.place_bid(
  p_auction_id uuid,
  p_amount numeric,
  p_max_amount numeric default null,
  p_ip_hash text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_auction public.auctions%rowtype;
  v_listing public.listings%rowtype;
  v_profile public.profiles%rowtype;
  v_settings public.admin_settings%rowtype;
  v_highest numeric;
  v_min numeric;
  v_new_end timestamptz := null;
  v_bid_id uuid;
  v_previous_bidder uuid;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  select * into v_auction
  from public.auctions
  where id = p_auction_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  if v_auction.status <> 'live' or now() < v_auction.starts_at or now() >= v_auction.ends_at then
    return jsonb_build_object('ok', false, 'error', 'closed');
  end if;

  select * into v_listing from public.listings where id = v_auction.listing_id;
  if v_listing.seller_id = v_uid then
    return jsonb_build_object('ok', false, 'error', 'own_listing');
  end if;

  select * into v_profile from public.profiles where id = v_uid;
  if v_profile.suspended then
    return jsonb_build_object('ok', false, 'error', 'suspended');
  end if;
  if v_profile.phone_verified = false then
    return jsonb_build_object('ok', false, 'error', 'verify_phone');
  end if;
  if v_profile.kyc_status <> 'verified' and v_auction.deposit > 0 then
    return jsonb_build_object('ok', false, 'error', 'kyc_required');
  end if;

  -- Refundable deposit is stored as a completed wallet transaction.
  if v_auction.deposit > 0 and not exists (
    select 1 from public.wallet_transactions
    where user_id = v_uid
      and kind = 'bid_deposit'
      and status = 'completed'
      and reference = 'auction:' || p_auction_id::text
  ) then
    return jsonb_build_object('ok', false, 'error', 'deposit_required');
  end if;

  select coalesce(max(amount), 0) into v_highest
  from public.bids
  where auction_id = p_auction_id;

  if v_auction.format = 'sealed' and v_auction.status = 'live' then
    v_min := greatest(v_auction.starting_bid, v_highest + 0.01);
  else
    v_min := case
      when v_auction.current_bid is null then v_auction.starting_bid
      else v_auction.current_bid + v_auction.min_increment
    end;
    -- A sealed auction can later be revealed; never accept a lower bid.
    v_min := greatest(v_min, v_highest + 0.01);
  end if;

  if p_amount is null or p_amount < v_min then
    return jsonb_build_object(
      'ok', false,
      'error', 'too_low',
      'minimum', v_min
    );
  end if;

  -- Earlier leader gets an outbid notification (English auctions only).
  if v_auction.current_bid is not null then
    select bidder_id into v_previous_bidder
    from public.bids
    where auction_id = p_auction_id
    order by amount desc, created_at asc
    limit 1;

    if v_previous_bidder is not null and v_previous_bidder <> v_uid then
      insert into public.notifications (user_id, title_en, title_bn, body_en, body_bn, href)
      values (
        v_previous_bidder,
        'You have been outbid',
        'আপনাকে ছাড়িয়ে গেছে',
        'A higher bid was placed on ' || v_listing.title,
        v_listing.title || ' এ আরও উচ্চ বিড পড়েছে',
        '/listing/' || v_listing.id
      );
    end if;
  end if;

  insert into public.bids (auction_id, bidder_id, amount, is_proxy, max_amount, ip_hash)
  values (
    p_auction_id,
    v_uid,
    p_amount,
    p_max_amount is not null,
    p_max_amount,
    p_ip_hash
  )
  returning id into v_bid_id;

  select * into v_settings from public.admin_settings where id = true;

  if now() > v_auction.ends_at - make_interval(mins => v_settings.anti_snipe_minutes) then
    v_new_end := greatest(v_auction.ends_at, now() + make_interval(mins => v_settings.anti_snipe_minutes));
  end if;

  update public.auctions
  set
    bid_count = bid_count + 1,
    current_bid = case when format = 'english' then p_amount else current_bid end,
    ends_at = coalesce(v_new_end, ends_at),
    updated_at = now()
  where id = p_auction_id;

  perform public.write_audit(
    'bid.placed',
    'auction:' || p_auction_id::text,
    jsonb_build_object('amount', p_amount, 'bid_id', v_bid_id, 'extended_to', v_new_end)
  );

  return jsonb_build_object(
    'ok', true,
    'bid_id', v_bid_id,
    'minimum_next', p_amount + v_auction.min_increment,
    'ends_at', coalesce(v_new_end, v_auction.ends_at),
    'extended', v_new_end is not null
  );
end;
$$;

-- Close an auction, choose the winner, and start the 24-hour payment clock.
create or replace function public.finalize_auction(p_auction_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_auction public.auctions%rowtype;
  v_winner uuid;
  v_amount numeric;
begin
  if auth.role() <> 'service_role' and not public.is_admin() then
    raise exception 'Only an administrator can finalize an auction';
  end if;

  select * into v_auction from public.auctions where id = p_auction_id for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  if v_auction.status not in ('live', 'paused') then
    return jsonb_build_object('ok', false, 'error', 'not_live');
  end if;

  select bidder_id, amount into v_winner, v_amount
  from public.bids
  where auction_id = p_auction_id
  order by amount desc, created_at asc
  limit 1;

  if v_winner is null
     or (v_auction.reserve_price is not null and v_amount < v_auction.reserve_price) then
    update public.auctions
    set status = 'unsold', ends_at = least(ends_at, now()), updated_at = now()
    where id = p_auction_id;

    perform public.write_audit('auction.unsold', 'auction:' || p_auction_id::text);
    return jsonb_build_object('ok', true, 'status', 'unsold');
  end if;

  update public.auctions
  set
    status = 'ended',
    winner_id = v_winner,
    winner_due_at = now() + interval '24 hours',
    ends_at = least(ends_at, now()),
    updated_at = now()
  where id = p_auction_id;

  update public.listings
  set status = 'sold', updated_at = now()
  where id = v_auction.listing_id;

  insert into public.notifications (user_id, title_en, title_bn, body_en, body_bn, href)
  values (
    v_winner,
    'You won the auction',
    'আপনি নিলামে জিতেছেন',
    'Complete payment within 24 hours to start escrow.',
    'এস্ক্রো শুরু করতে ২৪ ঘণ্টার মধ্যে পেমেন্ট সম্পন্ন করুন।',
    '/dashboard/orders'
  );

  perform public.write_audit(
    'auction.finalized',
    'auction:' || p_auction_id::text,
    jsonb_build_object('winner', v_winner, 'amount', v_amount)
  );

  return jsonb_build_object(
    'ok', true,
    'status', 'ended',
    'winner', v_winner,
    'amount', v_amount,
    'payment_due_at', now() + interval '24 hours'
  );
end;
$$;

-- ----------------------------------------------------------------------------
-- Escrow state machine. Only listed transitions are allowed, and each role
-- can only push the order through the steps that belong to it.
-- ----------------------------------------------------------------------------
create or replace function public.allowed_order_transition(p_from order_status, p_to order_status)
returns boolean
language sql
immutable
as $$
  select case
    when p_from = 'awaiting_payment' and p_to in ('payment_submitted', 'cancelled') then true
    when p_from = 'payment_submitted' and p_to in ('payment_confirmed', 'cancelled', 'awaiting_payment') then true
    when p_from = 'payment_confirmed' and p_to in ('delivered', 'refunded', 'disputed') then true
    when p_from = 'delivered' and p_to in ('completed', 'disputed', 'refunded') then true
    when p_from = 'disputed' and p_to in ('refunded', 'completed') then true
    else false
  end;
$$;

create or replace function public.order_transition(
  p_order_id text,
  p_status order_status,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_order public.orders%rowtype;
  v_role user_role;
  v_admin boolean := public.is_admin();
  v_settings public.admin_settings%rowtype;
  v_fee numeric;
  v_payout numeric;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  select role into v_role from public.profiles where id = v_uid;

  if not v_admin and v_uid <> v_order.buyer_id and v_uid <> v_order.seller_id then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;

  if not public.allowed_order_transition(v_order.status, p_status) then
    return jsonb_build_object('ok', false, 'error', 'invalid_transition');
  end if;

  -- Buyers submit payment, confirm receipt, open disputes and cancel.
  -- Sellers only mark a confirmed order as delivered. Admins can do everything.
  if not v_admin then
    if v_uid = v_order.buyer_id and p_status not in ('payment_submitted', 'completed', 'disputed', 'cancelled', 'awaiting_payment') then
      return jsonb_build_object('ok', false, 'error', 'forbidden');
    end if;
    if v_uid = v_order.seller_id and p_status <> 'delivered' then
      return jsonb_build_object('ok', false, 'error', 'forbidden');
    end if;
  end if;

  select * into v_settings from public.admin_settings where id = true;

  update public.orders
  set
    status = p_status,
    inspection_ends_at = case
      when p_status = 'delivered' then now() + make_interval(hours => v_settings.inspection_hours)
      else inspection_ends_at
    end,
    completed_at = case when p_status = 'completed' then now() else completed_at end,
    updated_at = now()
  where id = p_order_id;

  insert into public.order_events (order_id, actor_id, actor_role, status, note)
  values (p_order_id, v_uid, v_role, p_status, p_note);

  -- On completion, credit the seller exactly once and mark the listing sold.
  if p_status = 'completed' then
    v_fee := v_order.fee;
    v_payout := v_order.payout;

    if not exists (
      select 1 from public.wallet_transactions
      where user_id = v_order.seller_id
        and kind = 'sale_payout'
        and reference = p_order_id
        and status = 'completed'
    ) then
      insert into public.wallet_transactions (user_id, kind, status, amount, reference, note)
      values (v_order.seller_id, 'sale_payout', 'completed', v_payout, p_order_id, 'Escrow completed');

      update public.profiles
      set wallet_balance = wallet_balance + v_payout,
          trust_score = least(100, trust_score + 1)
      where id = v_order.seller_id;
    end if;

    update public.listings
    set status = 'sold', updated_at = now()
    where id = v_order.listing_id;

    insert into public.notifications (user_id, title_en, title_bn, body_en, body_bn, href)
    values (
      v_order.seller_id,
      'Payout released',
      'পেআউট ছাড়া হয়েছে',
      'Your escrow order ' || p_order_id || ' is complete. Payout: ৳' || v_payout,
      'আপনার এস্ক্রো অর্ডার ' || p_order_id || ' সম্পন্ন। পেআউট: ৳' || v_payout,
      '/dashboard/wallet'
    );
  end if;

  perform public.write_audit(
    'order.' || p_status::text,
    'order:' || p_order_id,
    jsonb_build_object('from', v_order.status, 'to', p_status, 'note', p_note, 'fee', v_fee)
  );

  return jsonb_build_object(
    'ok', true,
    'status', p_status,
    'inspection_ends_at', case when p_status = 'delivered' then now() + make_interval(hours => v_settings.inspection_hours) else v_order.inspection_ends_at end
  );
end;
$$;

-- ----------------------------------------------------------------------------
-- Audit trigger for the settings row. Every change records who and what.
-- ----------------------------------------------------------------------------
create or replace function public.audit_admin_settings()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.audit_log (actor_id, actor_role, action, target, metadata)
  values (
    auth.uid(),
    (select role from public.profiles where id = auth.uid()),
    'settings.updated',
    'admin_settings',
    jsonb_build_object('before', to_jsonb(old) - 'updated_by', 'after', to_jsonb(new) - 'updated_by')
  );
  return new;
end;
$$;

drop trigger if exists admin_settings_audit on public.admin_settings;
create trigger admin_settings_audit
  after update on public.admin_settings
  for each row execute function public.audit_admin_settings();

-- Timestamp triggers
do $$
declare
  t text;
begin
  foreach t in array array['profiles', 'listings', 'auctions', 'orders', 'offers', 'threads', 'admin_settings']
  loop
    execute format('drop trigger if exists %I_touch on public.%I', t, t);
    execute format(
      'create trigger %I_touch before update on public.%I for each row execute function public.touch_updated_at()',
      t, t
    );
  end loop;
end;
$$;

select '0002 functions created' as result;
