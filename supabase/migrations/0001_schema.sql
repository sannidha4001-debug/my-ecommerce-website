-- ============================================================================
-- GameXchange · 0001 schema
-- Run this in the Supabase SQL editor, or with `supabase db push`.
-- Every table here is protected by RLS in 0002_policies.sql.
-- ============================================================================

create extension if not exists pgcrypto;
create extension if not exists citext;

-- ----------------------------------------------------------------------------
-- Enums keep status strings honest at the database layer.
-- ----------------------------------------------------------------------------
create type user_role as enum ('buyer', 'seller', 'super_admin', 'moderator');
create type kyc_status as enum ('unverified', 'pending', 'verified', 'rejected');
create type listing_kind as enum ('fixed', 'auction');
create type listing_status as enum ('draft', 'pending_review', 'active', 'paused', 'sold', 'rejected', 'archived');
create type auction_status as enum ('scheduled', 'live', 'paused', 'ended', 'cancelled', 'unsold');
create type auction_format as enum ('english', 'sealed');
create type order_status as enum (
  'awaiting_payment', 'payment_submitted', 'payment_confirmed',
  'delivered', 'completed', 'disputed', 'refunded', 'cancelled'
);
create type offer_status as enum ('pending', 'accepted', 'declined', 'countered', 'withdrawn');
create type thread_status as enum ('open', 'waiting', 'resolved', 'closed');
create type report_status as enum ('open', 'investigating', 'waiting', 'resolved');
create type wallet_kind as enum (
  'deposit', 'withdrawal', 'sale_payout', 'refund', 'bid_deposit', 'bid_deposit_refund'
);
create type wallet_status as enum ('pending', 'completed', 'failed', 'cancelled');

-- ----------------------------------------------------------------------------
-- Profiles mirror auth.users. One row per person, user or admin.
-- ----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email citext not null unique,
  full_name text not null default '',
  phone text,
  phone_verified boolean not null default false,
  role user_role not null default 'buyer',
  kyc_status kyc_status not null default 'unverified',
  wallet_balance numeric(12, 2) not null default 0 check (wallet_balance >= 0),
  strikes smallint not null default 0 check (strikes between 0 and 3),
  suspended boolean not null default false,
  trust_score smallint not null default 50 check (trust_score between 0 and 100),
  totp_enabled boolean not null default false,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);
create index profiles_kyc_idx on public.profiles (kyc_status);

-- ----------------------------------------------------------------------------
-- Single-row platform settings. The admin console writes here.
-- ----------------------------------------------------------------------------
create table public.admin_settings (
  id boolean primary key default true check (id),
  commission_rate numeric(5, 2) not null default 7 check (commission_rate between 0 and 25),
  min_fee numeric(10, 2) not null default 50 check (min_fee >= 0),
  bkash_number text not null default '01711-000111',
  nagad_number text not null default '01811-000222',
  support_phone text not null default '09610-000111',
  support_email text not null default 'support@gamexchange.com.bd',
  inspection_hours integer not null default 48 check (inspection_hours between 1 and 240),
  anti_snipe_minutes integer not null default 2 check (anti_snipe_minutes between 0 and 30),
  auction_deposit numeric(10, 2) not null default 500,
  maintenance_mode boolean not null default false,
  require_totp boolean not null default true,
  auto_approve_listings boolean not null default false,
  updated_by uuid references public.profiles (id),
  updated_at timestamptz not null default now()
);

insert into public.admin_settings (id) values (true) on conflict do nothing;

