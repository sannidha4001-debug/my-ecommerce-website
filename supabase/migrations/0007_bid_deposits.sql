-- ============================================================================
-- GameXchange · 0007 bid deposits + unified member defaults
-- ============================================================================
-- Run AFTER 0006_member_role.sql, which adds the `member` enum value in its
-- own transaction.
--
-- Auction bidding is deposit-first:
--   1. A verified member calls request_bid_deposit() with the bid amount,
--      bKash/Nagad method, sender number and transaction ID.
--   2. The deposit waits in `bid_deposits` with status `pending`.
--   3. An admin calls confirm_bid_deposit(). Only then is the bid inserted
--      into `bids` and the auction updated. Rejecting keeps the bid out.
--
-- Bidders can never write to `bids` or `bid_deposits` directly, so no bid can
-- exist without an admin-verified payment.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Everyone is a member. Existing buyer/seller rows are migrated.
-- ----------------------------------------------------------------------------
alter table public.profiles alter column role set default 'member';

update public.profiles set role = 'member' where role in ('buyer', 'seller');
update public.order_events set actor_role = 'member' where actor_role in ('buyer', 'seller');
update public.thread_messages set author_role = 'member' where author_role in ('buyer', 'seller');
update public.audit_log set actor_role = 'member' where actor_role in ('buyer', 'seller');

-- The public seller directory now lists members (admins are excluded).
create or replace view public.public_sellers
with (security_invoker = false)
as
select
  p.id,
  p.full_name,
  p.trust_score,
  p.kyc_status,
  p.created_at,
  (
    select count(*) from public.listings l
    where l.seller_id = p.id and l.status = 'sold'
  ) as sales_count
from public.profiles p
where p.role = 'member' and p.suspended = false;

grant select on public.public_sellers to anon, authenticated;

-- ----------------------------------------------------------------------------
-- 2. Percentage-based bid deposit setting (10% by default).
-- ----------------------------------------------------------------------------
alter table public.admin_settings
  add column if not exists bid_deposit_percent numeric(5, 2) not null default 10
  check (bid_deposit_percent between 0 and 100);

-- ----------------------------------------------------------------------------
-- 3. Deposit queue
-- ----------------------------------------------------------------------------
do $$
begin
  create type bid_deposit_status as enum ('pending', 'confirmed', 'rejected', 'refunded');
exception
  when duplicate_object then null;
end
$$;

