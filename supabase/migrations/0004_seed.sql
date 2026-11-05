-- ============================================================================
-- GameXchange · 0004 seed
-- Safe to run more than once.
-- ============================================================================

insert into public.admin_settings (id)
values (true)
on conflict (id) do nothing;

update public.admin_settings
set
  commission_rate = 7,
  min_fee = 50,
  bkash_number = '01711-000111',
  nagad_number = '01811-000222',
  support_phone = '09610-000111',
  support_email = 'support@gamexchange.com.bd',
  inspection_hours = 48,
  anti_snipe_minutes = 2,
  auction_deposit = 500
where id = true;

insert into public.games (slug, name, name_bn, sort_order)
values
  ('free-fire', 'Free Fire', 'ফ্রি ফায়ার', 1),
  ('efootball', 'eFootball', 'ই-ফুটবল', 2),
  ('pubg-mobile', 'PUBG Mobile', 'পাবজি মোবাইল', 3),
  ('call-of-duty-mobile', 'Call of Duty Mobile', 'কল অফ ডিউটি মোবাইল', 4),
  ('clash-of-clans', 'Clash of Clans', 'ক্ল্যাশ অফ ক্ল্যান্স', 5),
  ('valorant', 'Valorant', 'ভ্যালোরেন্ট', 6)
on conflict (slug) do update
set name = excluded.name,
    name_bn = excluded.name_bn,
    sort_order = excluded.sort_order;

-- Promote an existing registered account to super admin.
-- Only the service role can execute this. Run it once from the SQL editor,
-- then sign in at /admin/login.
create or replace function public.bootstrap_admin(p_email citext)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  select id into v_id from public.profiles where email = p_email;
  if v_id is null then
    raise exception 'No profile found for %. Register the account first.', p_email;
  end if;

  update public.profiles
  set role = 'super_admin', suspended = false
  where id = v_id;

  insert into public.audit_log (actor_id, actor_role, action, target, metadata)
  values (null, null, 'admin.bootstrapped', p_email::text, jsonb_build_object('profile', v_id));

  return 'Promoted ' || p_email::text || ' to super_admin';
end;
$$;

revoke all on function public.bootstrap_admin(citext) from public;
revoke all on function public.bootstrap_admin(citext) from anon;
revoke all on function public.bootstrap_admin(citext) from authenticated;

-- Optional demo catalogue. It only creates listings when a demo seller exists,
-- so this block is a no-op in a fresh project.
do $$
declare
  v_seller uuid;
  v_game uuid;
  v_listing uuid;
begin
  select id into v_seller from public.profiles where email = 'seller@gamexchange.demo';
  if v_seller is null then
    raise notice 'Skipping demo listings: seller@gamexchange.demo does not exist yet.';
    return;
  end if;

  select id into v_game from public.games where slug = 'free-fire';
  if not exists (select 1 from public.listings where seller_id = v_seller) then
    insert into public.listings (
      seller_id, game_id, kind, status, title, description, level, rank_label,
      platform, price, tags, approved_at
    )
    values (
      v_seller, v_game, 'fixed', 'active',
      'Free Fire Grandmaster account · 148 skins · rare bundles',
      'Level 72 account with 148 skins, 12 evo guns and every season pass since 2021. Email and recovery details are transferred through GameXchange escrow only.',
      72, 'Grandmaster', 'Android', 18500,
      array['Grandmaster', '148 skins', 'Email changeable'], now()
    )
    returning id into v_listing;

    insert into public.listing_media (listing_id, storage_path, media_type, sort_order)
    values
      (v_listing, v_seller::text || '/demo-free-fire-1.jpg', 'image', 0),
      (v_listing, v_seller::text || '/demo-free-fire-2.jpg', 'image', 1);
  end if;

  select id into v_game from public.games where slug = 'efootball';
  if not exists (select 1 from public.listings where game_id = v_game and seller_id = v_seller) then
    insert into public.listings (
      seller_id, game_id, kind, status, title, description, level, rank_label,
      platform, price, tags, approved_at
    )
    values (
      v_seller, v_game, 'auction', 'active',
      'eFootball 3400 rating squad · Epic collection',
      'Auctioned squad with 14 Epic players and a full bench. Reserve is set. Winner must pay within 24 hours.',
      58, 'Division 1', 'Android/iOS', 9200,
      array['Auction', 'Epic squad', 'Reserve set'], now()
    );
  end if;
end;
$$;

select '0004 seed complete' as result;
