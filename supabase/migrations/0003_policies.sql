-- ============================================================================
-- GameXchange · 0003 Row Level Security
-- Default posture: deny everything, then allow the smallest useful access.
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.admin_settings enable row level security;
alter table public.games enable row level security;
alter table public.listings enable row level security;
alter table public.listing_media enable row level security;
alter table public.auctions enable row level security;
alter table public.bids enable row level security;
alter table public.orders enable row level security;
alter table public.order_events enable row level security;
alter table public.offers enable row level security;
alter table public.threads enable row level security;
alter table public.thread_messages enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.kyc_submissions enable row level security;
alter table public.reports enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_log enable row level security;
alter table public.admin_login_attempts enable row level security;
alter table public.wishlist enable row level security;

-- ----------------------------------------------------------------------------
-- Profiles
-- ----------------------------------------------------------------------------
create policy "profiles: read own or admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles: update own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles: admin update"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- Public seller directory exposes only non-sensitive columns.
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
where p.role in ('buyer', 'seller') and p.suspended = false;

grant select on public.public_sellers to anon, authenticated;

-- ----------------------------------------------------------------------------
-- Settings (public read; only a super admin may change)
-- ----------------------------------------------------------------------------
create policy "settings: public read"
  on public.admin_settings for select
  using (true);

create policy "settings: super admin update"
  on public.admin_settings for update
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- ----------------------------------------------------------------------------
-- Games
-- ----------------------------------------------------------------------------
create policy "games: public read"
  on public.games for select
  using (is_active = true or public.is_admin());

create policy "games: admin write"
  on public.games for all
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- Listings
-- ----------------------------------------------------------------------------
create policy "listings: public active, own or admin"
  on public.listings for select
  using (
    status = 'active'
    or seller_id = auth.uid()
    or public.is_admin()
  );

create policy "listings: seller insert"
  on public.listings for insert
  with check (
    seller_id = auth.uid()
    and status in ('draft', 'pending_review')
  );

create policy "listings: seller edit or admin"
  on public.listings for update
  using (seller_id = auth.uid() or public.is_admin())
  with check (
    public.is_admin()
    or (seller_id = auth.uid() and status in ('draft', 'pending_review', 'paused', 'active'))
  );

create policy "listings: seller delete draft or admin"
  on public.listings for delete
  using (
    public.is_admin()
    or (seller_id = auth.uid() and status in ('draft', 'pending_review'))
  );

-- ----------------------------------------------------------------------------
-- Listing media
-- ----------------------------------------------------------------------------
create policy "media: read visible listing"
  on public.listing_media for select
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.status = 'active' or l.seller_id = auth.uid())
    )
    or public.is_admin()
  );

create policy "media: owner insert"
  on public.listing_media for insert
  with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.seller_id = auth.uid()
    )
    or public.is_admin()
  );

create policy "media: owner delete"
  on public.listing_media for delete
  using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id and l.seller_id = auth.uid()
    )
    or public.is_admin()
  );

-- ----------------------------------------------------------------------------
-- Auctions (admin-created, public read)
-- ----------------------------------------------------------------------------
create policy "auctions: public or participant"
  on public.auctions for select
  using (
    status in ('live', 'scheduled', 'ended', 'unsold')
    or seller_id = auth.uid()
    or winner_id = auth.uid()
    or public.is_admin()
  );

create policy "auctions: admin write"
  on public.auctions for all
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- Bids. Direct inserts are denied; place_bid() is the only write path.
-- ----------------------------------------------------------------------------
create policy "bids: own or admin"
  on public.bids for select
  using (bidder_id = auth.uid() or public.is_admin());

-- Masked bid history for everyone. Bidder identities are hashed, and sealed
-- amounts stay hidden until the auction is over.
create or replace view public.auction_bid_history
with (security_invoker = false)
as
select
  b.id,
  b.auction_id,
  case
    when a.format = 'sealed' and a.status in ('scheduled', 'live', 'paused') then null
    else b.amount
  end as amount,
  'Bidder ' || upper(substr(md5(b.bidder_id::text), 1, 4)) as bidder_label,
  b.created_at,
  (a.winner_id = b.bidder_id) as is_winner
from public.bids b
join public.auctions a on a.id = b.auction_id
where a.format = 'english' or a.status in ('ended', 'unsold', 'cancelled');

grant select on public.auction_bid_history to anon, authenticated;

-- ----------------------------------------------------------------------------
-- Orders & escrow events
-- ----------------------------------------------------------------------------
create policy "orders: participants or admin"
  on public.orders for select
  using (
    buyer_id = auth.uid()
    or seller_id = auth.uid()
    or public.is_admin()
  );

