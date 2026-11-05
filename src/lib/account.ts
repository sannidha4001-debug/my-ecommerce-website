/**
 * User-facing data model + demo records.
 *
 * Everything here mirrors the Supabase tables in `supabase/migrations`.
 * When the real backend is connected, these seed arrays are replaced by
 * queries — the TypeScript shapes stay the same, so the UI keeps working.
 *
 * IMPORTANT PRODUCT RULE:
 * Every account is a `member` and can buy, sell and bid. Members never get a
 * direct channel to each other. Every message goes through a support thread
 * that an admin can read and reply to. A member may send a price offer on a
 * listing, but the other side cannot reply privately — an admin relays it.
 */

import { listings, type Listing } from "@/lib/demo-data";

/* ------------------------------------------------------------------ */
/* Escrow                                                              */
/* ------------------------------------------------------------------ */

export const ESCROW_STATUSES = [
  "awaiting_payment",
  "payment_submitted",
  "payment_confirmed",
  "delivered",
  "completed",
  "disputed",
  "refunded",
  "cancelled",
] as const;

export type EscrowStatus = (typeof ESCROW_STATUSES)[number];

/** Ordered happy path. Disputed / refunded / cancelled are side states. */
export const ESCROW_FLOW: EscrowStatus[] = [
  "awaiting_payment",
  "payment_submitted",
  "payment_confirmed",
  "delivered",
  "completed",
];

export const escrowStatusLabel: Record<EscrowStatus, { en: string; bn: string }> = {
  awaiting_payment: { en: "Awaiting payment", bn: "পেমেন্টের অপেক্ষায়" },
  payment_submitted: { en: "Payment submitted", bn: "পেমেন্ট জমা হয়েছে" },
  payment_confirmed: { en: "Payment confirmed", bn: "পেমেন্ট নিশ্চিত" },
  delivered: { en: "Delivered — inspect", bn: "ডেলিভারি হয়েছে — যাচাই করুন" },
  completed: { en: "Completed", bn: "সম্পন্ন" },
  disputed: { en: "Disputed", bn: "বিরোধ চলছে" },
  refunded: { en: "Refunded", bn: "ফেরত দেওয়া হয়েছে" },
  cancelled: { en: "Cancelled", bn: "বাতিল" },
};

export const escrowStatusTone: Record<
  EscrowStatus,
  "default" | "secondary" | "success" | "warning" | "danger" | "outline" | "live"
> = {
  awaiting_payment: "warning",
  payment_submitted: "default",
  payment_confirmed: "secondary",
  delivered: "live",
  completed: "success",
  disputed: "danger",
  refunded: "outline",
  cancelled: "outline",
};

export type TimelineEntry = {
  id: string;
  status: EscrowStatus | "note";
  label: { en: string; bn: string };
  at: string;
  by: "system" | "buyer" | "seller" | "admin";
  note?: string;
};

export type Order = {
  id: string;
  listingId: string;
  title: string;
  game: string;
  buyer: string;
  seller: string;
  amount: number;
  fee: number;
  payout: number;
  status: EscrowStatus;
  /** bKash / Nagad / Wallet */
  method: string;
  createdAt: string;
  updatedAt: string;
  /** 48-hour inspection deadline (ISO). */
  inspectionEndsAt?: string;
  timeline: TimelineEntry[];
};

/** Configuration an admin can change without a deploy. */
export type AdminSettings = {
  commissionRate: number;
  minFee: number;
  bkashNumber: string;
  nagadNumber: string;
  supportPhone: string;
  supportEmail: string;
  inspectionHours: number;
  antiSnipeMinutes: number;
  /** Legacy flat deposit. Kept for older saved settings. */
  auctionDeposit: number;
  /** Percentage of the bid the bidder must pay before the bid is accepted. */
  bidDepositPercent: number;
  maintenanceMode: boolean;
  requireTotp: boolean;
  autoApproveListings: boolean;
};

export const DEFAULT_SETTINGS: AdminSettings = {
  commissionRate: 7,
  minFee: 50,
  bkashNumber: "01711-000111",
  nagadNumber: "01811-000222",
  supportPhone: "09610-000111",
  supportEmail: "support@gamexchange.com.bd",
  inspectionHours: 48,
  antiSnipeMinutes: 2,
  auctionDeposit: 500,
  bidDepositPercent: 10,
  maintenanceMode: false,
  requireTotp: true,
  autoApproveListings: false,
};