-- ----------------------------------------------------------------------------
-- Catalogue
-- ----------------------------------------------------------------------------
create table public.games (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique,
  name text not null,
  name_bn text,
  icon_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete cascade,
  game_id uuid not null references public.games (id),
  kind listing_kind not null default 'fixed',
  status listing_status not null default 'pending_review',
  title text not null check (char_length(title) between 8 and 140),
  description text not null check (char_length(description) <= 5000),
  level integer check (level is null or level between 0 and 999),
  rank_label text,
  platform text,
  region text default 'Bangladesh',
  price numeric(12, 2) not null check (price >= 0),
  cover_url text,
  tags text[] not null default '{}',
  views integer not null default 0,
  approved_by uuid references public.profiles (id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index listings_status_idx on public.listings (status);
create index listings_game_idx on public.listings (game_id);
create index listings_seller_idx on public.listings (seller_id);

create table public.listing_media (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  storage_path text not null,
  media_type text not null check (media_type in ('image', 'video')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.auctions (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null unique references public.listings (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  format auction_format not null default 'english',
  status auction_status not null default 'scheduled',
  starting_bid numeric(12, 2) not null check (starting_bid > 0),
  reserve_price numeric(12, 2),
  buy_now_price numeric(12, 2),
  min_increment numeric(10, 2) not null default 500 check (min_increment > 0),
  deposit numeric(10, 2) not null default 500 check (deposit >= 0),
  current_bid numeric(12, 2),
  bid_count integer not null default 0,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  original_ends_at timestamptz not null,
  winner_id uuid references public.profiles (id),
  winner_due_at timestamptz,
  featured boolean not null default false,
  mystery boolean not null default false,
  flash boolean not null default false,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  check (buy_now_price is null or buy_now_price >= starting_bid),
  check (reserve_price is null or reserve_price >= starting_bid)
);

create index auctions_status_idx on public.auctions (status, ends_at);
create index auctions_ends_idx on public.auctions (ends_at);

-- ----------------------------------------------------------------------------
-- Bids. Sealed bids are hidden until the auction ends (see the masked view).
-- ----------------------------------------------------------------------------
create table public.bids (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions (id) on delete cascade,
  bidder_id uuid not null references public.profiles (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  is_proxy boolean not null default false,
  max_amount numeric(12, 2),
  ip_hash text,
  created_at timestamptz not null default now()
);

create index bids_auction_idx on public.bids (auction_id, created_at desc);
create index bids_bidder_idx on public.bids (bidder_id);

-- ----------------------------------------------------------------------------
-- Escrow orders
-- ----------------------------------------------------------------------------
create table public.orders (
  id text primary key,
  listing_id uuid not null references public.listings (id),
  auction_id uuid references public.auctions (id),
  buyer_id uuid not null references public.profiles (id),
  seller_id uuid not null references public.profiles (id),
  amount numeric(12, 2) not null check (amount > 0),
  fee numeric(12, 2) not null check (fee >= 0),
  payout numeric(12, 2) not null check (payout >= 0),
  method text not null check (method in ('bKash', 'Nagad', 'Bank')),
  payment_reference text,
  status order_status not null default 'awaiting_payment',
  inspection_ends_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (listing_id, buyer_id)
);

create index orders_buyer_idx on public.orders (buyer_id, created_at desc);
create index orders_seller_idx on public.orders (seller_id, created_at desc);
create index orders_status_idx on public.orders (status);

create table public.order_events (
  id bigint generated always as identity primary key,
  order_id text not null references public.orders (id) on delete cascade,
  actor_id uuid references public.profiles (id),
  actor_role user_role,
  status order_status not null,
  note text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- Buyer price offers. All negotiation is visible to admins.
-- ----------------------------------------------------------------------------
create table public.offers (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  message text check (char_length(message) <= 1000),
  status offer_status not null default 'pending',
  counter_amount numeric(12, 2),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index offers_listing_idx on public.offers (listing_id, created_at desc);

-- ----------------------------------------------------------------------------
-- Admin-mediated support threads. There is deliberately no buyer↔seller chat.
-- ----------------------------------------------------------------------------
create table public.threads (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles (id) on delete cascade,
  order_id text references public.orders (id) on delete set null,
  listing_id uuid references public.listings (id) on delete set null,
  subject text not null check (char_length(subject) between 3 and 160),
  topic text not null default 'other',
  status thread_status not null default 'open',
  assigned_admin_id uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.thread_messages (
  id bigint generated always as identity primary key,
  thread_id uuid not null references public.threads (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  author_role user_role not null,
  body text not null check (char_length(body) between 1 and 4000),
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

create index thread_messages_thread_idx on public.thread_messages (thread_id, created_at);

-- ----------------------------------------------------------------------------
-- Wallet, KYC, reports, notifications, audit
-- ----------------------------------------------------------------------------
create table public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind wallet_kind not null,
  status wallet_status not null default 'pending',
  amount numeric(12, 2) not null check (amount <> 0),
  reference text,
  note text,
  created_at timestamptz not null default now()
);

create index wallet_user_idx on public.wallet_transactions (user_id, created_at desc);

create table public.kyc_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  full_name text not null,
  nid_number text not null,
  doc_front_path text,
  doc_back_path text,
  status kyc_status not null default 'pending',
  reviewed_by uuid references public.profiles (id),
  review_note text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles (id) on delete set null,
  target_type text not null check (target_type in ('listing', 'user', 'order', 'bid')),
  target_id text not null,
  type text not null,
  severity text not null default 'Medium' check (severity in ('Low', 'Medium', 'High')),
  status report_status not null default 'open',
  details text not null check (char_length(details) <= 4000),
  resolution text,
  resolved_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title_en text not null,
  title_bn text,
  body_en text not null,
  body_bn text,
  href text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications (user_id, created_at desc);

create table public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles (id),
  actor_role user_role,
  action text not null,
  target text,
  ip inet,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_created_idx on public.audit_log (created_at desc);

-- Admin login attempts are server-only. RLS is enabled with no client policy.
create table public.admin_login_attempts (
  id bigint generated always as identity primary key,
  email citext not null,
  ip inet,
  success boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.wishlist (
  user_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

select '0001 schema created' as result;
