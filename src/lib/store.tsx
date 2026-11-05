"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";
import {
  bidDepositFor,
  commissionFor,
  DEFAULT_SETTINGS,
  DEMO_ACCOUNTS,
  DEMO_ADMINS,
  DEMO_ADMIN_PASSWORDS,
  DEMO_PASSWORDS,
  escrowStatusLabel,
  seedBidDeposits,
  seedListingState,
  seedNotifications,
  seedOffers,
  seedOrders,
  seedThreads,
  type Account,
  type AdminSettings,
  type AdminUser,
  type Bid,
  type BidDeposit,
  type EscrowStatus,
  type Notification,
  type Offer,
  type OfferStatus,
  type Order,
  type Thread,
  type TimelineEntry,
} from "@/lib/account";
import { listings as baseListings, type Listing } from "@/lib/demo-data";
import { clamp } from "@/lib/utils";

/**
 * AppStore — the demo "backend" for the browser.
 *
 * It owns the signed-in user, orders, offers, support threads, bids, bid
 * deposits, wishlist and admin session, and mirrors every action the Supabase
 * layer will expose:
 *   createOrder(), requestBidDeposit(), confirmBidDeposit(), makeOffer()…
 *
 * Persistence is localStorage so the whole flow survives refreshes during a
 * demo. No passwords for game accounts are ever stored, and there is no
 * member↔member channel: all messages live in admin-moderated threads.
 */

const STORAGE_KEY = "gx-state-v2";
const ACCOUNTS_KEY = "gx-registered-v2";
const ADMIN_KEY = "gx-admin-session-v2";
const LOCK_KEY = "gx-admin-lock-v2";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity
const ADMIN_TIMEOUT_MS = 15 * 60 * 1000; // admins expire faster
const BID_INCREMENT = 500;

type RegisteredAccount = { user: Account; password: string };

type StoreState = {
  user: Account | null;
  orders: Order[];
  offers: Offer[];
  threads: Thread[];
  notifications: Notification[];
  watchlist: string[];
  customListings: Listing[];
  bids: Record<string, Bid[]>;
  bidDeposits: BidDeposit[];
  endsAt: Record<string, string>;
  settings: AdminSettings;
};

type PersistedState = Omit<StoreState, "endsAt"> & {
  endsAt: Record<string, string>;
};

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/** Mask a member name for the public bid history, e.g. `ay***42`. */
function maskBidderName(name: string) {
  const first = name.trim().slice(0, 2).toLowerCase() || "me";
  return `${first}***${String(Math.floor(10 + Math.random() * 89))}`;
}

function minutesFromNow(minutes: number) {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked in private mode — the demo still works
    // for the current tab because React state remains the source of truth.
  }
}

function setCookie(name: string, value: string, maxAge = 60 * 60 * 24 * 7) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

function initialEndsAt() {
  const seedEnds = Object.fromEntries(
    Object.entries(seedListingState)
      .filter(([, value]) => value.endsAt)
      .map(([id, value]) => [id, value.endsAt as string]),
  );
  return seedEnds;
}

function seedState(): StoreState {
  return {
    user: null,
    orders: seedOrders,
    offers: seedOffers,
    threads: seedThreads,
    notifications: seedNotifications,
    watchlist: ["gx-1002"],
    customListings: [],
    bids: {
      "gx-1001": seedListingState["gx-1001"].bids,
      "gx-1002": seedListingState["gx-1002"].bids,
      "gx-1003": seedListingState["gx-1003"].bids,
      "gx-1006": seedListingState["gx-1006"].bids,
    },
    bidDeposits: seedBidDeposits,
    endsAt: initialEndsAt(),
    settings: DEFAULT_SETTINGS,
  };
}

function timelineEntry(
  status: EscrowStatus,
  by: TimelineEntry["by"],
  note?: string,
): TimelineEntry {
  const label = escrowStatusLabel[status];
  return {
    id: uid("tl"),
    status,
    by,
    note,
    at: new Date().toISOString(),
    label,
  };
}