/**
 * Commission maths in one place.
 * Defaults are 7% with a ৳50 floor; admin settings can override both.
 */
export function commissionFor(amount: number, settings?: Pick<AdminSettings, "commissionRate" | "minFee">) {
  const rate = settings?.commissionRate ?? 7;
  const minimum = settings?.minFee ?? 50;
  const fee = Math.max(minimum, Math.round(amount * (rate / 100)));
  return {
    fee,
    payout: Math.max(0, amount - fee),
    buyerPays: amount,
  };
}

/* ------------------------------------------------------------------ */
/* Offers (buyer -> seller, admin mediated)                            */
/* ------------------------------------------------------------------ */

export type OfferStatus = "pending" | "accepted" | "declined" | "countered";

export const offerStatusLabel: Record<OfferStatus, { en: string; bn: string }> = {
  pending: { en: "Waiting for seller", bn: "বিক্রেতার অপেক্ষায়" },
  accepted: { en: "Accepted", bn: "গৃহীত" },
  declined: { en: "Declined", bn: "প্রত্যাখ্যাত" },
  countered: { en: "Admin counter", bn: "অ্যাডমিন কাউন্টার" },
};

export type Offer = {
  id: string;
  listingId: string;
  title: string;
  game: string;
  buyer: string;
  seller: string;
  listPrice: number;
  amount: number;
  message: string;
  status: OfferStatus;
  createdAt: string;
};

/* ------------------------------------------------------------------ */
/* Admin-mediated support threads                                      */
/* ------------------------------------------------------------------ */

export type ThreadAuthor = "you" | "admin" | "system";

export type ThreadMessage = {
  id: string;
  author: ThreadAuthor;
  authorName: string;
  body: string;
  at: string;
};

export type Thread = {
  id: string;
  subject: string;
  topic: "order" | "offer" | "account" | "payment" | "other";
  orderId?: string;
  listingId?: string;
  /** Read-only summary shown to the admin. */
  context: string;
  status: "open" | "resolved";
  unread: number;
  createdAt: string;
  updatedAt: string;
  messages: ThreadMessage[];
};

/* ------------------------------------------------------------------ */
/* Auctions                                                            */
/* ------------------------------------------------------------------ */

export type Bid = {
  id: string;
  listingId: string;
  bidder: string;
  amount: number;
  at: string;
};

/* ------------------------------------------------------------------ */
/* Bid deposits (auction anti-shill protection)                        */
/* ------------------------------------------------------------------ */

/**
 * Before a bid is accepted the bidder pays a percentage of the bid
 * (10% by default). The money is sent to the admin's bKash/Nagad number and
 * the bidder submits the sender number + transaction ID. An admin verifies
 * the transaction and only then does the bid reach the auction.
 *
 * The deposit is refundable if the bidder does not win. Confirming a deposit
 * is the only way a bid enters the demo auction, which keeps bids auditable.
 */
export type BidDepositStatus = "pending" | "confirmed" | "rejected" | "refunded";

export const bidDepositStatusLabel: Record<
  BidDepositStatus,
  { en: string; bn: string }
> = {
  pending: { en: "Awaiting admin check", bn: "অ্যাডমিন যাচাইয়ের অপেক্ষায়" },
  confirmed: { en: "Deposit confirmed — bid live", bn: "ডিপোজিট নিশ্চিত — বিড চালু" },
  rejected: { en: "Rejected", bn: "প্রত্যাখ্যাত" },
  refunded: { en: "Refunded", bn: "ফেরত দেওয়া হয়েছে" },
};

export type BidDeposit = {
  id: string;
  listingId: string;
  listingTitle: string;
  /** Account display name of the bidder. */
  bidder: string;
  bidderEmail: string;
  /** Bid amount the deposit is protecting. */
  amount: number;
  /** The percentage amount actually paid (10% by default). */
  deposit: number;
  method: "bKash" | "Nagad";
  senderNumber: string;
  transactionId: string;
  status: BidDepositStatus;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  note?: string;
};

/** Round a percentage deposit to whole taka, never below ৳1. */
export function bidDepositFor(bidAmount: number, percent: number) {
  const value = Math.round((Math.max(0, bidAmount) * Math.max(0, percent)) / 100);
  return Math.max(1, value);
}

