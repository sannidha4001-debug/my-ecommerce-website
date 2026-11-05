"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  Eye,
  Gavel,
  Heart,
  MessageSquare,
  Package,
  Pause,
  Play,
  Plus,
  ShieldCheck,
  Store,
  Tag,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";
import { Countdown } from "@/components/animations/countdown";
import { GameArtwork } from "@/components/marketing/game-artwork";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  commissionFor,
  formatDateTime,
  offerStatusLabel,
  timeAgo,
  type EscrowStatus,
  type OfferStatus,
  type Order,
} from "@/lib/account";
import { useAppStore } from "@/lib/store";
import { cn, formatBDT } from "@/lib/utils";
import {
  EmptyState,
  EscrowRail,
  OrderStatusBadge,
  SectionTitle,
  StatCard,
  useT,
} from "@/components/dashboard/ui";

/* ==================================================================== */
/* Overview                                                             */
/* ==================================================================== */

export function OverviewSection() {
  const { isBangla } = useI18n();
  const tr = useT();
  const { user, orders, offers, threads, listings, openThread } = useAppStore();

  if (!user) return null;

  const activeOrders = orders.filter(
    (order) => !["completed", "cancelled", "refunded"].includes(order.status),
  );
  const escrowHeld = activeOrders
    .filter((order) => ["payment_submitted", "payment_confirmed", "delivered"].includes(order.status))
    .reduce((total, order) => total + order.amount, 0);
  const pendingOffers = offers.filter((offer) => offer.status === "pending");
  const openTickets = threads.filter((thread) => thread.status === "open");
  const needsAction = [
    ...orders
      .filter((order) => order.status === "awaiting_payment")
      .map((order) => ({
        id: order.id,
        title: tr("Complete payment to reserve the account", "অ্যাকাউন্ট ধরে রাখতে পেমেন্ট সম্পন্ন করুন"),
        body: `${order.title} · ${formatBDT(order.amount)}`,
        href: "/dashboard/orders",
        tone: "amber" as const,
      })),
    ...orders
      .filter((order) => order.status === "delivered")
      .map((order) => ({
        id: order.id,
        title: tr("Inspect the account and release payment", "অ্যাকাউন্ট যাচাই করে পেমেন্ট ছেড়ে দিন"),
        body: `${order.title} · ${tr("48-hour window open", "৪৮ ঘণ্টার সময় চলছে")}`,
        href: "/dashboard/orders",
        tone: "emerald" as const,
      })),
    ...threads
      .filter((thread) => thread.unread > 0)
      .map((thread) => ({
        id: thread.id,
        title: tr("New admin reply in your ticket", "আপনার টিকিটে নতুন অ্যাডমিন উত্তর"),
        body: thread.subject,
        href: "/dashboard/support",
        tone: "violet" as const,
      })),
  ].slice(0, 4);

  const recommendations = listings
    .filter((listing) => listing.id !== "gx-1009")
    .slice(0, 3);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          icon={Package}
          label={tr("Active orders", "সক্রিয় অর্ডার")}
          value={String(activeOrders.length)}
          hint={tr("Escrow protected", "এস্ক্রো সুরক্ষিত")}
          tone="violet"
        />
        <StatCard
          icon={ShieldCheck}
          label={tr("Held in escrow", "এস্ক্রোতে আটকে আছে")}
          value={formatBDT(escrowHeld)}
          hint={tr("Released after inspection", "যাচাইয়ের পর ছাড়া হয়")}
          tone="emerald"
        />
        <StatCard
          icon={Tag}
          label={tr("Pending offers", "অপেক্ষমাণ অফার")}
          value={String(pendingOffers.length)}
          hint={tr("Relayed by admin", "অ্যাডমিন পৌঁছান")}
          tone="amber"
        />
        <StatCard
          icon={MessageSquare}
          label={tr("Open tickets", "খোলা টিকিট")}
          value={String(openTickets.length)}
          hint={tr("Support replies inside", "উত্তর সাপোর্টে")}
          tone="cyan"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          {needsAction.length > 0 && (
            <section className="glass rounded-2xl p-4">
              <SectionTitle
                action={
                  <Badge variant="warning">{needsAction.length} {tr("action items", "কাজ বাকি")}</Badge>
                }
              >
                {tr("Action needed", "আপনার করণীয়")}
              </SectionTitle>
              <div className="space-y-2">
                {needsAction.map((item) => (
                  <Link
                    key={`${item.id}-${item.title}`}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-xl border border-border bg-white/[0.02] px-3 py-2.5 transition hover:border-primary/30"
                  >
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-lg border",
                        item.tone === "amber" && "border-amber-400/20 bg-amber-400/10 text-amber-300",
                        item.tone === "emerald" && "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
                        item.tone === "violet" && "border-violet-400/20 bg-violet-400/10 text-violet-300",
                      )}
                    >
                      {item.tone === "emerald" ? <Clock3 className="h-4 w-4" /> : item.tone === "violet" ? <MessageSquare className="h-4 w-4" /> : <Banknote className="h-4 w-4" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold">{item.title}</span>
                      <span className="block truncate text-[10px] text-muted-foreground">{item.body}</span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <SectionTitle
              action={
                <Link href="/dashboard/orders" className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline">
                  {tr("All orders", "সব অর্ডার")}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              }
            >
              {tr("Recent orders", "সাম্প্রতিক অর্ডার")}
            </SectionTitle>
            <div className="space-y-2">
              {orders.slice(0, 3).map((order) => (
                <Link
                  key={order.id}
                  href="/dashboard/orders"
                  className="glass group flex flex-col gap-2 rounded-xl p-3.5 transition hover:border-primary/30 sm:flex-row sm:items-center"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-[9px] font-bold text-muted-foreground">
                    {order.game.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-primary">{order.id}</span>
                      <OrderStatusBadge status={order.status} />
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-medium">{order.title}</span>
                    <span className="block text-[10px] text-muted-foreground">{timeAgo(order.updatedAt)} · {order.method}</span>
                  </span>
                  <span className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <span className="font-display text-sm font-bold tabular-nums">{formatBDT(order.amount)}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <SectionTitle
              action={
                <Link href="/marketplace" className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline">
                  {tr("Browse all", "সব দেখুন")}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              }
            >
              {tr("Picked for you", "আপনার জন্য")}
            </SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {recommendations.map((listing, index) => (
                <ListingCard key={listing.id} listing={listing} index={index} />
              ))}
            </div>
          </section>
        </div>

        {/* side column */}
        <div className="space-y-4">
          <div className="gradient-border glass-strong rounded-2xl p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {tr("Your trust score", "আপনার ট্রাস্ট স্কোর")}
            </p>
            <div className="mt-2 flex items-end gap-2">
              <p className="font-display text-3xl font-bold text-emerald-300">{user.trustScore}</p>
              <span className="mb-1 text-[10px] text-muted-foreground">/ 100</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: `${user.trustScore}%` }} />
            </div>
            <ul className="mt-3 space-y-1.5 text-[10px] text-muted-foreground">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-400" />{tr("Email verified", "ইমেইল ভেরিফাইড")}</li>
              <li className="flex items-center gap-1.5">
                {user.phoneVerified ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <AlertTriangle className="h-3 w-3 text-amber-300" />}
                {user.phoneVerified ? tr("Phone verified", "ফোন ভেরিফাইড") : tr("Verify your phone", "ফোন ভেরিফাই করুন")}
              </li>
              <li className="flex items-center gap-1.5">
                {user.kyc === "verified" ? <CheckCircle2 className="h-3 w-3 text-emerald-400" /> : <AlertTriangle className="h-3 w-3 text-amber-300" />}
                {user.kyc === "verified" ? tr("KYC complete", "KYC সম্পন্ন") : tr("Finish KYC for payouts", "পেআউটে KYC সম্পন্ন করুন")}
              </li>
            </ul>
            <Button asChild variant="secondary" size="sm" className="mt-3 w-full">
              <Link href="/dashboard/verify">
                <BadgeCheck className="h-3.5 w-3.5" />
                {tr("Manage verification", "ভেরিফিকেশন দেখুন")}
              </Link>
            </Button>
          </div>

          <div className="glass rounded-2xl p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{tr("Quick actions", "দ্রুত কাজ")}</p>
            <div className="mt-2 grid gap-1.5">
              {[
                { href: "/sell", icon: Plus, en: "Create a listing", bn: "লিস্টিং তৈরি" },
                { href: "/dashboard/wallet", icon: Wallet, en: "Withdraw earnings", bn: "আয় তুলুন" },
                { href: "/dashboard/support", icon: MessageSquare, en: "Ask an admin", bn: "অ্যাডমিনকে জিজ্ঞাসা" },
                { href: "/marketplace?type=auction", icon: Gavel, en: "Live auctions", bn: "লাইভ নিলাম" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-lg px-2 py-2 text-[11px] text-muted-foreground transition hover:bg-white/[0.04] hover:text-foreground">
                  <item.icon className="h-3.5 w-3.5 text-primary" />
                  {isBangla ? item.bn : item.en}
                  <ArrowRight className="ml-auto h-3 w-3" />
                </Link>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              {tr("Escrow protection", "এস্ক্রো সুরক্ষা")}
            </div>
            <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">
              {tr(
                "Your payment stays with GameXchange until you confirm the account works. Admins mediate every conversation.",
                "অ্যাকাউন্ট ঠিক আছে নিশ্চিত না করা পর্যন্ত পেমেন্ট GameXchange-এ থাকে। প্রতিটি কথোপকথন অ্যাডমিন দেখেন।",
              )}
            </p>
            <button
              type="button"
              onClick={() => {
                const id = openThread({
                  subject: "General safety question",
                  topic: "other",
                  context: "Sent from dashboard quick action",
                  message: "I have a question about how escrow inspection works.",
                });
                toast.success(tr("Ticket opened", "টিকিট খোলা হয়েছে"), { description: id });
              }}
              className="mt-2 text-[10px] font-medium text-primary hover:underline"
            >
              {tr("Open a support ticket →", "সাপোর্ট টিকিট খুলুন →")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================================================================== */
/* Orders                                                               */
/* ==================================================================== */

const ORDER_FILTERS: { key: "all" | EscrowStatus; en: string; bn: string }[] = [
  { key: "all", en: "All", bn: "সব" },
  { key: "awaiting_payment", en: "Awaiting payment", bn: "পেমেন্ট অপেক্ষমাণ" },
  { key: "payment_confirmed", en: "In progress", bn: "চলমান" },
  { key: "delivered", en: "Inspect", bn: "যাচাই" },
  { key: "completed", en: "Completed", bn: "সম্পন্ন" },
  { key: "disputed", en: "Disputed", bn: "বিরোধ" },
];

export function OrdersSection() {
  const tr = useT();
  const {
    orders,
    setOrderStatus,
    openDispute,
    openThread,
    settings,
  } = useAppStore();
  const [filter, setFilter] = useState<"all" | EscrowStatus>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [trx, setTrx] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeOpen, setDisputeOpen] = useState<string | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? orders : orders.filter((order) => order.status === filter)),
    [orders, filter],
  );

  function submitPayment(order: Order) {
    const reference = trx.trim() || `TRX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setOrderStatus(order.id, "payment_submitted", `${order.method} · ${reference}`);
    setTrx("");
    toast.success(tr("Payment submitted", "পেমেন্ট জমা হয়েছে"), {
      description: tr(
        "An admin will verify it, usually within 30 minutes.",
        "অ্যাডমিন যাচাই করবেন, সাধারণত ৩০ মিনিটের মধ্যে।",
      ),
    });
  }

  function release(order: Order) {
    setOrderStatus(order.id, "completed", "Buyer confirmed the account and released payment");
    toast.success(tr("Payment released", "পেমেন্ট ছাড়া হয়েছে"), {
      description: tr(
        "The seller will be paid after the payout review.",
        "পেআউট রিভিউয়ের পর বিক্রেতাকে টাকা দেওয়া হবে।",
      ),
    });
  }

  function contactAdmin(order: Order) {
    const id = openThread({
      subject: `Help with order ${order.id}`,
      topic: "order",
      context: `${order.title} · ${formatBDT(order.amount)} · ${order.status}`,
      message: `I need help with order ${order.id}.`,
      orderId: order.id,
      listingId: order.listingId,
    });
    toast.success(tr("Support ticket opened", "সাপোর্ট টিকিট খোলা হয়েছে"), { description: id });
  }

  return (
    <div className="space-y-4">
      <div className="glass flex flex-wrap items-center justify-between gap-2 rounded-xl p-2">
        <div className="flex flex-wrap gap-1">
          {ORDER_FILTERS.map((item) => {
            const count = item.key === "all" ? orders.length : orders.filter((order) => order.status === item.key).length;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                aria-pressed={filter === item.key}
                className={cn(
                  "rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition",
                  filter === item.key
                    ? "bg-primary/15 text-foreground ring-1 ring-primary/25"
                    : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
                )}
              >
                {tr(item.en, item.bn)}
                <span className="ml-1 text-[9px] opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
        <span className="px-2 text-[10px] text-muted-foreground">
          {tr("48-hour inspection on every order", "প্রতিটি অর্ডারে ৪৮ ঘণ্টা যাচাই")}
        </span>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Package}
          title={tr("No orders in this view", "এই তালিকায় কোনো অর্ডার নেই")}
          body={tr(
            "Buy an account from the marketplace and it will appear here with its full escrow timeline.",
            "মার্কেটপ্লেস থেকে অ্যাকাউন্ট কিনলে সম্পূর্ণ এস্ক্রো টাইমলাইনসহ এখানে দেখা যাবে।",
          )}
          actionHref="/marketplace"
          actionLabel={tr("Browse marketplace", "মার্কেটপ্লেস দেখুন")}
        />
      ) : (
        visible.map((order) => {
          const expanded = openId === order.id;
          const canPay = order.status === "awaiting_payment";
          const canRelease = order.status === "delivered";
          const waiting = order.status === "payment_submitted" || order.status === "payment_confirmed";
          return (
            <article key={order.id} className="glass overflow-hidden rounded-2xl">
              <button
                type="button"
                onClick={() => setOpenId(expanded ? null : order.id)}
                aria-expanded={expanded}
                className="w-full p-4 text-left"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-primary">{order.id}</span>
                  <OrderStatusBadge status={order.status} />
                  {order.status === "delivered" && order.inspectionEndsAt && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 text-[9px] text-cyan-200">
                      <Clock3 className="h-2.5 w-2.5" />
                      <Countdown endsAt={order.inspectionEndsAt} showIcon={false} />
                    </span>
                  )}
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    {formatDateTime(order.createdAt)}
                    <ChevronDown className={cn("h-3.5 w-3.5 transition", expanded && "rotate-180")} />
                  </span>
                </div>
                <p className="mt-1.5 truncate text-sm font-semibold">{order.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
                  <span>{order.game}</span>
                  <span>{tr("Seller", "বিক্রেতা")}: {order.seller}</span>
                  <span>{order.method}</span>
                  <span className="ml-auto font-display text-base font-bold text-foreground tabular-nums">{formatBDT(order.amount)}</span>
                </div>
                <EscrowRail status={order.status} />
              </button>

              {expanded && (
                <div className="border-t border-border/60 p-4">
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                    {/* timeline */}
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {tr("Escrow timeline", "এস্ক্রো টাইমলাইন")}
                      </p>
                      <ol className="mt-2 space-y-2.5">
                        {order.timeline.map((entry) => (
                          <li key={entry.id} className="flex gap-2.5">
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-emerald-400/25 bg-emerald-400/10">
                              <CheckCircle2 className="h-3 w-3 text-emerald-300" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium">{tr(entry.label.en, entry.label.bn)}</p>
                              {entry.note && <p className="text-[10px] text-muted-foreground">{entry.note}</p>}
                              <p className="text-[9px] text-muted-foreground/70">{formatDateTime(entry.at)} · {entry.by}</p>
                            </div>
                          </li>
                        ))}
                      </ol>

                      {disputeOpen === order.id && (
                        <div className="mt-3 rounded-xl border border-rose-400/20 bg-rose-500/[0.05] p-3">
                          <p className="text-[11px] font-semibold text-rose-200">{tr("Tell the admin what went wrong", "অ্যাডমিনকে জানান কী সমস্যা")}</p>
                          <Textarea
                            value={disputeReason}
                            onChange={(event) => setDisputeReason(event.target.value)}
                            placeholder={tr("Account recovered, wrong credentials, ban…", "অ্যাকাউন্ট রিকভার, ভুল তথ্য, ব্যান…")}
                            className="mt-2 min-h-[70px] text-xs"
                          />
                          <div className="mt-2 flex gap-2">
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={disputeReason.trim().length < 10}
                              onClick={() => {
                                openDispute(order.id, disputeReason.trim());
                                setDisputeOpen(null);
                                setDisputeReason("");
                                toast.success(tr("Dispute opened", "বিরোধ খোলা হয়েছে"));
                              }}
                            >
                              {tr("Open dispute", "বিরোধ খুলুন")}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setDisputeOpen(null)}>{tr("Cancel", "বাতিল")}</Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* actions */}
                    <div className="space-y-2">
                      {canPay && (
                        <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-3">
                          <p className="text-[10px] font-semibold text-amber-200">{tr("Pay by", "পেমেন্ট করুন")} {order.method}</p>
                          <p className="mt-1 text-[9px] leading-relaxed text-muted-foreground">
                            {tr("Merchant", "মার্চেন্ট")}: {order.method === "Nagad" ? settings.nagadNumber : settings.bkashNumber} · {tr("Reference", "রেফারেন্স")}: {order.id}
                          </p>
                          <div className="mt-2 flex gap-1.5">
                            <Input
                              value={trx}
                              onChange={(event) => setTrx(event.target.value)}
                              placeholder={tr("TrxID", "ট্রানজেকশন আইডি")}
                              className="h-8 text-xs"
                            />
                            <Button size="icon-sm" variant="secondary" onClick={() => submitPayment(order)} aria-label={tr("Submit payment", "পেমেন্ট জমা")}>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (navigator.clipboard) void navigator.clipboard.writeText(order.id);
                              toast.success(tr("Reference copied", "রেফারেন্স কপি হয়েছে"));
                            }}
                            className="mt-1.5 inline-flex items-center gap-1 text-[9px] text-primary hover:underline"
                          >
                            <Copy className="h-2.5 w-2.5" />
                            {tr("Copy payment reference", "পেমেন্ট রেফারেন্স কপি")}
                          </button>
                        </div>
                      )}

                      {canRelease && (
                        <>
                          <Button size="sm" className="w-full" onClick={() => release(order)}>
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {tr("Release payment", "পেমেন্ট ছাড়ুন")}
                          </Button>
                          <Button size="sm" variant="outline" className="w-full" onClick={() => setDisputeOpen(order.id)}>
                            <AlertTriangle className="h-3.5 w-3.5" />
                            {tr("Report a problem", "সমস্যা জানান")}
                          </Button>
                        </>
                      )}

                      {waiting && (
                        <div className="rounded-xl border border-sky-400/15 bg-sky-400/[0.05] p-3 text-[10px] leading-relaxed text-muted-foreground">
                          <Clock3 className="mb-1 h-3.5 w-3.5 text-sky-300" />
                          {order.status === "payment_submitted"
                            ? tr("An admin is verifying your payment. You will be notified when the seller can deliver.", "অ্যাডমিন পেমেন্ট যাচাই করছেন। বিক্রেতা ডেলিভারি দিতে পারলে জানানো হবে।")
                            : tr("Payment confirmed. The seller is preparing the handover.", "পেমেন্ট নিশ্চিত। বিক্রেতা হ্যান্ডওভার প্রস্তুত করছেন।")}
                        </div>
                      )}

                      {order.status === "completed" && (
                        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-3 text-[10px] text-emerald-200">
                          <CheckCircle2 className="mb-1 h-3.5 w-3.5" />
                          {tr("Order complete. Thanks for trading safely.", "অর্ডার সম্পন্ন। নিরাপদে লেনদেনের জন্য ধন্যবাদ।")}
                        </div>
                      )}

                      <Button size="sm" variant="secondary" className="w-full" onClick={() => contactAdmin(order)}>
                        <MessageSquare className="h-3.5 w-3.5" />
                        {tr("Contact admin", "অ্যাডমিনে যোগাযোগ")}
                      </Button>
                      <Button asChild size="sm" variant="ghost" className="w-full">
                        <Link href={`/listing/${order.listingId}`}>
                          <Eye className="h-3.5 w-3.5" />
                          {tr("View listing", "লিস্টিং দেখুন")}
                        </Link>
                      </Button>
                      <p className="text-center text-[9px] leading-relaxed text-muted-foreground/70">
                        {tr("Sellers cannot message you directly.", "বিক্রেতা সরাসরি মেসেজ করতে পারবেন না।")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })
      )}
    </div>
  );
}

/* ==================================================================== */
/* Offers                                                               */
/* ==================================================================== */

const OFFER_FILTERS: { key: "all" | OfferStatus; en: string; bn: string }[] = [
  { key: "all", en: "All", bn: "সব" },
  { key: "pending", en: "Pending", bn: "অপেক্ষমাণ" },
  { key: "accepted", en: "Accepted", bn: "গৃহীত" },
  { key: "countered", en: "Countered", bn: "কাউন্টার" },
  { key: "declined", en: "Declined", bn: "প্রত্যাখ্যাত" },
];

export function OffersSection() {
  const tr = useT();
  const { offers, respondOffer, openThread } = useAppStore();
  const [filter, setFilter] = useState<"all" | OfferStatus>("all");
  const visible = filter === "all" ? offers : offers.filter((offer) => offer.status === filter);

  function answer(offerId: string, status: OfferStatus) {
    respondOffer(offerId, status);
    toast.success(
      status === "accepted"
        ? tr("Offer accepted", "অফার গৃহীত")
        : tr("Offer declined", "অফার প্রত্যাখ্যাত"),
      {
        description: tr(
          "The admin desk will relay your answer. Direct contact stays disabled.",
          "অ্যাডমিন ডেস্ক উত্তর পৌঁছে দেবে। সরাসরি যোগাযোগ বন্ধ থাকবে।",
        ),
      },
    );
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-4">
        <div className="flex items-start gap-2.5">
          <Tag className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <div>
            <p className="text-xs font-semibold">
              {tr("Offers across your account", "আপনার অ্যাকাউন্টের সব অফার")}
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
              {tr(
                "Every member can buy and sell. Offers you sent and offers on your listings both appear here — every reply is relayed by an admin, never sent directly.",
                "প্রতিটি মেম্বার কেনা ও বিক্রি করতে পারেন। আপনি পাঠানো এবং আপনার লিস্টিংয়ের অফার—দুটোই এখানে দেখা যায়। প্রতিটি উত্তর অ্যাডমিন পৌঁছে দেন, সরাসরি নয়।",
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {OFFER_FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            aria-pressed={filter === item.key}
            className={cn(
              "rounded-lg border px-2.5 py-1.5 text-[10px] font-medium transition",
              filter === item.key
                ? "border-primary/30 bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {tr(item.en, item.bn)}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Tag}
          title={tr("No offers here yet", "এখনো কোনো অফার নেই")}
          body={tr(
            "Found an account you like? Open its listing and send a price offer — an admin will relay it to the seller.",
            "পছন্দের অ্যাকাউন্ট পেয়েছেন? লিস্টিং খুলে দামের অফার পাঠান — অ্যাডমিন বিক্রেতাকে পৌঁছে দেবেন।",
          )}
          actionHref="/marketplace"
          actionLabel={tr("Find an account", "অ্যাকাউন্ট খুঁজুন")}
        />
      ) : (
        <div className="space-y-2.5">
          {visible.map((offer) => {
            const saving = offer.listPrice - offer.amount;
            return (
              <article key={offer.id} className="glass rounded-2xl p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-primary">{offer.id}</span>
                  <Badge
                    variant={
                      offer.status === "accepted"
                        ? "success"
                        : offer.status === "declined"
                          ? "danger"
                          : offer.status === "countered"
                            ? "warning"
                            : "outline"
                    }
                  >
                    {tr(offerStatusLabel[offer.status].en, offerStatusLabel[offer.status].bn)}
                  </Badge>
                  <span className="ml-auto text-[10px] text-muted-foreground">{timeAgo(offer.createdAt)}</span>
                </div>
                <Link href={`/listing/${offer.listingId}`} className="mt-1.5 block truncate text-sm font-semibold hover:text-primary">
                  {offer.title}
                </Link>
                <div className="mt-2 grid grid-cols-3 gap-2 rounded-xl border border-border bg-white/[0.02] p-2.5 text-center">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{tr("Asking", "চাওয়া")}</p>
                    <p className="mt-0.5 text-xs font-semibold tabular-nums">{formatBDT(offer.listPrice)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{tr("Offer", "অফার")}</p>
                    <p className="mt-0.5 text-xs font-bold text-primary tabular-nums">{formatBDT(offer.amount)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">{tr("Below ask", "কম")}</p>
                    <p className={cn("mt-0.5 text-xs font-semibold tabular-nums", saving > 0 ? "text-emerald-300" : "text-muted-foreground")}>
                      {saving > 0 ? `− ${formatBDT(saving)}` : "—"}
                    </p>
                  </div>
                </div>
                {offer.message && (
                  <p className="mt-2 rounded-lg bg-white/[0.03] px-2.5 py-2 text-[10px] italic leading-relaxed text-muted-foreground">
                    “{offer.message}”
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                  <span>{tr("Buyer", "ক্রেতা")}: {offer.buyer}</span>
                  <span>·</span>
                  <span>{tr("Seller", "বিক্রেতা")}: {offer.seller}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {offer.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => answer(offer.id, "accepted")}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {tr("Accept via admin", "অ্যাডমিনে গ্রহণ")}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => answer(offer.id, "declined")}>
                        {tr("Decline", "প্রত্যাখ্যান")}
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      const id = openThread({
                        subject: `Offer ${offer.id} question`,
                        topic: "offer",
                        context: `${offer.title} · asking ${formatBDT(offer.listPrice)} · offer ${formatBDT(offer.amount)}`,
                        message: `I have a question about offer ${offer.id}.`,
                        listingId: offer.listingId,
                      });
                      toast.success(tr("Ticket opened", "টিকিট খোলা হয়েছে"), { description: id });
                    }}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    {tr("Ask admin", "অ্যাডমিনকে জিজ্ঞাসা")}
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/listing/${offer.listingId}`}>{tr("View listing", "লিস্টিং")}</Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ==================================================================== */
/* Listings                                                             */
/* ==================================================================== */

export function ListingsSection() {
  const tr = useT();
  const { listings, customListings, user } = useAppStore();
  const [paused, setPaused] = useState<string[]>([]);

  const mine = useMemo(() => {
    if (customListings.length > 0) return customListings;
    if (!user) return [];
    const firstName = user.name.split(" ")[0].toLowerCase();
    return listings
      .filter((listing) => listing.seller.username.toLowerCase().includes(firstName))
      .slice(0, 3);
  }, [customListings, listings, user]);

  function togglePause(id: string) {
    setPaused((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
    toast.success(
      paused.includes(id)
        ? tr("Listing resumed", "লিস্টিং চালু হয়েছে")
        : tr("Listing paused", "লিস্টিং পজ হয়েছে"),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">
          {tr(
            "Every member can sell from the same account. Only admins can approve, pause or remove a listing.",
            "প্রতিটি মেম্বার একই অ্যাকাউন্ট থেকে বিক্রি করতে পারেন। শুধু অ্যাডমিন অনুমোদন, পজ বা সরাতে পারেন।",
          )}
        </p>
        <Button asChild size="sm">
          <Link href="/sell">
            <Plus className="h-3.5 w-3.5" />
            {tr("New listing", "নতুন লিস্টিং")}
          </Link>
        </Button>
      </div>

      {mine.length === 0 ? (
        <EmptyState
          icon={Store}
          title={tr("You have no listings yet", "আপনার এখনো কোনো লিস্টিং নেই")}
          body={tr(
            "Create a listing with screenshots and a short video. Verified buyers can find it immediately.",
            "স্ক্রিনশট ও ছোট ভিডিওসহ লিস্টিং তৈরি করুন। ভেরিফাইড ক্রেতারা সাথে সাথে দেখতে পাবেন।",
          )}
          actionHref="/sell"
          actionLabel={tr("Create your first listing", "প্রথম লিস্টিং তৈরি করুন")}
        />
      ) : (
        <div className="space-y-2.5">
          {mine.map((listing, index) => {
            const isPaused = paused.includes(listing.id);
            const views = 120 + index * 87;
            return (
              <article key={listing.id} className="glass flex flex-col gap-3 rounded-2xl p-3 sm:flex-row">
                <Link href={`/listing/${listing.id}`} className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-36">
                  <GameArtwork game={listing.game} index={index} className="h-full w-full" />
                  {isPaused && (
                    <span className="absolute inset-0 grid place-items-center bg-black/60 text-[10px] font-bold uppercase tracking-wider text-white">
                      {tr("Paused", "পজ")}
                    </span>
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant={isPaused ? "outline" : "success"}>
                      {isPaused ? tr("Paused", "পজ") : tr("Live", "লাইভ")}
                    </Badge>
                    <Badge variant="secondary">{listing.type === "auction" ? tr("Auction", "নিলাম") : tr("Fixed", "ফিক্সড")}</Badge>
                    <span className="ml-auto text-[9px] text-muted-foreground">{listing.id}</span>
                  </div>
                  <Link href={`/listing/${listing.id}`} className="mt-1 block truncate text-sm font-semibold hover:text-primary">
                    {listing.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                    <span className="inline-flex items-center gap-0.5"><Eye className="h-3 w-3" />{views}</span>
                    <span className="inline-flex items-center gap-0.5"><Gavel className="h-3 w-3" />{listing.bids}</span>
                    <span className="inline-flex items-center gap-0.5"><Heart className="h-3 w-3" />{8 + index * 5}</span>
                    <span className="font-semibold text-foreground">{formatBDT(listing.price)}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Button size="sm" variant="secondary" onClick={() => togglePause(listing.id)}>
                      {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                      {isPaused ? tr("Resume", "চালু") : tr("Pause", "পজ")}
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/listing/${listing.id}`}>{tr("Preview", "প্রিভিউ")}</Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toast.info(tr("Editing opens the listing draft (demo).", "এডিটিং ড্রাফট খোলে (ডেমো)।"))}
                    >
                      {tr("Edit", "এডিট")}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-rose-300 hover:text-rose-200"
                      onClick={() => toast.info(tr("Removal needs admin approval.", "সরাতে অ্যাডমিন অনুমোদন লাগবে।"))}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-300" />
          <p className="text-xs font-semibold">{tr("Seller payout estimate", "বিক্রেতা পেআউট হিসাব")}</p>
        </div>
        <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">
          {tr(
            "Commission is 7% of the sale price with a ৳50 minimum, deducted from your payout. The buyer pays the listed price — never a hidden markup.",
            "কমিশন বিক্রয়মূল্যের ৭%, সর্বনিম্ন ৳৫০, আপনার পেআউট থেকে কাটা হয়। ক্রেতা তালিকাভুক্ত দামই দেন — কোনো গোপন বেশি দাম নয়।",
          )}
        </p>
        <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
          {[5000, 10000, 25000].map((price) => (
            <span key={price} className="rounded-lg border border-border px-2 py-1">
              {formatBDT(price)} → <span className="font-semibold text-emerald-300">{formatBDT(commissionFor(price).payout)}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