type AppStoreValue = {
  hydrated: boolean;
  user: Account | null;
  adminUser: AdminUser | null;
  listings: Listing[];
  customListings: Listing[];
  orders: Order[];
  offers: Offer[];
  threads: Thread[];
  notifications: Notification[];
  watchlist: string[];
  bids: Record<string, Bid[]>;
  bidDeposits: BidDeposit[];
  endsAt: Record<string, string>;
  settings: AdminSettings;
  unreadNotifications: number;
  signIn: (email: string, password: string) => { ok: boolean; error?: string };
  signUp: (input: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => { ok: boolean; error?: string };
  signOut: () => void;
  adminSignIn: (
    email: string,
    password: string,
  ) => {
    ok: boolean;
    error?: "invalid" | "locked" | "missing";
    lockedUntil?: number;
    needsTotp?: boolean;
  };
  adminVerifyTotp: (code: string) => { ok: boolean; error?: "invalid" | "missing" };
  adminSignOut: () => void;
  createOrder: (listing: Listing, method: string) => { ok: boolean; orderId?: string; error?: string };
  setOrderStatus: (orderId: string, status: EscrowStatus, note?: string) => void;
  openDispute: (orderId: string, reason: string) => void;
  makeOffer: (listing: Listing, amount: number, message: string) => { ok: boolean; error?: string };
  respondOffer: (offerId: string, status: OfferStatus) => void;
  openThread: (input: {
    subject: string;
    topic: Thread["topic"];
    context: string;
    message: string;
    orderId?: string;
    listingId?: string;
  }) => string;
  replyThread: (threadId: string, body: string, author?: "you" | "admin") => void;
  resolveThread: (threadId: string) => void;
  placeBidForMember: (listing: Listing, amount: number, bidderName: string) => { ok: boolean; error?: string };
  requestBidDeposit: (input: {
    listing: Listing;
    amount: number;
    method: "bKash" | "Nagad";
    senderNumber: string;
    transactionId: string;
  }) => { ok: boolean; error?: string; depositId?: string };
  confirmBidDeposit: (
    depositId: string,
    approve: boolean,
    note?: string,
  ) => { ok: boolean; error?: string };
  refundBidDeposit: (depositId: string, note?: string) => { ok: boolean; error?: string };
  bidsFor: (listingId: string) => Bid[];
  endsAtFor: (listingId: string) => string | undefined;
  toggleWatch: (listingId: string) => void;
  isWatched: (listingId: string) => boolean;
  addListing: (input: {
    title: string;
    game: Listing["game"];
    type: Listing["type"];
    price: number;
    level: number;
    rank: string;
    platform: string;
    description: string;
    tags: string[];
  }) => string;
  verifyPhone: () => void;
  submitKyc: () => void;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => { ok: boolean; error?: string };
  markNotificationsRead: () => void;
  updateSettings: (patch: Partial<AdminSettings>) => void;
  getListing: (id: string) => Listing | null;
};

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const { isBangla } = useI18n();
  const [state, setState] = useState<StoreState>(seedState);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  // Password accepted but TOTP not yet entered. No cookie is set until then.
  const [pendingAdmin, setPendingAdmin] = useState<AdminUser | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const lastActivity = useRef(Date.now());
  const adminLastActivity = useRef(Date.now());
  // IDs of deposits currently being approved/rejected (double-click guard).
  const reviewingDeposits = useRef<Set<string>>(new Set());
  const stateRef = useRef(state);
  stateRef.current = state;

  /* ------------------------------ hydration ------------------------------ */
  useEffect(() => {
    const saved = readJson<Partial<PersistedState>>(STORAGE_KEY);
    const adminSession = readJson<AdminUser>(ADMIN_KEY);

    if (adminSession) setAdminUser(adminSession);

    if (saved) {
      const seeds = seedState();
      setState({
        user: saved.user ? { ...saved.user, role: "member" } : null,
        orders: saved.orders ?? seeds.orders,
        offers: saved.offers ?? seeds.offers,
        threads: saved.threads ?? seeds.threads,
        notifications: saved.notifications ?? seeds.notifications,
        watchlist: saved.watchlist ?? seeds.watchlist,
        customListings: saved.customListings ?? [],
        bids: saved.bids ?? seeds.bids,
        bidDeposits: saved.bidDeposits ?? seeds.bidDeposits,
        endsAt: saved.endsAt ?? seeds.endsAt,
        // Merge so settings saved before a new field existed keep a default
        // instead of becoming `undefined` (e.g. bidDepositPercent → NaN).
        settings: { ...DEFAULT_SETTINGS, ...(saved.settings ?? {}) },
      });
    }
    setHydrated(true);
  }, []);

  // Save everything except the admin session (stored separately).
  useEffect(() => {
    if (!hydrated) return;
    const { endsAt, ...rest } = state;
    writeJson(STORAGE_KEY, { ...rest, endsAt } satisfies PersistedState);
  }, [state, hydrated]);

  /* --------------------------- session helpers --------------------------- */
  const signedIn = useCallback((user: Account) => {
    setState((current) => ({ ...current, user }));
    setCookie("gx_session", "1");
    lastActivity.current = Date.now();
  }, []);

  const signOut = useCallback(() => {
    setState((current) => ({ ...current, user: null }));
    clearCookie("gx_session");
  }, []);

  // Inactivity timeout. A production Supabase session uses httpOnly cookies +
  // a refresh token; this mirrors the same 30-minute policy for the demo.
  useEffect(() => {
    if (!state.user) return;
    const markActive = () => {
      lastActivity.current = Date.now();
    };
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "scroll"];
    events.forEach((event) => window.addEventListener(event, markActive, { passive: true }));

    const timer = window.setInterval(() => {
      if (Date.now() - lastActivity.current > SESSION_TIMEOUT_MS) {
        signOut();
        toast.info(
          isBangla
            ? "নিষ্ক্রিয়তার কারণে লগ আউট হয়েছে।"
            : "You were signed out after 30 minutes of inactivity.",
        );
      }
    }, 60_000);

    return () => {
      events.forEach((event) => window.removeEventListener(event, markActive));
      window.clearInterval(timer);
    };
  }, [state.user, signOut, isBangla]);

  /* -------------------------------- auth -------------------------------- */
  const signIn = useCallback(
    (email: string, password: string) => {
      const clean = email.trim().toLowerCase();
      const demo = DEMO_ACCOUNTS.find((account) => account.email === clean);
      if (demo && DEMO_PASSWORDS[clean] === password) {
        signedIn(demo);
        return { ok: true };
      }
      const registered = readJson<RegisteredAccount[]>(ACCOUNTS_KEY) ?? [];
      const match = registered.find(
        (entry) => entry.user.email.toLowerCase() === clean && entry.password === password,
      );
      if (match) {
        signedIn(match.user);
        return { ok: true };
      }
      return { ok: false, error: "invalid" };
    },
    [signedIn],
  );

  const signUp = useCallback(
    (input: {
      name: string;
      email: string;
      phone: string;
      password: string;
    }) => {
      const clean = input.email.trim().toLowerCase();
      const exists =
        DEMO_ACCOUNTS.some((account) => account.email === clean) ||
        (readJson<RegisteredAccount[]>(ACCOUNTS_KEY) ?? []).some(
          (entry) => entry.user.email.toLowerCase() === clean,
        );
      if (exists) return { ok: false, error: "exists" };

      const user: Account = {
        id: uid("usr"),
        name: input.name.trim(),
        email: clean,
        phone: input.phone.trim(),
        role: "member",
        balance: 0,
        kyc: "unverified",
        phoneVerified: false,
        joined: new Intl.DateTimeFormat("en-BD", { month: "short", year: "numeric" }).format(
          new Date(),
        ),
        strikes: 0,
        trustScore: 70,
      };

      const registered = readJson<RegisteredAccount[]>(ACCOUNTS_KEY) ?? [];
      writeJson(ACCOUNTS_KEY, [...registered, { user, password: input.password }]);
      signedIn(user);
      return { ok: true };
    },
    [signedIn],
  );

  /* -------------------------------- admin ------------------------------- */
  const adminSignIn = useCallback((email: string, password: string) => {
    const clean = email.trim().toLowerCase();
    const lock = readJson<{ count: number; lockedUntil: number }>(LOCK_KEY) ?? {
      count: 0,
      lockedUntil: 0,
    };
    if (lock.lockedUntil > Date.now()) {
      return { ok: false as const, error: "locked" as const, lockedUntil: lock.lockedUntil };
    }

    const demo = DEMO_ADMINS.find((account) => account.email === clean);
    if (demo && DEMO_ADMIN_PASSWORDS[clean] === password) {
      writeJson(LOCK_KEY, { count: 0, lockedUntil: 0 });

      // Super admins finish a second factor before a session cookie exists.
      if (demo.twoFactor) {
        setPendingAdmin(demo);
        return { ok: true as const, needsTotp: true };
      }

      writeJson(ADMIN_KEY, demo);
      setAdminUser(demo);
      setCookie("gx_admin", "1", 60 * 60 * 8);
      return { ok: true as const };
    }

    const count = lock.count + 1;
    if (count >= 5) {
      const lockedUntil = Date.now() + 5 * 60 * 1000;
      writeJson(LOCK_KEY, { count, lockedUntil });
      return { ok: false as const, error: "locked" as const, lockedUntil };
    }
    writeJson(LOCK_KEY, { count, lockedUntil: 0 });
    return { ok: false as const, error: "invalid" as const };
  }, []);

  const adminVerifyTotp = useCallback((code: string) => {
    if (!pendingAdmin) return { ok: false as const, error: "missing" as const };
    if (!/^\d{6}$/.test(code)) return { ok: false as const, error: "invalid" as const };

    writeJson(ADMIN_KEY, pendingAdmin);
    setAdminUser(pendingAdmin);
    setPendingAdmin(null);
    setCookie("gx_admin", "1", 60 * 60 * 8);
    return { ok: true as const };
  }, [pendingAdmin]);

  const adminSignOut = useCallback(() => {
    clearCookie("gx_admin");
    try {
      window.localStorage.removeItem(ADMIN_KEY);
    } catch {
      /* ignore */
    }
    setAdminUser(null);
    setPendingAdmin(null);
  }, []);

  // Admin sessions expire after 15 minutes of inactivity. This is shorter than
  // the public session because the console can move money and change settings.
  useEffect(() => {
    if (!adminUser) return;
    adminLastActivity.current = Date.now();
    const markActive = () => {
      adminLastActivity.current = Date.now();
    };
    const events: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "scroll"];
    events.forEach((event) => window.addEventListener(event, markActive, { passive: true }));

    const timer = window.setInterval(() => {
      if (Date.now() - adminLastActivity.current > ADMIN_TIMEOUT_MS) {
        adminSignOut();
        toast.info("Admin session expired after 15 minutes of inactivity.");
      }
    }, 30_000);

    return () => {
      events.forEach((event) => window.removeEventListener(event, markActive));
      window.clearInterval(timer);
    };
  }, [adminUser, adminSignOut]);

  /* ------------------------------- listings ----------------------------- */
  const listings = useMemo(
    () => [...state.customListings, ...baseListings],
    [state.customListings],
  );

  const getListing = useCallback(
    (id: string) => listings.find((item) => item.id === id) ?? null,
    [listings],
  );

  /* -------------------------------- orders ------------------------------ */
  const notify = useCallback(
    (titleEn: string, titleBn: string, bodyEn: string, bodyBn: string, href?: string) => {
      setState((current) => ({
        ...current,
        notifications: [
          {
            id: uid("n"),
            title: { en: titleEn, bn: titleBn },
            body: { en: bodyEn, bn: bodyBn },
            at: new Date().toISOString(),
            read: false,
            href,
          },
          ...current.notifications,
        ],
      }));
    },
    [],
  );

  const createOrder = useCallback(
    (listing: Listing, method: string) => {
      const user = stateRef.current.user;
      if (!user) return { ok: false, error: "auth" };
      if (listing.seller.username.toLowerCase().includes(user.name.split(" ")[0].toLowerCase())) {
        return { ok: false, error: "own" };
      }
      const amount = listing.price;
      const { fee, payout } = commissionFor(amount, stateRef.current.settings);
      const orderId = `GX-${Math.floor(2500 + Math.random() * 7000)}`;
      const order: Order = {
        id: orderId,
        listingId: listing.id,
        title: listing.title,
        game: listing.game.name,
        buyer: user.name,
        seller: listing.seller.username,
        amount,
        fee,
        payout,
        status: "awaiting_payment",
        method,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [timelineEntry("awaiting_payment", "buyer", `Payment via ${method}`)],
      };
      setState((current) => ({ ...current, orders: [order, ...current.orders] }));
      notify(
        "Order created",
        "অর্ডার তৈরি হয়েছে",
        `Pay for ${orderId} within 12 hours to keep the seller reserved.`,
        "বিক্রেতা ধরে রাখতে ১২ ঘণ্টার মধ্যে পেমেন্ট করুন।",
        "/dashboard/orders",
      );
      return { ok: true, orderId };
    },
    [notify],
  );

  const setOrderStatus = useCallback(
    (orderId: string, status: EscrowStatus, note?: string) => {
      setState((current) => ({
        ...current,
        orders: current.orders.map((order) => {
          if (order.id !== orderId) return order;
          return {
            ...order,
            status,
            updatedAt: new Date().toISOString(),
            inspectionEndsAt:
              status === "delivered"
                ? minutesFromNow(stateRef.current.settings.inspectionHours * 60)
                : order.inspectionEndsAt,
            timeline: [
              ...order.timeline,
              timelineEntry(status, status === "disputed" ? "buyer" : "buyer", note),
            ],
          };
        }),
      }));
    },
    [],
  );

  const openDispute = useCallback(
    (orderId: string, reason: string) => {
      setOrderStatus(orderId, "disputed", reason);
      notify(
        "Dispute opened",
        "বিরোধ খোলা হয়েছে",
        "An admin will review the evidence. Keep all proof inside the support thread.",
        "অ্যাডমিন প্রমাণ পর্যালোচনা করবেন। সব প্রমাণ সাপোর্ট থ্রেডে রাখুন।",
        "/dashboard/support",
      );
    },
    [notify, setOrderStatus],
  );

  /* -------------------------------- offers ------------------------------ */
  const makeOffer = useCallback(
    (listing: Listing, amount: number, message: string) => {
      const user = stateRef.current.user;
      if (!user) return { ok: false, error: "auth" };
      if (amount <= 0 || amount > listing.price) return { ok: false, error: "amount" };
      if (listing.type === "auction") return { ok: false, error: "auction" };

      const existing = stateRef.current.offers.find(
        (offer) =>
          offer.listingId === listing.id &&
          offer.buyer === user.name &&
          offer.status === "pending",
      );
      if (existing) return { ok: false, error: "pending" };

      const offer: Offer = {
        id: uid("OFR"),
        listingId: listing.id,
        title: listing.title,
        game: listing.game.name,
        buyer: user.name,
        seller: listing.seller.username,
        listPrice: listing.price,
        amount: Math.round(amount),
        message: message.trim(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setState((current) => ({ ...current, offers: [offer, ...current.offers] }));
      notify(
        "Offer sent to seller",
        "বিক্রেতার কাছে অফার পাঠানো হয়েছে",
        "The admin desk delivered your price offer. You will be notified when it is answered.",
        "অ্যাডমিন ডেস্ক আপনার অফার পৌঁছে দিয়েছে। উত্তর এলে জানানো হবে।",
        "/dashboard/offers",
      );
      return { ok: true };
    },
    [notify],
  );

  const respondOffer = useCallback((offerId: string, status: OfferStatus) => {
    setState((current) => ({
      ...current,
      offers: current.offers.map((offer) =>
        offer.id === offerId ? { ...offer, status } : offer,
      ),
    }));
  }, []);

  /* -------------------------------- threads ----------------------------- */
  const openThread = useCallback(
    (input: {
      subject: string;
      topic: Thread["topic"];
      context: string;
      message: string;
      orderId?: string;
      listingId?: string;
    }) => {
      const id = `TH-${Math.floor(310 + Math.random() * 600)}`;
      const nowIso = new Date().toISOString();
      const thread: Thread = {
        id,
        subject: input.subject,
        topic: input.topic,
        orderId: input.orderId,
        listingId: input.listingId,
        context: input.context,
        status: "open",
        unread: 0,
        createdAt: nowIso,
        updatedAt: nowIso,
        messages: [
          {
            id: uid("msg"),
            author: "you",
            authorName: "You",
            body: input.message,
            at: nowIso,
          },
          {
            id: uid("msg"),
            author: "system",
            authorName: "GameXchange",
            body:
              "Your message is visible to the support team only. Sellers cannot contact buyers directly; everything is handled by an admin.",
            at: nowIso,
          },
        ],
      };
      setState((current) => ({ ...current, threads: [thread, ...current.threads] }));
      return id;
    },
    [],
  );

  const replyThread = useCallback(
    (threadId: string, body: string, author: "you" | "admin" = "you") => {
      const trimmed = body.trim();
      if (!trimmed) return;
      setState((current) => ({
        ...current,
        threads: current.threads.map((thread) => {
          if (thread.id !== threadId) return thread;
          return {
            ...thread,
            updatedAt: new Date().toISOString(),
            messages: [
              ...thread.messages,
              {
                id: uid("msg"),
                author,
                authorName: author === "admin" ? "Support team" : "You",
                body: trimmed,
                at: new Date().toISOString(),
              },
            ],
          };
        }),
      }));
    },
    [],
  );

  const resolveThread = useCallback((threadId: string) => {
    setState((current) => ({
      ...current,
      threads: current.threads.map((thread) =>
        thread.id === threadId ? { ...thread, status: "resolved", unread: 0 } : thread,
      ),
    }));
  }, []);

  /* --------------------------------- bids ------------------------------- */
  const bidsFor = useCallback(
    (listingId: string) =>
      [...(stateRef.current.bids[listingId] ?? [])].sort((a, b) => b.amount - a.amount),
    [],
  );

  const endsAtFor = useCallback(
    (listingId: string) =>
      stateRef.current.endsAt[listingId] ?? seedListingState[listingId]?.endsAt,
    [],
  );

  /**
   * Internal bid writer.
   *
   * Both the admin confirmation path and any future direct path go through
   * this function so minimum increment, own-listing and anti-sniping rules
   * are enforced in exactly one place.
   */
  const placeBidForMember = useCallback(
    (listing: Listing, amount: number, bidderName: string) => {
      const list = bidsFor(listing.id);
      const highest = list[0]?.amount ?? listing.price;
      if (amount < highest + BID_INCREMENT) return { ok: false, error: "low" };
      if (
        listing.seller.username
          .toLowerCase()
          .includes(bidderName.split(" ")[0].toLowerCase())
      ) {
        return { ok: false, error: "own" };
      }

      const now = Date.now();
      const ends = endsAtFor(listing.id);
      const endsMs = ends ? new Date(ends).getTime() : now + 60 * 60 * 1000;
      // Anti-sniping: a bid inside the final window extends the clock by the
      // same amount configured in Admin → Settings.
      const windowMinutes = Math.max(0, stateRef.current.settings.antiSnipeMinutes);
      const extended =
        windowMinutes > 0 && endsMs - now < windowMinutes * 60 * 1000
          ? minutesFromNow(windowMinutes)
          : null;

      const bid: Bid = {
        id: uid("bid"),
        listingId: listing.id,
        bidder: maskBidderName(bidderName),
        amount: Math.round(amount),
        at: new Date().toISOString(),
      };

      setState((current) => ({
        ...current,
        bids: {
          ...current.bids,
          [listing.id]: [...(current.bids[listing.id] ?? []), bid],
        },
        endsAt: extended ? { ...current.endsAt, [listing.id]: extended } : current.endsAt,
      }));

      notify(
        "Bid placed",
        "বিড দেওয়া হয়েছে",
        `${listing.title} — the bid is now the highest at ৳${amount.toLocaleString("en-BD")}.`,
        `${listing.title} — বিড এখন সর্বোচ্চ ৳${amount.toLocaleString("en-BD")}।`,
        `/listing/${listing.id}`,
      );
      return { ok: true };
    },
    [bidsFor, endsAtFor, notify],
  );

  /**
   * Step 1 — the bidder requests to bid by paying the percentage deposit.
   * Nothing reaches the auction yet. An admin must confirm the TrxID first.
   */
  const requestBidDeposit = useCallback(
    (input: {
      listing: Listing;
      amount: number;
      method: "bKash" | "Nagad";
      senderNumber: string;
      transactionId: string;
    }) => {
      const user = stateRef.current.user;
      if (!user) return { ok: false, error: "auth" };
      if (!user.phoneVerified) return { ok: false, error: "phone" };

      const { listing, amount } = input;
      const list = bidsFor(listing.id);
      const highest = list[0]?.amount ?? listing.price;
      if (amount < highest + BID_INCREMENT) return { ok: false, error: "low" };
      if (
        listing.seller.username
          .toLowerCase()
          .includes(user.name.split(" ")[0].toLowerCase())
      ) {
        return { ok: false, error: "own" };
      }
      const sender = input.senderNumber.replace(/[^\d+]/g, "");
      if (sender.replace(/\D/g, "").length < 11) return { ok: false, error: "sender" };
      const trx = input.transactionId.trim();
      if (trx.length < 6) return { ok: false, error: "trx" };

      const alreadyPending = stateRef.current.bidDeposits.some(
        (deposit) =>
          deposit.listingId === listing.id &&
          deposit.bidderEmail === user.email &&
          deposit.status === "pending",
      );
      if (alreadyPending) return { ok: false, error: "pending" };

      // A transaction ID can only be claimed once. This mirrors the unique
      // (method, transaction_id) index in the SQL migration.
      const usedTrx = stateRef.current.bidDeposits.some(
        (deposit) =>
          deposit.method === input.method &&
          deposit.transactionId.toLowerCase() === trx.toLowerCase(),
      );
      if (usedTrx) return { ok: false, error: "trxUsed" };

      const percent = Math.max(0, stateRef.current.settings.bidDepositPercent);
      const depositAmount = bidDepositFor(amount, percent);
      const deposit: BidDeposit = {
        id: uid("DEP"),
        listingId: listing.id,
        listingTitle: listing.title,
        bidder: user.name,
        bidderEmail: user.email,
        amount: Math.round(amount),
        deposit: depositAmount,
        method: input.method,
        senderNumber: input.senderNumber.trim(),
        transactionId: trx,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      setState((current) => ({
        ...current,
        bidDeposits: [deposit, ...current.bidDeposits],
      }));

      notify(
        "Bid deposit submitted",
        "বিড ডিপোজিট জমা হয়েছে",
        `An admin is checking ${deposit.method} TrxID ${trx}. Your ৳${depositAmount.toLocaleString("en-BD")} deposit protects a ৳${Math.round(amount).toLocaleString("en-BD")} bid.`,
        `অ্যাডমিন ${deposit.method} ট্রানজেকশন ${trx} যাচাই করছেন। আপনার ৳${depositAmount.toLocaleString("en-BD")} ডিপোজিট ৳${Math.round(amount).toLocaleString("en-BD")} বিড সুরক্ষিত রাখে।`,
        `/listing/${listing.id}`,
      );
      return { ok: true, depositId: deposit.id };
    },
    [bidsFor, notify],
  );

  /**
   * Step 2 — an admin verifies the transaction ID. Approving here is the only
   * way the bid is written to the auction, so every bid has a matching payment.
   */
  const confirmBidDeposit = useCallback(
    (depositId: string, approve: boolean, note?: string) => {
      if (!adminUser) return { ok: false, error: "auth" };
      // Guard against a double click confirming the same deposit twice.
      if (reviewingDeposits.current.has(depositId)) {
        return { ok: false, error: "reviewed" };
      }
      const deposit = stateRef.current.bidDeposits.find((entry) => entry.id === depositId);
      if (!deposit) return { ok: false, error: "missing" };
      if (deposit.status !== "pending") return { ok: false, error: "reviewed" };

      reviewingDeposits.current.add(depositId);
      const reviewedAt = new Date().toISOString();
      const reviewedBy = adminUser?.name ?? "Admin";

      if (!approve) {
        setState((current) => ({
          ...current,
          bidDeposits: current.bidDeposits.map((entry) =>
            entry.id === depositId
              ? { ...entry, status: "rejected", reviewedAt, reviewedBy, note }
              : entry,
          ),
        }));
        reviewingDeposits.current.delete(depositId);
        return { ok: true };
      }

      const listing = stateRef.current.customListings
        .concat(baseListings)
        .find((item) => item.id === deposit.listingId);
      if (!listing) {
        reviewingDeposits.current.delete(depositId);
        return { ok: false, error: "listing" };
      }

      const placed = placeBidForMember(listing, deposit.amount, deposit.bidder);
      if (!placed.ok) {
        reviewingDeposits.current.delete(depositId);
        return { ok: false, error: placed.error };
      }

      setState((current) => ({
        ...current,
        bidDeposits: current.bidDeposits.map((entry) =>
          entry.id === depositId
            ? { ...entry, status: "confirmed", reviewedAt, reviewedBy, note }
            : entry,
        ),
      }));
      reviewingDeposits.current.delete(depositId);
      return { ok: true };
    },
    [adminUser, placeBidForMember],
  );

  /**
   * Admin refund action. In production the money leaves the merchant wallet
   * and the SQL function `refund_bid_deposit()` records the ledger entry.
   */
  const refundBidDeposit = useCallback(
    (depositId: string, note?: string) => {
      if (!adminUser) return { ok: false, error: "auth" };
      const deposit = stateRef.current.bidDeposits.find((entry) => entry.id === depositId);
      if (!deposit) return { ok: false, error: "missing" };
      if (deposit.status !== "confirmed") return { ok: false, error: "reviewed" };

      setState((current) => ({
        ...current,
        bidDeposits: current.bidDeposits.map((entry) =>
          entry.id === depositId
            ? {
                ...entry,
                status: "refunded",
                reviewedAt: new Date().toISOString(),
                reviewedBy: adminUser.name,
                note: note ?? "Refunded outside the platform",
              }
            : entry,
        ),
      }));
      return { ok: true };
    },
    [adminUser],
  );

  /* ------------------------------- wishlist ----------------------------- */
  const toggleWatch = useCallback((listingId: string) => {
    setState((current) => ({
      ...current,
      watchlist: current.watchlist.includes(listingId)
        ? current.watchlist.filter((id) => id !== listingId)
        : [...current.watchlist, listingId],
    }));
  }, []);

  const isWatched = useCallback(
    (listingId: string) => state.watchlist.includes(listingId),
    [state.watchlist],
  );

  /* ---------------------------- seller listing -------------------------- */
  const addListing = useCallback(
    (input: {
      title: string;
      game: Listing["game"];
      type: Listing["type"];
      price: number;
      level: number;
      rank: string;
      platform: string;
      description: string;
      tags: string[];
    }) => {
      const user = stateRef.current.user;
      const id = `gx-${Math.floor(3000 + Math.random() * 6000)}`;
      const listing: Listing = {
        id,
        title: input.title,
        game: input.game,
        price: Math.round(input.price),
        type: input.type,
        level: input.level,
        rank: input.rank || "Unranked",
        platform: input.platform || "Bangladesh",
        seller: {
          username: user?.name.toLowerCase().replace(/\s+/g, "_") || "your_shop",
          rating: 5,
          deals: 0,
          joined: "2026",
          verified: user?.kyc === "verified",
        },
        tags: input.tags.filter(Boolean).slice(0, 4),
        description: input.description,
        bids: 0,
        endsInHours: input.type === "auction" ? 48 : undefined,
        createdAt: "Just now",
      };
      setState((current) => ({
        ...current,
        customListings: [listing, ...current.customListings],
        endsAt:
          input.type === "auction"
            ? { ...current.endsAt, [id]: minutesFromNow(48 * 60) }
            : current.endsAt,
      }));
      return id;
    },
    [],
  );

  /* ---------------------------- verification ---------------------------- */
  const verifyPhone = useCallback(() => {
    setState((current) => ({
      ...current,
      user: current.user ? { ...current.user, phoneVerified: true } : null,
    }));
  }, []);

  const submitKyc = useCallback(() => {
    setState((current) => ({
      ...current,
      user: current.user ? { ...current.user, kyc: "pending" } : null,
    }));
  }, []);

  const deposit = useCallback((amount: number) => {
    setState((current) => ({
      ...current,
      user: current.user
        ? { ...current.user, balance: current.user.balance + Math.max(0, Math.round(amount)) }
        : null,
    }));
  }, []);

  const withdraw = useCallback((amount: number) => {
    const user = stateRef.current.user;
    if (!user) return { ok: false, error: "auth" };
    const value = Math.round(amount);
    if (value < 500) return { ok: false, error: "min" };
    if (value > user.balance) return { ok: false, error: "balance" };
    setState((current) => ({
      ...current,
      user: current.user ? { ...current.user, balance: current.user.balance - value } : null,
    }));
    return { ok: true };
  }, []);

  const markNotificationsRead = useCallback(() => {
    setState((current) => ({
      ...current,
      notifications: current.notifications.map((item) => ({ ...item, read: true })),
    }));
  }, []);

  const updateSettings = useCallback((patch: Partial<AdminSettings>) => {
    setState((current) => ({
      ...current,
      settings: { ...current.settings, ...patch },
    }));
  }, []);

  const unreadNotifications = useMemo(
    () => state.notifications.filter((item) => !item.read).length,
    [state.notifications],
  );

  const value: AppStoreValue = {
    hydrated,
    user: state.user,
    adminUser,
    listings,
    customListings: state.customListings,
    orders: state.orders,
    offers: state.offers,
    threads: state.threads,
    notifications: state.notifications,
    watchlist: state.watchlist,
    bids: state.bids,
    bidDeposits: state.bidDeposits,
    endsAt: state.endsAt,
    settings: state.settings,
    unreadNotifications,
    signIn,
    signUp,
    signOut,
    adminSignIn,
    adminVerifyTotp,
    adminSignOut,
    createOrder,
    setOrderStatus,
    openDispute,
    makeOffer,
    respondOffer,
    openThread,
    replyThread,
    resolveThread,
    placeBidForMember,
    requestBidDeposit,
    confirmBidDeposit,
    refundBidDeposit,
    bidsFor,
    endsAtFor,
    toggleWatch,
    isWatched,
    addListing,
    verifyPhone,
    submitKyc,
    deposit,
    withdraw,
    markNotificationsRead,
    updateSettings,
    getListing,
  };

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) throw new Error("useAppStore must be used inside <AppStoreProvider>.");
  return context;
}

/** Clamp a bid input and keep React forms from submitting nonsense. */
export function normaliseBid(value: string) {
  const parsed = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) ? clamp(parsed, 0, 10_000_000) : 0;
}