/* ------------------------------------------------------------------ */
/* Buyer / seller profile                                              */
/* ------------------------------------------------------------------ */

export type KycStatus = "unverified" | "pending" | "verified";

/**
 * One account category for everyone.
 *
 * Earlier versions split people into "buyer" and "seller" roles. That made
 * people pick a side at signup even though almost everyone does both. Now
 * every account is a `member`: you can buy, sell, bid and open support
 * tickets from the same login. Admin roles live separately in `AdminUser`.
 */
export type AccountRole = "member";

export type Account = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AccountRole;
  balance: number;
  kyc: KycStatus;
  phoneVerified: boolean;
  joined: string;
  strikes: number;
  trustScore: number;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "moderator";
  twoFactor: boolean;
};

export type Notification = {
  id: string;
  title: { en: string; bn: string };
  body: { en: string; bn: string };
  at: string;
  read: boolean;
  href?: string;
};

/* ------------------------------------------------------------------ */
/* Demo credentials                                                    */
/* ------------------------------------------------------------------ */

export const DEMO_BUYER: Account = {
  id: "usr-buyer",
  name: "Ayaan Rahman",
  email: "buyer@gamexchange.demo",
  phone: "+8801711000111",
  role: "member",
  balance: 12500,
  kyc: "verified",
  phoneVerified: true,
  joined: "Mar 2025",
  strikes: 0,
  trustScore: 92,
};

export const DEMO_SELLER: Account = {
  id: "usr-seller",
  name: "Rafi Hasan",
  email: "seller@gamexchange.demo",
  phone: "+8801811000222",
  role: "member",
  balance: 28400,
  kyc: "pending",
  phoneVerified: true,
  joined: "Jan 2024",
  strikes: 0,
  trustScore: 96,
};

export const DEMO_ADMIN: AdminUser = {
  id: "adm-1",
  name: "Nadia Islam",
  email: "admin@gamexchange.com.bd",
  role: "super_admin",
  twoFactor: true,
};

export const DEMO_MODERATOR: AdminUser = {
  id: "adm-2",
  name: "Imran Chowdhury",
  email: "mod@gamexchange.com.bd",
  role: "moderator",
  twoFactor: false,
};

export const DEMO_ACCOUNTS = [DEMO_BUYER, DEMO_SELLER];
export const DEMO_PASSWORDS: Record<string, string> = {
  "buyer@gamexchange.demo": "demo1234",
  "seller@gamexchange.demo": "demo1234",
};

export const DEMO_ADMINS = [DEMO_ADMIN, DEMO_MODERATOR];
export const DEMO_ADMIN_PASSWORDS: Record<string, string> = {
  "admin@gamexchange.com.bd": "admin1234",
  "mod@gamexchange.com.bd": "admin1234",
};

/* ------------------------------------------------------------------ */
/* Demo seed                                                           */
/* ------------------------------------------------------------------ */

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString();
const hoursAhead = (h: number) => new Date(now + h * 3600_000).toISOString();

function entry(
  status: EscrowStatus,
  at: string,
  by: TimelineEntry["by"],
  en: string,
  bn: string,
  note?: string,
): TimelineEntry {
  return {
    id: `${status}-${at}-${Math.random().toString(36).slice(2, 7)}`,
    status,
    at,
    by,
    note,
    label: { en, bn },
  };
}

