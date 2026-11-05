# GameXchange

A premium escrow marketplace for buying and selling game accounts in Bangladesh.
Built with **Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion,
Zod and Supabase**.

> **The money is held by GameXchange until the buyer inspects and accepts the
> account.** Every account is a **member** and can buy, sell and bid. Members
> never chat directly — every conversation goes through an admin-mediated
> support thread.

---

## What is inside

| Area | What it does |
| --- | --- |
| Public site | Home, marketplace filters, listing pages, sell flow, trust & legal pages, animated 404 |
| Member dashboard | Escrow orders, 48-hour inspection, price offers, wishlist, wallet, KYC, reviews |
| Sell tools | Image/video uploader, listing drafts, offers received, payout wallet — available to every member |
| Auctions | English + sealed bids, reserve, buy-now, anti-sniping, masked history, auto winner |
| Bid deposits | 10% deposit (configurable) paid to the admin bKash/Nagad number, then admin-confirmed by transaction ID |
| Admin console | Dashboard, listings, auctions + deposit queue, orders, users, reports, finance/CSV, settings, audit log |
| Security | Zod validation, RLS on every table, server-only service key, lockout, TOTP, session timeout |

Everything works **without a backend** in demo mode. Demo accounts, orders,
auctions and wallets are stored in the browser. The included SQL turns the same
screens into a real production application when you connect Supabase.

---

## Quick start

```bash
# 1. Install
npm install

# 2. Start
npm run dev
# open http://localhost:3000
```

No environment variables are needed for the demo.

### Demo accounts

| Portal | Email | Password | Notes |
| --- | --- | --- | --- |
| Member | `buyer@gamexchange.demo` | `demo1234` | Verified member with escrow orders and a pending deposit |
| Member | `seller@gamexchange.demo` | `demo1234` | Member with seller-side listings and payouts |
| Admin | `admin@gamexchange.com.bd` | `admin1234` | Super admin + any 6-digit TOTP |
| Admin | `mod@gamexchange.com.bd` | `admin1234` | Moderator, read-only sensitive actions |

There is no buyer/seller signup choice. Every account is `member` and can buy,
sell and bid from the same profile.

Admin entry: **`/admin/login`** (deliberately separate from `/login`).

> Demo auth uses `localStorage` and a non-httpOnly cookie so middleware can show
> a friendly redirect. The real security boundary is Supabase Auth + RLS, which
> is already written in `supabase/migrations`.

---

## Project map

```
src/
  app/
    (public)/            Public marketing + marketplace routes
    dashboard/           Member portal (optional catch-all sections)
    admin/               Completely separate admin portal + login
  components/
    layout/              Navbar, footer, shells
    ui/                  shadcn-style primitives (hand written)
    animations/          Reveal, tilt, magnetic, counter, particles
    marketplace/         Cards, filters, grids
    listing/             Listing detail, deposit-first bidding, offers, escrow panel
    sell/                Listing form + local media uploader
    dashboard/           Member sections
    admin/               Admin shell, login, sections A/B
  lib/
    i18n/                English + Bangla dictionaries and provider
    demo-data.ts         Catalogue fixtures
    account.ts           Types, status labels, fees, admin seed data
    store.tsx            Client store: auth, orders, deposits, bids, offers, settings
    media.ts             Client-side image/video preview helpers
    utils.ts             cn(), formatBDT(), dates
middleware.ts            Route cookies + security headers
supabase/migrations/     Schema, functions, RLS, seed
```

### Adding a shadcn component later

`components.json` is configured. Use the official CLI if you want more
primitives, or copy a component into `src/components/ui` — the existing
primitives follow the same pattern.

---

## How escrow works

```
awaiting_payment
  → payment_submitted      buyer sends bKash/Nagad reference
  → payment_confirmed      admin verifies the money
  → delivered              seller hands over the account
  → completed              buyer accepts inside 48 hours
```

Other terminal states: `disputed`, `refunded`, `cancelled`.

Rules enforced by the app and the SQL:

- The platform **never asks for or stores a game password**. Only recovery
  details are transferred, inside the admin-mediated flow.
- The seller payout is **7% commission, minimum ৳50** by default. Both numbers
  are editable in **Admin → Settings**; existing orders keep their snapshot.
- The buyer pays the listed price. There is no hidden buyer markup.
- The 48-hour inspection window starts when the order becomes `delivered`.
- Payment instructions on the order page come from **Admin → Settings**
  (`bkashNumber`, `nagadNumber`) so they can change without a deploy.
- Members cannot message each other. Every account can take either side of a
  deal, but all messages go through **Support** (admin-mediated thread) or a
  **price offer** relayed by an admin.

The SQL implementation is `public.order_transition()` in
`supabase/migrations/0002_functions.sql`. It validates the state machine, role
permissions, inspection deadline, payout crediting and audit log in one
transaction.

---

## How auctions work