create table if not exists public.bid_deposits (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  bidder_id uuid not null references public.profiles (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  percent numeric(5, 2) not null check (percent between 0 and 100),
  deposit numeric(12, 2) not null check (deposit > 0),
  method text not null check (method in ('bKash', 'Nagad')),
  sender_number text not null check (char_length(sender_number) between 11 and 20),
  transaction_id citext not null,
  status bid_deposit_status not null default 'pending',
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists bid_deposits_status_idx
  on public.bid_deposits (status, created_at desc);
create index if not exists bid_deposits_bidder_idx
  on public.bid_deposits (bidder_id, created_at desc);

-- A bKash/Nagad TrxID is unique per provider. Scoping the unique index to
-- (method, transaction_id) lets the same receipt string exist in both wallets
-- while still blocking a receipt from being submitted twice.
create unique index if not exists bid_deposits_trx_idx
  on public.bid_deposits (method, transaction_id);

-- One pending deposit per bidder per auction. Rejected bids may retry.
create unique index if not exists bid_deposits_one_pending_idx
  on public.bid_deposits (auction_id, bidder_id)
  where status = 'pending';

alter table public.bid_deposits enable row level security;

-- Members read their own deposits; admins read everything.
drop policy if exists "bid_deposits: read own or admin" on public.bid_deposits;
create policy "bid_deposits: read own or admin"
  on public.bid_deposits for select
  using (bidder_id = auth.uid() or public.is_admin());

-- There is deliberately NO insert policy: request_bid_deposit() is the only
-- write path. There is no delete policy either, so the queue is append-only.
drop policy if exists "bid_deposits: admin update" on public.bid_deposits;
create policy "bid_deposits: admin update"
  on public.bid_deposits for update
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. Step 1: a member requests a bid by submitting a deposit
-- ----------------------------------------------------------------------------
create or replace function public.request_bid_deposit(
  p_auction_id uuid,
  p_amount numeric,
  p_method text,
  p_sender_number text,
  p_transaction_id text
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
  v_percent numeric;
  v_deposit numeric;
  v_id uuid;
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'error', 'auth');
  end if;

  select * into v_profile from public.profiles where id = v_uid;
  if not found or v_profile.suspended then
    return jsonb_build_object('ok', false, 'error', 'suspended');
  end if;
  if v_profile.phone_verified = false then
    return jsonb_build_object('ok', false, 'error', 'verify_phone');
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
  if v_auction.seller_id = v_uid then
    return jsonb_build_object('ok', false, 'error', 'own');
  end if;

  if p_method not in ('bKash', 'Nagad') then
    return jsonb_build_object('ok', false, 'error', 'method');
  end if;
  if p_sender_number is null or char_length(regexp_replace(p_sender_number, '\D', '', 'g')) < 11 then
    return jsonb_build_object('ok', false, 'error', 'sender');
  end if;
  if p_transaction_id is null or char_length(trim(p_transaction_id)) < 6 then
    return jsonb_build_object('ok', false, 'error', 'trx');
  end if;

  select coalesce(max(amount), 0) into v_highest
  from public.bids
  where auction_id = p_auction_id;

  if v_auction.format = 'sealed' then
    v_min := greatest(v_auction.starting_bid, v_highest + 0.01);
  else
    v_min := case
      when v_auction.current_bid is null then v_auction.starting_bid
      else v_auction.current_bid + v_auction.min_increment
    end;
    v_min := greatest(v_min, v_highest + 0.01);
  end if;

  if p_amount is null or p_amount < v_min then
    return jsonb_build_object('ok', false, 'error', 'low', 'minimum', v_min);
  end if;

  if exists (
    select 1 from public.bid_deposits
    where method = p_method
      and transaction_id = trim(p_transaction_id)
  ) then
    return jsonb_build_object('ok', false, 'error', 'duplicate_trx');
  end if;

  if exists (
    select 1 from public.bid_deposits
    where auction_id = p_auction_id
      and bidder_id = v_uid
      and status = 'pending'
  ) then
    return jsonb_build_object('ok', false, 'error', 'pending');
  end if;

  select * into v_settings from public.admin_settings where id = true;
  v_percent := greatest(0, least(100, coalesce(v_settings.bid_deposit_percent, 10)));
  v_deposit := greatest(1, round(p_amount * (v_percent / 100), 2));

  select l.* into v_listing from public.listings l where l.id = v_auction.listing_id;

  insert into public.bid_deposits (
    auction_id, listing_id, bidder_id, amount, percent, deposit,
    method, sender_number, transaction_id
  )
  values (
    p_auction_id, v_auction.listing_id, v_uid, p_amount, v_percent, v_deposit,
    p_method, trim(p_sender_number), trim(p_transaction_id)
  )
  returning id into v_id;

  insert into public.notifications (user_id, title_en, title_bn, body_en, body_bn, href)
  values (
    v_uid,
    'Bid deposit submitted',
    'বিড ডিপোজিট জমা হয়েছে',
    'An admin is checking your ' || p_method || ' transaction. The bid goes live after approval.',
    'অ্যাডমিন আপনার ' || p_method || ' ট্রানজেকশন যাচাই করছেন। অনুমোদনের পর বিড চালু হবে।',
    '/listing/' || v_auction.listing_id
  );

  perform public.write_audit(
    'bid_deposit.requested',
    'bid_deposit:' || v_id::text,
    jsonb_build_object(
      'auction_id', p_auction_id,
      'amount', p_amount,
      'deposit', v_deposit,
      'method', p_method,
      'transaction_id', p_transaction_id,
      'listing_title', v_listing.title
    )
  );

  return jsonb_build_object(
    'ok', true,
    'deposit_id', v_id,
    'deposit', v_deposit,
    'percent', v_percent,
    'status', 'pending'
  );
end;
$$;

revoke all on function public.request_bid_deposit(uuid, numeric, text, text, text) from public;
grant execute on function public.request_bid_deposit(uuid, numeric, text, text, text) to authenticated;

-- ----------------------------------------------------------------------------
-- 5. Step 2: an admin verifies the TrxID → the bid is placed
-- ----------------------------------------------------------------------------
create or replace function public.confirm_bid_deposit(
  p_deposit_id uuid,
  p_approve boolean,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deposit public.bid_deposits%rowtype;
  v_auction public.auctions%rowtype;
  v_settings public.admin_settings%rowtype;
  v_highest numeric;
  v_min numeric;
  v_new_end timestamptz := null;
  v_previous_bidder uuid;
  v_bid_id uuid;
begin
  if not public.is_admin() then
    raise exception 'Only an administrator can confirm bid deposits';
  end if;

  select * into v_deposit
  from public.bid_deposits
  where id = p_deposit_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'missing');
  end if;
  if v_deposit.status <> 'pending' then
    return jsonb_build_object('ok', false, 'error', 'reviewed');
  end if;

  if not p_approve then
    update public.bid_deposits
    set status = 'rejected', reviewed_by = auth.uid(), reviewed_at = now(), note = p_note
    where id = p_deposit_id;

    insert into public.notifications (user_id, title_en, title_bn, body_en, body_bn, href)
    values (
      v_deposit.bidder_id,
      'Bid deposit rejected',
      'বিড ডিপোজিট প্রত্যাখ্যাত',
      'Your transaction could not be verified. Contact support through the dashboard.',
      'আপনার ট্রানজেকশন যাচাই করা যায়নি। ড্যাশবোর্ড থেকে সাপোর্টে যোগাযোগ করুন।',
      '/dashboard/support'
    );

    perform public.write_audit(
      'bid_deposit.rejected',
      'bid_deposit:' || p_deposit_id::text,
      jsonb_build_object('transaction_id', v_deposit.transaction_id, 'note', p_note)
    );

    return jsonb_build_object('ok', true, 'status', 'rejected');
  end if;

  select * into v_auction
  from public.auctions
  where id = v_deposit.auction_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  if v_auction.status <> 'live' or now() >= v_auction.ends_at then
    return jsonb_build_object('ok', false, 'error', 'closed');
  end if;
  if v_auction.seller_id = v_deposit.bidder_id then
    return jsonb_build_object('ok', false, 'error', 'own');
  end if;

  select coalesce(max(amount), 0) into v_highest
  from public.bids
  where auction_id = v_deposit.auction_id;

  if v_auction.format = 'sealed' then
    v_min := greatest(v_auction.starting_bid, v_highest + 0.01);
  else
    v_min := case
      when v_auction.current_bid is null then v_auction.starting_bid
      else v_auction.current_bid + v_auction.min_increment
    end;
    v_min := greatest(v_min, v_highest + 0.01);
  end if;

  if v_deposit.amount < v_min then
    return jsonb_build_object('ok', false, 'error', 'low', 'minimum', v_min);
  end if;

  -- Remember the previous leader so they can be told they were outbid.
  if v_auction.current_bid is not null then
    select bidder_id into v_previous_bidder
    from public.bids
    where auction_id = v_deposit.auction_id
    order by amount desc, created_at asc
    limit 1;
  end if;

  insert into public.bids (auction_id, bidder_id, amount, is_proxy)
  values (v_deposit.auction_id, v_deposit.bidder_id, v_deposit.amount, false)
  returning id into v_bid_id;

  select * into v_settings from public.admin_settings where id = true;

  if now() > v_auction.ends_at - make_interval(mins => v_settings.anti_snipe_minutes) then
    v_new_end := greatest(
      v_auction.ends_at,
      now() + make_interval(mins => v_settings.anti_snipe_minutes)
    );
  end if;

  update public.auctions
  set
    bid_count = bid_count + 1,
    current_bid = case when format = 'english' then v_deposit.amount else current_bid end,
    ends_at = coalesce(v_new_end, ends_at),
    updated_at = now()
  where id = v_auction.id;

  -- The verified deposit is now part of the wallet ledger. The reference
  -- matches place_bid()'s deposit check for future direct bids.
  if not exists (
    select 1 from public.wallet_transactions
    where user_id = v_deposit.bidder_id
      and kind = 'bid_deposit'
      and reference = 'auction:' || v_deposit.auction_id::text
  ) then
    insert into public.wallet_transactions (user_id, kind, status, amount, reference, note)
    values (
      v_deposit.bidder_id,
      'bid_deposit',
      'completed',
      v_deposit.deposit,
      'auction:' || v_deposit.auction_id::text,
      'Verified auction bid deposit ' || p_deposit_id::text
    );
  end if;

  update public.bid_deposits
  set status = 'confirmed', reviewed_by = auth.uid(), reviewed_at = now(), note = p_note
  where id = p_deposit_id;

  insert into public.notifications (user_id, title_en, title_bn, body_en, body_bn, href)
  values (
    v_deposit.bidder_id,
    'Deposit confirmed — bid placed',
    'ডিপোজিট নিশ্চিত — বিড বসেছে',
    'Your verified deposit placed a bid of ৳' || v_deposit.amount || '.',
    'যাচাইকৃত ডিপোজিটে ৳' || v_deposit.amount || ' বিড বসেছে।',
    '/listing/' || v_deposit.listing_id
  );

  if v_previous_bidder is not null and v_previous_bidder <> v_deposit.bidder_id then
    insert into public.notifications (user_id, title_en, title_bn, body_en, body_bn, href)
    values (
      v_previous_bidder,
      'You have been outbid',
      'আপনাকে ছাড়িয়ে গেছে',
      'A verified bid of ৳' || v_deposit.amount || ' was placed.',
      '৳' || v_deposit.amount || ' এর একটি যাচাইকৃত বিড পড়েছে।',
      '/listing/' || v_deposit.listing_id
    );
  end if;

  perform public.write_audit(
    'bid_deposit.confirmed',
    'bid_deposit:' || p_deposit_id::text,
    jsonb_build_object(
      'auction_id', v_deposit.auction_id,
      'bidder_id', v_deposit.bidder_id,
      'amount', v_deposit.amount,
      'deposit', v_deposit.deposit,
      'bid_id', v_bid_id,
      'extended_to', v_new_end
    )
  );

  return jsonb_build_object(
    'ok', true,
    'status', 'confirmed',
    'bid_id', v_bid_id,
    'amount', v_deposit.amount,
    'ends_at', coalesce(v_new_end, v_auction.ends_at),
    'minimum_next', v_deposit.amount + v_auction.min_increment
  );
end;
$$;

revoke all on function public.confirm_bid_deposit(uuid, boolean, text) from public;
grant execute on function public.confirm_bid_deposit(uuid, boolean, text) to authenticated;

-- ----------------------------------------------------------------------------
-- 6. Admin refund helper: money returned outside the platform, row marked.
-- ----------------------------------------------------------------------------
create or replace function public.refund_bid_deposit(p_deposit_id uuid, p_note text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deposit public.bid_deposits%rowtype;
begin
  if not public.is_admin() then
    raise exception 'Only an administrator can refund bid deposits';
  end if;

  select * into v_deposit from public.bid_deposits where id = p_deposit_id for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'missing');
  end if;
  if v_deposit.status not in ('pending', 'confirmed') then
    return jsonb_build_object('ok', false, 'error', 'reviewed');
  end if;

  -- Do not pull the deposit out from under a live bid. A confirmed deposit can
  -- only be refunded after the auction has ended (the member did not win).
  if v_deposit.status = 'confirmed' then
    if exists (
      select 1 from public.auctions
      where id = v_deposit.auction_id
        and status = 'live'
        and now() < ends_at
    ) then
      return jsonb_build_object('ok', false, 'error', 'bid_live');
    end if;
  end if;

  update public.bid_deposits
  set status = 'refunded', reviewed_by = auth.uid(), reviewed_at = now(), note = p_note
  where id = p_deposit_id;

  insert into public.wallet_transactions (user_id, kind, status, amount, reference, note)
  values (
    v_deposit.bidder_id,
    'bid_deposit_refund',
    'completed',
    v_deposit.deposit,
    'bid_deposit:' || p_deposit_id::text,
    coalesce(p_note, 'Refundable auction bid deposit')
  );

  perform public.write_audit(
    'bid_deposit.refunded',
    'bid_deposit:' || p_deposit_id::text,
    jsonb_build_object('amount', v_deposit.deposit)
  );

  return jsonb_build_object('ok', true, 'status', 'refunded');
end;
$$;

revoke all on function public.refund_bid_deposit(uuid, text) from public;
grant execute on function public.refund_bid_deposit(uuid, text) to authenticated;