export const seedOrders: Order[] = [
  {
    id: "GX-2401",
    listingId: "gx-1001",
    title: "Grandmaster · 12 Mythic Skins · Full Email Access",
    game: "Free Fire",
    buyer: "Ayaan Rahman",
    seller: "rafi_gamer",
    amount: 24500,
    fee: 1715,
    payout: 22785,
    status: "delivered",
    method: "bKash",
    createdAt: hoursAgo(30),
    updatedAt: hoursAgo(4),
    inspectionEndsAt: hoursAhead(44),
    timeline: [
      entry("awaiting_payment", hoursAgo(30), "buyer", "Order created", "অর্ডার তৈরি"),
      entry("payment_submitted", hoursAgo(29), "buyer", "Payment sent via bKash", "বিকাশে পেমেন্ট পাঠানো হয়েছে", "TrxID 9F2K1LQ7"),
      entry("payment_confirmed", hoursAgo(26), "admin", "Payment verified by admin", "অ্যাডমিন পেমেন্ট যাচাই করেছেন"),
      entry("payment_confirmed", hoursAgo(25), "system", "Seller asked to deliver", "বিক্রেতাকে ডেলিভারির অনুরোধ"),
      entry("delivered", hoursAgo(4), "seller", "Account credentials handed over", "অ্যাকাউন্টের তথ্য হস্তান্তর", "Email change window: 48 hours"),
    ],
  },
  {
    id: "GX-2402",
    listingId: "gx-1004",
    title: "Immortal 3 · 28 Skins · Reaver Vandal",
    game: "Valorant",
    buyer: "Ayaan Rahman",
    seller: "sadia_plays",
    amount: 15000,
    fee: 1050,
    payout: 13950,
    status: "payment_confirmed",
    method: "Nagad",
    createdAt: hoursAgo(10),
    updatedAt: hoursAgo(2),
    timeline: [
      entry("awaiting_payment", hoursAgo(10), "buyer", "Order created", "অর্ডার তৈরি"),
      entry("payment_submitted", hoursAgo(9), "buyer", "Payment sent via Nagad", "নগদে পেমেন্ট পাঠানো হয়েছে", "TrxID NG77P2"),
      entry("payment_confirmed", hoursAgo(2), "admin", "Payment verified — seller notified", "পেমেন্ট যাচাই — বিক্রেতাকে জানানো হয়েছে"),
    ],
  },
  {
    id: "GX-2403",
    listingId: "gx-1008",
    title: "Epic Squad · 92 Rated · 20K Coins · Starter Ready",
    game: "eFootball",
    buyer: "Ayaan Rahman",
    seller: "nusrat_ff",
    amount: 4500,
    fee: 315,
    payout: 4185,
    status: "completed",
    method: "bKash",
    createdAt: hoursAgo(240),
    updatedAt: hoursAgo(190),
    timeline: [
      entry("awaiting_payment", hoursAgo(240), "buyer", "Order created", "অর্ডার তৈরি"),
      entry("payment_submitted", hoursAgo(239), "buyer", "Payment sent", "পেমেন্ট পাঠানো হয়েছে"),
      entry("payment_confirmed", hoursAgo(236), "admin", "Payment verified", "পেমেন্ট যাচাই"),
      entry("delivered", hoursAgo(210), "seller", "Account handed over", "অ্যাকাউন্ট হস্তান্তর"),
      entry("completed", hoursAgo(190), "buyer", "Buyer released payment", "ক্রেতা পেমেন্ট ছেড়ে দিয়েছেন"),
    ],
  },
  {
    id: "GX-2404",
    listingId: "gx-1006",
    title: "Legendary Rank · 40 Mythic Weapons · Clean Account",
    game: "Call of Duty: Mobile",
    buyer: "Ayaan Rahman",
    seller: "mehedi_gg",
    amount: 9200,
    fee: 644,
    payout: 8556,
    status: "disputed",
    method: "bKash",
    createdAt: hoursAgo(72),
    updatedAt: hoursAgo(8),
    timeline: [
      entry("awaiting_payment", hoursAgo(72), "buyer", "Order created", "অর্ডার তৈরি"),
      entry("payment_submitted", hoursAgo(71), "buyer", "Payment sent", "পেমেন্ট পাঠানো হয়েছে"),
      entry("payment_confirmed", hoursAgo(68), "admin", "Payment verified", "পেমেন্ট যাচাই"),
      entry("delivered", hoursAgo(20), "seller", "Login details shared", "লগইন তথ্য শেয়ার"),
      entry("disputed", hoursAgo(8), "buyer", "Buyer opened a dispute", "ক্রেতা বিরোধ খুলেছেন", "Account was recovered by the original owner."),
    ],
  },
  {
    id: "GX-2405",
    listingId: "gx-1009",
    title: "Mythic Glory · 180 Skins · Collector Account",
    game: "Mobile Legends",
    buyer: "Ayaan Rahman",
    seller: "sadia_plays",
    amount: 12500,
    fee: 875,
    payout: 11625,
    status: "awaiting_payment",
    method: "bKash",
    createdAt: hoursAgo(1),
    updatedAt: hoursAgo(1),
    timeline: [
      entry("awaiting_payment", hoursAgo(1), "buyer", "Order created — pay within 12 hours", "অর্ডার তৈরি — ১২ ঘণ্টায় পেমেন্ট করুন"),
    ],
  },
];