- Admins create, clone, bulk-schedule, pause/resume, extend, cancel, end early
  and feature auctions. Auction-of-the-day, mystery and flash flags are built in.
- English auctions: highest visible bid wins.
- Sealed auctions: bid amounts stay hidden until the auction ends.
- Reserve price, buy-now price, minimum increment, start/end time and a
  **percentage bid deposit** are supported.
- **Deposit-first bidding:** a verified member enters a bid, pays the configured
  percentage (10% by default) to the admin bKash or Nagad number, then submits
  their sender number and transaction ID. The bid stays out of the auction
  until an admin matches the transaction in **Admin → Auctions → Bid deposit
  confirmations**. The deposit is refundable if they do not win.
- **Anti-sniping:** a bid inside the final 2 minutes extends the clock by 2
  minutes (configurable). This happens while the auction row is locked, so two
  simultaneous bids cannot both win.
- Bidders must have a verified phone (and KYC when a deposit is required).
- The winner has **24 hours** to pay. If they do not, an admin can move the sale
  to the next bidder. Three strikes suspend an account.
- Public history is masked: `auction_bid_history` exposes a hashed bidder label
  and hides sealed amounts while the auction is live.

---

## Connecting Supabase (production)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the migrations in order:
   - `supabase/migrations/0001_schema.sql`
   - `supabase/migrations/0002_functions.sql`
   - `supabase/migrations/0003_policies.sql`
   - `supabase/migrations/0004_seed.sql`
   - `supabase/migrations/0005_hardening.sql`
   - `supabase/migrations/0006_member_role.sql` (adds the `member` enum value)
   - `supabase/migrations/0007_bid_deposits.sql` (deposit queue, RLS, functions)
3. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (**server only**, never `NEXT_PUBLIC_`)
4. Enable **Email** auth in Supabase → Authentication.
5. Register the admin account in the app, then promote it once:

   ```sql
   select public.bootstrap_admin('you@example.com');
   ```

6. Create three Storage buckets (the migration does this for you):
   - `listing-media` — public images/videos
   - `kyc-documents` — private, owner + admin only
   - `avatars` — public
7. Install the Supabase client when you are ready to switch the store:

   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```

The browser anon key is safe **only because RLS is enabled**. The service role
key bypasses RLS and must never reach the client.

### Deploying to Vercel

1. Push the repository to GitHub.
2. Import it in Vercel.
3. Add the same environment variables (production values).
4. Set `NEXT_PUBLIC_SITE_URL` to the deployed domain.
5. Deploy. Vercel runs `npm run build` automatically.

---

## Security notes

- **RLS on every table**, with explicit policies in `0003_policies.sql` and
  `0007_bid_deposits.sql`.
- Bids are written only after an admin confirms a deposit. Members call
  `request_bid_deposit()`; admins call `confirm_bid_deposit()`, which inserts the
  bid and updates the auction atomically. There is no client insert policy on
  `bid_deposits` or `bids`.
- Order status changes only through `order_transition()`; members can submit
  payment/confirm/dispute, mark delivered, and admins can do anything.
- A profile trigger blocks users from changing their own role, KYC, balance,
  strikes or verification flags.
- The admin portal is a separate route tree. In production, protect it on the
  server with a role check in `src/app/admin/layout.tsx` (using Supabase
  `getUser()` + profile role) **in addition to** middleware and RLS.
- Admin demo lockout: 5 failed attempts → 5-minute lock. Optional TOTP.
- Session timeouts: 30 minutes for users, 15 minutes for admins.
- Uploads: validate MIME type and size, store under `userId/filename`, never
  trust the original filename. KYC documents use a private bucket.
- Never log request bodies containing NID numbers, phone numbers or tokens.
- `middleware.ts` adds `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy` and a restrictive `Permissions-Policy`.

### Known demo limitations

These are intentional so the UI can run with zero credentials:

- Auth, orders, wallet balances and bid deposits live in `localStorage`, not
  Postgres. Admin confirmation of a deposit is simulated in the client store;
  the SQL functions enforce the real rule.
- Media uploads show a local preview and simulated progress; files never leave
  the browser. Wire the uploader to `listing-media` before launch.
- CSV exports are generated in the browser from demo data.
- `middleware.ts` checks cookies only. Supabase server verification is the real
  gate once env vars and the client are installed.

---

## Scripts

```bash
npm run dev       # local development
npm run build     # production build
npm run start     # serve the production build
npm run lint      # eslint
npx tsc --noEmit  # strict type check
```

---

## Design

- Dark-first palette: `#0a0a1f`, `#0f1030`, blue → purple gradients.
- Glassmorphism, aurora, grain, glow and particle layers.
- Inter for body, Space Grotesk for display.
- Site-wide English/Bangla toggle and dark/light toggle.
- Reduced-motion is respected by every animation.
- Mobile-first layout; the marketplace, listing, sell, dashboard and admin
  screens all work at 360 px wide.

---

## License

Private project. All demo data is fictional.