create policy "orders: buyer insert"
  on public.orders for insert
  with check (buyer_id = auth.uid() and status = 'awaiting_payment');

-- Status changes must go through order_transition(); no client update policy.

create policy "order events: participants or admin"
  on public.order_events for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
    )
    or public.is_admin()
  );

-- ----------------------------------------------------------------------------
-- Offers
-- ----------------------------------------------------------------------------
create policy "offers: buyer, seller or admin"
  on public.offers for select
  using (
    buyer_id = auth.uid()
    or seller_id = auth.uid()
    or public.is_admin()
  );

create policy "offers: buyer insert"
  on public.offers for insert
  with check (
    buyer_id = auth.uid()
    and status = 'pending'
    and seller_id = (select seller_id from public.listings where id = listing_id)
  );

create policy "offers: seller or admin update"
  on public.offers for update
  using (seller_id = auth.uid() or public.is_admin())
  with check (seller_id = auth.uid() or public.is_admin());

-- ----------------------------------------------------------------------------
-- Admin-mediated support threads (no buyer↔seller direct chat)
-- ----------------------------------------------------------------------------
create policy "threads: creator, participant or admin"
  on public.threads for select
  using (
    created_by = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.buyer_id = auth.uid() or o.seller_id = auth.uid())
    )
  );

create policy "threads: authenticated create"
  on public.threads for insert
  with check (created_by = auth.uid());

create policy "threads: admin update"
  on public.threads for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "thread messages: visible thread"
  on public.thread_messages for select
  using (
    (is_internal = false or public.is_admin())
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

create policy "thread messages: participant insert"
  on public.thread_messages for insert
  with check (
    author_id = auth.uid()
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
-- Wallet, KYC, reports, notifications, audit
-- ----------------------------------------------------------------------------
create policy "wallet: own or admin"
  on public.wallet_transactions for select
  using (user_id = auth.uid() or public.is_admin());

-- Writes are server-only (deposits, refunds, payouts).

create policy "kyc: own or admin"
  on public.kyc_submissions for select
  using (user_id = auth.uid() or public.is_admin());

create policy "kyc: own insert"
  on public.kyc_submissions for insert
  with check (user_id = auth.uid() and status = 'pending');

create policy "kyc: admin update"
  on public.kyc_submissions for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "reports: reporter or admin"
  on public.reports for select
  using (reporter_id = auth.uid() or public.is_admin());

create policy "reports: reporter insert"
  on public.reports for insert
  with check (reporter_id = auth.uid() and status = 'open');

create policy "reports: admin update"
  on public.reports for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "notifications: own"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "notifications: own update"
  on public.notifications for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "audit: admins read"
  on public.audit_log for select
  using (public.is_admin());

-- audit_log has no insert policy: write_audit() is security definer.

-- admin_login_attempts has RLS enabled and zero policies. Only the service
-- role (server) can read or write it.

-- ----------------------------------------------------------------------------
-- Wishlist
-- ----------------------------------------------------------------------------
create policy "wishlist: own"
  on public.wishlist for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- Function execution. Bidding and escrow state changes are authenticated only.
-- ----------------------------------------------------------------------------
revoke all on function public.place_bid(uuid, numeric, numeric, text) from public;
revoke all on function public.order_transition(text, order_status, text) from public;
revoke all on function public.finalize_auction(uuid) from public;
revoke all on function public.write_audit(text, text, jsonb) from public;

grant execute on function public.place_bid(uuid, numeric, numeric, text) to authenticated;
grant execute on function public.order_transition(text, order_status, text) to authenticated;
grant execute on function public.finalize_auction(uuid) to authenticated;
grant execute on function public.write_audit(text, text, jsonb) to authenticated;

-- ----------------------------------------------------------------------------
-- Storage buckets
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('listing-media', 'listing-media', true, 26214400, array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']),
  ('kyc-documents', 'kyc-documents', false, 5242880, array['image/jpeg', 'image/png', 'application/pdf']),
  ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "storage: public listing media read"
  on storage.objects for select
  using (bucket_id in ('listing-media', 'avatars'));

create policy "storage: users upload listing media"
  on storage.objects for insert
  with check (
    bucket_id in ('listing-media', 'avatars')
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage: owners update own media"
  on storage.objects for update
  using (
    bucket_id in ('listing-media', 'avatars')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage: owners delete own media"
  on storage.objects for delete
  using (
    bucket_id in ('listing-media', 'avatars')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- KYC documents are private: only the owner and admins can read them.
create policy "storage: kyc owner or admin read"
  on storage.objects for select
  using (
    bucket_id = 'kyc-documents'
    and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  );

create policy "storage: kyc owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'kyc-documents'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

select '0003 policies created' as result;