export const seedOffers: Offer[] = [
  {
    id: "OFR-501",
    listingId: "gx-1003",
    title: "Conqueror · Glacier M416 Lv.7 · Season 4 Badge",
    game: "PUBG Mobile",
    buyer: "Ayaan Rahman",
    seller: "ahnaf_x",
    listPrice: 32000,
    amount: 29500,
    message: "Can pay today by bKash if you can deliver before 9pm.",
    status: "pending",
    createdAt: hoursAgo(3),
  },
  {
    id: "OFR-502",
    listingId: "gx-1007",
    title: "Rare Elite Pass Bundle · 2019–2023 · Collector's Pick",
    game: "Free Fire",
    buyer: "Ayaan Rahman",
    seller: "rafi_gamer",
    listPrice: 6800,
    amount: 6200,
    message: "Would you accept ৳6,200? I can complete the inspection quickly.",
    status: "countered",
    createdAt: hoursAgo(26),
  },
];

export const seedThreads: Thread[] = [
  {
    id: "TH-301",
    subject: "Delivery proof for GX-2401",
    topic: "order",
    orderId: "GX-2401",
    listingId: "gx-1001",
    context: "Seller marked the order delivered. Buyer has 44 hours of inspection left.",
    status: "open",
    unread: 1,
    createdAt: hoursAgo(5),
    updatedAt: hoursAgo(1),
    messages: [
      {
        id: "m1",
        author: "you",
        authorName: "You",
        body: "I received the login but the linked email recovery phone still shows the seller's number. Can an admin verify the email change before I release payment?",
        at: hoursAgo(5),
      },
      {
        id: "m2",
        author: "system",
        authorName: "GameXchange",
        body: "Ticket opened. A moderator will review the handover evidence. Do not share passwords or OTPs in this thread.",
        at: hoursAgo(5),
      },
      {
        id: "m3",
        author: "admin",
        authorName: "Nadia (Admin)",
        body: "I have asked the seller to complete the recovery-phone removal through support. Please upload a screenshot here once the recovery phone field is empty.",
        at: hoursAgo(1),
      },
    ],
  },
  {
    id: "TH-302",
    subject: "Offer on Conqueror PUBG account",
    topic: "offer",
    listingId: "gx-1003",
    context: "Buyer offered ৳29,500 against a ৳32,000 asking price.",
    status: "open",
    unread: 0,
    createdAt: hoursAgo(3),
    updatedAt: hoursAgo(3),
    messages: [
      {
        id: "m1",
        author: "you",
        authorName: "You",
        body: "Is ৳29,500 acceptable? I can pay immediately.",
        at: hoursAgo(3),
      },
      {
        id: "m2",
        author: "system",
        authorName: "GameXchange",
        body: "Your offer was sent to the seller through the admin desk. Sellers cannot message buyers directly.",
        at: hoursAgo(3),
      },
    ],
  },
  {
    id: "TH-303",
    subject: "Withdrawal not received",
    topic: "payment",
    orderId: "GX-2403",
    context: "Seller payout of ৳4,185 marked paid on 12 Oct.",
    status: "resolved",
    unread: 0,
    createdAt: hoursAgo(80),
    updatedAt: hoursAgo(50),
    messages: [
      {
        id: "m1",
        author: "you",
        authorName: "You",
        body: "My bKash withdrawal has not arrived yet.",
        at: hoursAgo(80),
      },
      {
        id: "m2",
        author: "admin",
        authorName: "Imran (Admin)",
        body: "The payout was delayed by the bank holiday. It has been sent again with reference GX-PAY-8891.",
        at: hoursAgo(52),
      },
      {
        id: "m3",
        author: "you",
        authorName: "You",
        body: "Received, thank you.",
        at: hoursAgo(50),
      },
    ],
  },
];

export const seedBids: Record<string, Bid[]> = {
  "gx-1001": [
    { id: "b1", listingId: "gx-1001", bidder: "ar***77", amount: 24500, at: hoursAgo(1) },
    { id: "b2", listingId: "gx-1001", bidder: "sh***99", amount: 24000, at: hoursAgo(2) },
    { id: "b3", listingId: "gx-1001", bidder: "na***12", amount: 23200, at: hoursAgo(3) },
    { id: "b4", listingId: "gx-1001", bidder: "ta***04", amount: 22500, at: hoursAgo(4) },
  ],
  "gx-1002": [
    { id: "b1", listingId: "gx-1002", bidder: "ri***21", amount: 18500, at: hoursAgo(2) },
    { id: "b2", listingId: "gx-1002", bidder: "mo***88", amount: 18000, at: hoursAgo(5) },
  ],
  "gx-1003": [
    { id: "b1", listingId: "gx-1003", bidder: "ay***11", amount: 32000, at: hoursAgo(1) },
    { id: "b2", listingId: "gx-1003", bidder: "sa***42", amount: 31200, at: hoursAgo(2) },
    { id: "b3", listingId: "gx-1003", bidder: "im***73", amount: 30500, at: hoursAgo(3) },
  ],
  "gx-1006": [
    { id: "b1", listingId: "gx-1006", bidder: "ha***55", amount: 9200, at: hoursAgo(4) },
    { id: "b2", listingId: "gx-1006", bidder: "ka***18", amount: 8800, at: hoursAgo(6) },
  ],
};

export const seedListingState: Record<string, { bids: Bid[]; endsAt?: string }> = {
  "gx-1001": { bids: seedBids["gx-1001"], endsAt: hoursAhead(2.4) },
  "gx-1002": { bids: seedBids["gx-1002"], endsAt: hoursAhead(6.5) },
  "gx-1003": { bids: seedBids["gx-1003"], endsAt: hoursAhead(1.2) },
  "gx-1006": { bids: seedBids["gx-1006"], endsAt: hoursAhead(18) },
};

/**
 * Demo bid-deposit queue. These show the admin the exact fields a real
 * bKash/Nagad transfer produces: sender number + transaction ID.
 * The first row belongs to the demo buyer so the pending state is visible
 * from their listing page too.
 */
export const seedBidDeposits: BidDeposit[] = [
  {
    id: "DEP-401",
    listingId: "gx-1002",
    listingTitle: "Legendary Squad · 105 Rated Players · 45K Coins",
    bidder: "Ayaan Rahman",
    bidderEmail: "buyer@gamexchange.demo",
    amount: 19000,
    deposit: 1900,
    method: "bKash",
    senderNumber: "01711-223344",
    transactionId: "BK9F2K1LQ7",
    status: "pending",
    createdAt: hoursAgo(0.6),
  },
  {
    id: "DEP-402",
    listingId: "gx-1001",
    listingTitle: "Grandmaster · 12 Mythic Skins · Full Email Access",
    bidder: "Tanvir Ahmed",
    bidderEmail: "tanvir.pro@gmail.com",
    amount: 25000,
    deposit: 2500,
    method: "Nagad",
    senderNumber: "01822-556677",
    transactionId: "NG77P2QX",
    status: "pending",
    createdAt: hoursAgo(1.4),
  },
  {
    id: "DEP-398",
    listingId: "gx-1003",
    listingTitle: "Conqueror · Glacier M416 Lv.7 · Season 4 Badge",
    bidder: "Sadia Islam",
    bidderEmail: "sadia.plays@gmail.com",
    amount: 32000,
    deposit: 3200,
    method: "bKash",
    senderNumber: "01611-998877",
    transactionId: "BK55TR21",
    status: "confirmed",
    reviewedBy: "Nadia Islam",
    reviewedAt: hoursAgo(5),
    createdAt: hoursAgo(6),
  },
];

export const seedNotifications: Notification[] = [
  {
    id: "n1",
    title: { en: "Seller delivered your order", bn: "বিক্রেতা আপনার অর্ডার ডেলিভারি করেছেন" },
    body: {
      en: "Inspect GX-2401 within 48 hours, then release payment.",
      bn: "৪৮ ঘণ্টার মধ্যে GX-2401 যাচাই করে পেমেন্ট ছেড়ে দিন।",
    },
    at: hoursAgo(4),
    read: false,
    href: "/dashboard/orders",
  },
  {
    id: "n2",
    title: { en: "Admin replied to your ticket", bn: "অ্যাডমিন আপনার টিকিটে উত্তর দিয়েছেন" },
    body: {
      en: "Open TH-301 for the handover verification update.",
      bn: "হ্যান্ডওভার যাচাইয়ের আপডেট দেখতে TH-301 খুলুন।",
    },
    at: hoursAgo(1),
    read: false,
    href: "/dashboard/support",
  },
  {
    id: "n3",
    title: { en: "Auction ending soon", bn: "নিলাম শিগগির শেষ হচ্ছে" },
    body: {
      en: "You are the top bidder on Grandmaster · 12 Mythic Skins.",
      bn: "Grandmaster · 12 Mythic Skins-এ আপনি শীর্ষ বিডার।",
    },
    at: hoursAgo(2),
    read: true,
    href: "/listing/gx-1001",
  },
];

/** Sellers shown on the buy page cannot be contacted directly. */
export function publicSellerLabel(username: string) {
  return username.replace(/_/g, " ");
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-BD", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export const DEFAULT_LISTINGS: Listing[] = [...listings];

/** Data used only by the demo admin console. */
export const adminUsers = [
  { id: "u1", name: "Ayaan Rahman", email: "buyer@gamexchange.demo", role: "Member", kyc: "Verified", orders: 5, joined: "Mar 2025", risk: "Low" },
  { id: "u2", name: "Rafi Hasan", email: "seller@gamexchange.demo", role: "Member", kyc: "Pending", orders: 214, joined: "Jan 2024", risk: "Low" },
  { id: "u3", name: "Nusrat Jahan", email: "nusrat.ff@gmail.com", role: "Member", kyc: "Verified", orders: 168, joined: "Jun 2023", risk: "Low" },
  { id: "u4", name: "Ahnaf Chowdhury", email: "ahnaf.x@gmail.com", role: "Member", kyc: "Verified", orders: 97, joined: "Feb 2024", risk: "Low" },
  { id: "u5", name: "Sadia Islam", email: "sadia.plays@gmail.com", role: "Member", kyc: "Verified", orders: 141, joined: "Nov 2023", risk: "Medium" },
  { id: "u6", name: "Mehedi Hasan", email: "mehedi.gg@gmail.com", role: "Member", kyc: "Unverified", orders: 38, joined: "Jul 2025", risk: "High" },
  { id: "u7", name: "Tanvir Ahmed", email: "tanvir.pro@gmail.com", role: "Member", kyc: "Verified", orders: 63, joined: "Apr 2025", risk: "Low" },
  { id: "u8", name: "Farhan Kabir", email: "farhan.k@gmail.com", role: "Member", kyc: "Verified", orders: 12, joined: "Sep 2025", risk: "Low" },
];

export const adminReports = [
  { id: "RPT-91", target: "GX-2404", type: "Account recovered", reporter: "Ayaan Rahman", severity: "High", status: "Investigating", at: hoursAgo(8) },
  { id: "RPT-90", target: "gx-1006", type: "Suspicious bids", reporter: "System", severity: "Medium", status: "Open", at: hoursAgo(11) },
  { id: "RPT-89", target: "TH-301", type: "Handover mismatch", reporter: "Ayaan Rahman", severity: "High", status: "Waiting on seller", at: hoursAgo(5) },
  { id: "RPT-88", target: "u6", type: "Unverified seller activity", reporter: "System", severity: "Medium", status: "Resolved", at: hoursAgo(30) },
];

export const adminAudit = [
  { id: "AUD-771", actor: "Nadia Islam", role: "Super admin", action: "Approved payment for GX-2402", target: "GX-2402", ip: "103.108.12.44", at: hoursAgo(2) },
  { id: "AUD-770", actor: "Nadia Islam", role: "Super admin", action: "Replied to support thread TH-301", target: "TH-301", ip: "103.108.12.44", at: hoursAgo(1) },
  { id: "AUD-769", actor: "Imran Chowdhury", role: "Moderator", action: "Paused auction for gx-1003", target: "gx-1003", ip: "103.108.19.8", at: hoursAgo(6) },
  { id: "AUD-768", actor: "System", role: "Automation", action: "Auto-extended auction gx-1001 by 2 minutes (anti-sniping)", target: "gx-1001", ip: "—", at: hoursAgo(3) },
  { id: "AUD-767", actor: "Imran Chowdhury", role: "Moderator", action: "Issued strike to u6", target: "u6", ip: "103.108.19.8", at: hoursAgo(28) },
  { id: "AUD-766", actor: "Nadia Islam", role: "Super admin", action: "Updated commission to 7% (min ৳50)", target: "settings", ip: "103.108.12.44", at: hoursAgo(48) },
];

export function findListing(id: string, extra: Listing[] = []) {
  return [...extra, ...DEFAULT_LISTINGS].find((item) => item.id === id) ?? null;
}
