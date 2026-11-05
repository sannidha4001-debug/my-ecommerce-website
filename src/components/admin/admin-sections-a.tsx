"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Copy,
  Gavel,
  Pause,
  Play,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Countdown } from "@/components/animations/countdown";
import { GameArtwork } from "@/components/marketing/game-artwork";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AdminPanel,
  AdminStat,
} from "@/components/admin/admin-shell";
import {
  adminAudit,
  adminReports,
  bidDepositStatusLabel,
  escrowStatusLabel,
  offerStatusLabel,
  timeAgo,
  type EscrowStatus,
} from "@/lib/account";
import { useAppStore } from "@/lib/store";
import { cn, formatBDT } from "@/lib/utils";

const revenueSeries = [
  { day: "01", amount: 18400 },
  { day: "04", amount: 24200 },
  { day: "07", amount: 19800 },
  { day: "10", amount: 32600 },
  { day: "13", amount: 28800 },
  { day: "16", amount: 40200 },
  { day: "19", amount: 36400 },
  { day: "22", amount: 47800 },
  { day: "25", amount: 43500 },
  { day: "28", amount: 56200 },
  { day: "30", amount: 51800 },
];

/* ==================================================================== */
/* Overview                                                             */
/* ==================================================================== */

export function AdminOverview() {
  const { orders, listings, offers, threads, bids } = useAppStore();
  const [range, setRange] = useState("30d");

  const gmv = orders.reduce((total, order) => total + order.amount, 0);
  const commission = orders.reduce((total, order) => total + order.fee, 0);
  const queue = orders.filter((order) =>
    ["payment_submitted", "payment_confirmed", "delivered"].includes(order.status),
  );
  const disputes = orders.filter((order) => order.status === "disputed");
  const pendingOffers = offers.filter((offer) => offer.status === "pending");
  const openThreads = threads.filter((thread) => thread.status === "open");
  const max = Math.max(...revenueSeries.map((point) => point.amount));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-5">
        <AdminStat icon={CircleDollarSign} label="Gross volume" value={formatBDT(gmv)} hint="All demo orders" tone="emerald" />
        <AdminStat icon={Wallet} label="Commission" value={formatBDT(commission)} hint="7% · min ৳50" tone="cyan" />
        <AdminStat icon={Clock3} label="Escrow queue" value={String(queue.length)} hint="Awaiting action" tone="amber" />
        <AdminStat icon={ShieldAlert} label="Disputes" value={String(disputes.length)} hint="Needs review" tone="rose" />
        <AdminStat icon={Gavel} label="Live auctions" value={String(listings.filter((listing) => listing.type === "auction").length)} hint={`${Object.values(bids).flat().length} bids total`} tone="violet" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <AdminPanel
            title="Marketplace volume"
            description="Daily GMV across completed and in-progress orders."
            action={
              <div className="flex gap-1">
                {["7d", "30d", "90d"].map((option) => (
                  <button key={option} type="button" onClick={() => setRange(option)} aria-pressed={range === option} className={cn("rounded border px-2 py-0.5 text-[9px]", range === option ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-white/[0.07] text-slate-500")}>
                    {option}
                  </button>
                ))}
              </div>
            }
          >
            <div className="p-3.5">
              <div className="flex h-40 items-end gap-1.5">
                {revenueSeries.map((point) => (
                  <div key={point.day} className="group flex flex-1 flex-col items-center gap-1">
                    <span className="text-[7px] text-slate-600 opacity-0 transition group-hover:opacity-100">
                      {(point.amount / 1000).toFixed(1)}k
                    </span>
                    <div
                      className="w-full rounded-t-sm bg-gradient-to-t from-emerald-500/40 to-cyan-400/80 transition-all duration-500 group-hover:from-emerald-400/60"
                      style={{ height: `${(point.amount / max) * 100}%` }}
                    />
                    <span className="text-[7px] text-slate-600">{point.day}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-2.5 text-[9px]">
                <p><span className="block text-slate-500">Total volume</span><span className="mt-0.5 block text-sm font-bold text-white">{formatBDT(revenueSeries.reduce((total, point) => total + point.amount, 0))}</span></p>
                <p><span className="block text-slate-500">Avg. order</span><span className="mt-0.5 block text-sm font-bold text-white">{formatBDT(Math.round(gmv / Math.max(1, orders.length)))}</span></p>
                <p><span className="block text-slate-500">Completion</span><span className="mt-0.5 block text-sm font-bold text-emerald-300">94%</span></p>
              </div>
            </div>
          </AdminPanel>

          <AdminPanel title="Escrow queue" description="Payments and deliveries that need an admin decision." action={<Link href="/admin/orders" className="text-[9px] font-medium text-emerald-300 hover:underline">Open orders →</Link>}>
            <div className="divide-y divide-white/[0.05]">
              {queue.slice(0, 4).map((order) => (
                <div key={order.id} className="flex flex-wrap items-center gap-2 px-3.5 py-2.5">
                  <span className="text-[9px] font-bold text-emerald-300">{order.id}</span>
                  <span className="min-w-0 flex-1 truncate text-[10px] text-slate-300">{order.title}</span>
                  <Badge variant={order.status === "delivered" ? "live" : order.status === "payment_confirmed" ? "secondary" : "warning"} className="text-[8px]">
                    {escrowStatusLabel[order.status].en}
                  </Badge>
                  <span className="w-16 text-right text-[10px] font-semibold tabular-nums text-white">{formatBDT(order.amount)}</span>
                  <Link href="/admin/orders" className="text-[9px] text-slate-500 hover:text-emerald-300">Review</Link>
                </div>
              ))}
            </div>
          </AdminPanel>
        </div>

        <div className="space-y-4">
          <AdminPanel title="Needs attention" description="Open reports and offers awaiting relay." action={<Badge variant="danger" className="text-[8px]">{disputes.length + pendingOffers.length + openThreads.length} open</Badge>}>
            <div className="space-y-1.5 p-2.5">
              {adminReports.filter((report) => report.status !== "Resolved").map((report) => (
                <Link key={report.id} href="/admin/reports" className="block rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2 transition hover:border-rose-400/30">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-bold text-slate-500">{report.id}</span>
                    <Badge variant={report.severity === "High" ? "danger" : "warning"} className="px-1 py-0 text-[7px]">{report.severity}</Badge>
                    <span className="ml-auto text-[8px] text-slate-600">{timeAgo(report.at)}</span>
                  </div>
                  <p className="mt-1 text-[10px] font-medium text-slate-200">{report.type}</p>
                  <p className="text-[8px] text-slate-500">{report.target} · {report.status}</p>
                </Link>
              ))}
              {pendingOffers.map((offer) => (
                <Link key={offer.id} href="/admin/orders" className="block rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2 transition hover:border-amber-400/30">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-bold text-slate-500">{offer.id}</span>
                    <Badge variant="warning" className="ml-auto px-1 py-0 text-[7px]">{offerStatusLabel[offer.status].en}</Badge>
                  </div>
                  <p className="mt-1 truncate text-[10px] font-medium text-slate-200">{offer.title}</p>
                  <p className="text-[8px] text-slate-500">{formatBDT(offer.amount)} · {offer.seller}</p>
                </Link>
              ))}
            </div>
          </AdminPanel>

          <AdminPanel title="Recent audit events" action={<Link href="/admin/audit" className="text-[9px] text-emerald-300 hover:underline">Full log →</Link>}>
            <div className="space-y-0 divide-y divide-white/[0.05]">
              {adminAudit.slice(0, 4).map((entry) => (
                <div key={entry.id} className="px-3 py-2 text-[9px]">
                  <p className="text-slate-300">{entry.action}</p>
                  <p className="text-slate-600">{entry.actor} · {timeAgo(entry.at)}</p>
                </div>
              ))}
            </div>
          </AdminPanel>
        </div>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-3">
        {[
          { icon: ClipboardCheck, label: "Listings pending review", value: String(listings.length), hint: "Across 8 games", href: "/admin/listings" },
          { icon: Users, label: "Registered users", value: "3,284", hint: "62 joined this week", href: "/admin/users" },
          { icon: TrendingUp, label: "Bid success rate", value: "71%", hint: "Anti-sniping extended 12 auctions", href: "/admin/auctions" },
        ].map((item) => (
          <Link key={item.label} href={item.href} className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 transition hover:border-emerald-400/25">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
              <item.icon className="h-4 w-4 text-emerald-300" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[9px] uppercase tracking-wider text-slate-500">{item.label}</span>
              <span className="block font-display text-base font-bold text-white">{item.value}</span>
              <span className="block truncate text-[8px] text-slate-600">{item.hint}</span>
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-slate-600 transition group-hover:text-emerald-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ==================================================================== */
/* Listings                                                             */
/* ==================================================================== */

export function AdminListings() {
  const { listings } = useAppStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  const visible = useMemo(() => {
    return listings.filter((listing) => {
      const status = statuses[listing.id] ?? (listing.featured ? "approved" : "pending");
      if (filter !== "all" && status !== filter) return false;
      const haystack = `${listing.title} ${listing.game.name} ${listing.seller.username} ${listing.id}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [listings, filter, query, statuses]);

  function setStatus(id: string, status: string, label: string) {
    setStatuses((current) => ({ ...current, [id]: status }));
    toast.success(`${label} · ${id}`);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[180px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, seller or ID…" className="h-8 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] pl-8 pr-3 text-[10px] text-slate-200 placeholder:text-slate-600 focus:border-emerald-400/40 focus:outline-none" />
        </div>
        <div className="flex gap-1">
          {["all", "pending", "approved", "paused"].map((option) => (
            <button key={option} type="button" onClick={() => setFilter(option)} aria-pressed={filter === option} className={cn("rounded-md border px-2 py-1 text-[9px] capitalize", filter === option ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-white/[0.07] text-slate-500")}>
              {option}
            </button>
          ))}
        </div>
        <Button size="sm" className="h-8 bg-emerald-500 text-[10px] text-[#04120f] hover:bg-emerald-400" onClick={() => toast.info("Admin auction builder opens in the full Supabase build.")}>
          <Plus className="h-3 w-3" />
          New listing
        </Button>
      </div>

      <AdminPanel title={`Listings (${visible.length})`} description="Approve, feature or pause marketplace inventory.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left">
            <thead>
              <tr className="border-b border-white/[0.06] text-[8px] uppercase tracking-wider text-slate-500">
                <th className="px-3 py-2 font-medium">Listing</th>
                <th className="px-3 py-2 font-medium">Seller</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Price</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {visible.map((listing, index) => {
                const status = statuses[listing.id] ?? (listing.featured ? "approved" : "pending");
                return (
                  <tr key={listing.id} className="text-[10px] text-slate-300 hover:bg-white/[0.02]">
                    <td className="max-w-[280px] px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="h-8 w-11 shrink-0 overflow-hidden rounded">
                          <GameArtwork game={listing.game} index={index} className="h-full w-full" />
                        </span>
                        <span className="min-w-0">
                          <Link href={`/listing/${listing.id}`} className="block truncate font-medium text-slate-200 hover:text-emerald-300">{listing.title}</Link>
                          <span className="block text-[8px] text-slate-600">{listing.id} · {listing.game.name}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[9px]">{listing.seller.username}</td>
                    <td className="px-3 py-2"><Badge variant="outline" className="border-white/10 text-[8px] text-slate-400">{listing.type === "auction" ? "Auction" : "Fixed"}</Badge></td>
                    <td className="px-3 py-2 font-semibold text-white tabular-nums">{formatBDT(listing.price)}</td>
                    <td className="px-3 py-2">
                      <Badge variant={status === "approved" ? "success" : status === "paused" ? "outline" : "warning"} className="text-[8px] capitalize">{status}</Badge>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        {status !== "approved" && (
                          <button type="button" onClick={() => setStatus(listing.id, "approved", "Listing approved")} className="rounded border border-emerald-400/20 bg-emerald-400/10 px-1.5 py-0.5 text-[8px] text-emerald-300 hover:bg-emerald-400/20">
                            Approve
                          </button>
                        )}
                        <button type="button" onClick={() => setStatus(listing.id, status === "paused" ? "approved" : "paused", status === "paused" ? "Listing resumed" : "Listing paused")} className="rounded border border-white/10 px-1.5 py-0.5 text-[8px] text-slate-400 hover:text-white">
                          {status === "paused" ? "Resume" : "Pause"}
                        </button>
                        <button type="button" onClick={() => setStatus(listing.id, "approved", "Listing featured")} className="rounded border border-white/10 px-1.5 py-0.5 text-[8px] text-amber-300 hover:bg-amber-400/10" aria-label="Feature">
                          <Star className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AdminPanel>
    </div>
  );
}

/* ==================================================================== */
/* Auctions                                                             */
/* ==================================================================== */

export function AdminAuctions() {
  const { listings, bids, endsAtFor, bidDeposits, confirmBidDeposit, refundBidDeposit } = useAppStore();
  const auctions = listings.filter((listing) => listing.type === "auction");
  const pendingDeposits = bidDeposits.filter((deposit) => deposit.status === "pending");
  const reviewedDeposits = bidDeposits
    .filter((deposit) => deposit.status !== "pending")
    .slice(0, 4);
  const [paused, setPaused] = useState<string[]>([]);
  const [featured, setFeatured] = useState<string[]>(["gx-1001"]);
  const [tick, setTick] = useState(0);

  function reviewDeposit(id: string, approve: boolean) {
    const result = confirmBidDeposit(id, approve);
    if (!result.ok) {
      const reasons: Record<string, string> = {
        auth: "Sign in to the admin console first.",
        low: "This bid is below the current minimum. Ask the bidder to increase it and pay the difference, or reject the deposit.",
        own: "The bidder appears to own this listing. Reject the deposit.",
        listing: "The listing is no longer available.",
        reviewed: "This deposit was already reviewed.",
        missing: "Deposit not found.",
      };
      toast.error(reasons[result.error ?? ""] ?? "Could not review the deposit.");
      return;
    }
    toast.success(
      approve ? "Deposit confirmed — bid placed" : "Deposit rejected",
      {
        description: approve
          ? "The bid is now live in the auction and the bidder has been notified."
          : "The bidder has been notified. Refund outside the platform if the money was received.",
      },
    );
  }

  function refundDeposit(id: string) {
    const result = refundBidDeposit(id, "Refunded after auction review");
    if (!result.ok) {
      toast.error(
        result.error === "auth"
          ? "Sign in to the admin console first."
          : "Only a confirmed deposit can be refunded, and not while its bid is still live.",
      );
      return;
    }
    toast.success("Deposit marked refunded", {
      description:
        "Send the money back to the member's bKash/Nagad number. The refund is written to the audit log.",
    });
  }

  function togglePause(id: string) {
    setPaused((current) => current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]);
    toast.success(paused.includes(id) ? `Auction resumed · ${id}` : `Auction paused · ${id}`);
  }

  function extend(id: string) {
    setTick((value) => value + 1);
    toast.success(`Extended by 10 minutes · ${id}`, { description: "Anti-sniping protection stays active." });
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <AdminStat icon={Gavel} label="Live auctions" value={String(auctions.length - paused.length)} hint="English + sealed bid" tone="emerald" />
        <AdminStat icon={Clock3} label="Ending < 3h" value={String(auctions.filter((listing) => (listing.endsInHours ?? 99) < 3).length)} hint="Watch for sniping" tone="amber" />
        <AdminStat icon={ShieldCheck} label="Pending deposits" value={String(pendingDeposits.length)} hint="Awaiting TrxID check" tone="amber" />
        <AdminStat icon={Users} label="Bidders" value={String(Object.values(bids).flat().length)} hint="Phone-verified only" tone="cyan" />
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button size="sm" variant="secondary" className="h-8 border-white/10 bg-white/[0.04] text-[10px] text-slate-200" onClick={() => toast.info("Bulk auction creation is a demo action.")}>
          <Copy className="h-3 w-3" />
          Bulk create
        </Button>
        <Button size="sm" className="h-8 bg-emerald-500 text-[10px] text-[#04120f] hover:bg-emerald-400" onClick={() => toast.info("Auction builder is a demo action.")}>
          <Plus className="h-3 w-3" />
          Create auction
        </Button>
      </div>

      {/* ----------------------- bid deposit verification ------------------ */}
      <AdminPanel
        title="Bid deposit confirmations"
        description="Bidders pay the configured percentage to the admin bKash/Nagad number and submit a TrxID. Confirm the transaction to place the bid."
      >
        <div className="space-y-2 p-3.5">
          {pendingDeposits.length === 0 ? (
            <p className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-4 text-center text-[10px] text-slate-500">
              No deposits waiting. New auction bids appear here before they reach the auction.
            </p>
          ) : (
            pendingDeposits.map((deposit) => (
              <article
                key={deposit.id}
                className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-3"
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[9px] font-bold text-amber-300">{deposit.id}</span>
                  <Badge variant="warning" className="px-1 py-0 text-[7px]">Awaiting admin</Badge>
                  <span className="ml-auto text-[8px] text-slate-500">{timeAgo(deposit.createdAt)}</span>
                </div>
                <div className="mt-1.5 grid gap-1 text-[9px] text-slate-400 sm:grid-cols-2">
                  <p className="truncate text-[11px] font-semibold text-slate-100 sm:col-span-2">
                    {deposit.listingTitle}
                  </p>
                  <p>Bidder: <span className="text-slate-200">{deposit.bidder}</span> · {deposit.bidderEmail}</p>
                  <p>Bid amount: <span className="font-semibold text-white">{formatBDT(deposit.amount)}</span></p>
                  <p>Deposit: <span className="font-semibold text-amber-200">{formatBDT(deposit.deposit)}</span></p>
                  <p>Method: <span className="text-slate-200">{deposit.method}</span></p>
                  <p>Sender: <span className="tabular-nums text-slate-200">{deposit.senderNumber}</span></p>
                  <p>TrxID: <span className="font-mono font-semibold tracking-wider text-emerald-300">{deposit.transactionId}</span></p>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Button
                    size="sm"
                    className="h-7 bg-emerald-500 px-2 text-[9px] text-[#04120f] hover:bg-emerald-400"
                    onClick={() => reviewDeposit(deposit.id, true)}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Confirm &amp; place bid
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 border-white/10 px-2 text-[9px] text-rose-300 hover:bg-rose-400/10"
                    onClick={() => reviewDeposit(deposit.id, false)}
                  >
                    Reject deposit
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-[9px] text-slate-400">
                    <Link href={`/listing/${deposit.listingId}`}>Open listing</Link>
                  </Button>
                </div>
              </article>
            ))
          )}

          {reviewedDeposits.length > 0 && (
            <div className="border-t border-white/[0.06] pt-2">
              <p className="mb-1 text-[8px] font-semibold uppercase tracking-wider text-slate-600">
                Recently reviewed
              </p>
              <div className="flex flex-wrap gap-1.5">
                {reviewedDeposits.map((deposit) => (
                  <span
                    key={deposit.id}
                    className={cn(
                      "inline-flex items-center gap-1 rounded border px-1.5 py-1 text-[8px]",
                      deposit.status === "confirmed"
                        ? "border-emerald-400/20 text-emerald-300"
                        : deposit.status === "refunded"
                          ? "border-white/10 text-slate-400"
                          : "border-rose-400/20 text-rose-300",
                    )}
                  >
                    {deposit.bidder} · {formatBDT(deposit.deposit)} ·{" "}
                    {bidDepositStatusLabel[deposit.status].en}
                    {deposit.status === "confirmed" && (
                      <button
                        type="button"
                        onClick={() => refundDeposit(deposit.id)}
                        className="ml-0.5 rounded border border-white/10 px-1 py-0.5 text-[7px] text-slate-400 transition hover:border-amber-400/30 hover:text-amber-300"
                      >
                        Mark refunded
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </AdminPanel>

      <div className="grid gap-3 xl:grid-cols-2">
        {auctions.map((listing, index) => {
          const isPaused = paused.includes(listing.id);
          const isFeatured = featured.includes(listing.id);
          const topBid = bids[listing.id]?.[0]?.amount ?? listing.price;
          return (
            <article key={`${listing.id}-${tick}`} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
              <div className="flex items-start gap-2.5">
                <span className="h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                  <GameArtwork game={listing.game} index={index} className="h-full w-full" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[8px] font-bold text-emerald-300">{listing.id}</span>
                    <Badge variant={isPaused ? "outline" : "live"} className="px-1 py-0 text-[7px]">{isPaused ? "Paused" : "Live"}</Badge>
                    {isFeatured && <Badge variant="gradient" className="px-1 py-0 text-[7px]">Featured</Badge>}
                    <Badge variant="outline" className="border-white/10 px-1 py-0 text-[7px] text-slate-400">Anti-snipe</Badge>
                  </div>
                  <Link href={`/listing/${listing.id}`} className="mt-0.5 block truncate text-[11px] font-semibold text-slate-100 hover:text-emerald-300">{listing.title}</Link>
                  <p className="text-[8px] text-slate-500">{listing.seller.username} · {listing.platform}</p>
                </div>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg border border-white/[0.06] bg-black/20 px-2 py-1.5 text-center">
                <div>
                  <p className="text-[7px] uppercase tracking-wider text-slate-600">Top bid</p>
                  <p className="text-[10px] font-bold text-white tabular-nums">{formatBDT(topBid)}</p>
                </div>
                <div>
                  <p className="text-[7px] uppercase tracking-wider text-slate-600">Bids</p>
                  <p className="text-[10px] font-bold text-white">{bids[listing.id]?.length ?? listing.bids}</p>
                </div>
                <div>
                  <p className="text-[7px] uppercase tracking-wider text-slate-600">Ends in</p>
                  <Countdown endsAt={endsAtFor(listing.id)} showIcon={false} className="text-[10px] text-rose-300" />
                </div>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                <button type="button" onClick={() => togglePause(listing.id)} className="inline-flex items-center gap-1 rounded border border-white/10 px-1.5 py-1 text-[8px] text-slate-300 hover:bg-white/5">
                  {isPaused ? <Play className="h-2.5 w-2.5" /> : <Pause className="h-2.5 w-2.5" />}
                  {isPaused ? "Resume" : "Pause"}
                </button>
                <button type="button" onClick={() => extend(listing.id)} className="rounded border border-white/10 px-1.5 py-1 text-[8px] text-slate-300 hover:bg-white/5">+10 min</button>
                <button type="button" onClick={() => { setFeatured((current) => isFeatured ? current.filter((id) => id !== listing.id) : [...current, listing.id]); toast.success(isFeatured ? "Removed from featured" : "Featured auction"); }} className={cn("rounded border px-1.5 py-1 text-[8px]", isFeatured ? "border-amber-400/30 bg-amber-400/10 text-amber-300" : "border-white/10 text-slate-300 hover:bg-white/5")}>
                  <Star className="mr-0.5 inline h-2.5 w-2.5" />Feature
                </button>
                <button type="button" onClick={() => toast.success(`Cloned ${listing.id}`, { description: "New draft created with the same settings." })} className="rounded border border-white/10 px-1.5 py-1 text-[8px] text-slate-300 hover:bg-white/5">Clone</button>
                <button type="button" onClick={() => toast.warning(`End ${listing.id} early?`, { description: "Highest bidder would be notified (demo)." })} className="rounded border border-white/10 px-1.5 py-1 text-[8px] text-rose-300 hover:bg-rose-400/10">End early</button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="rounded-xl border border-amber-400/15 bg-amber-400/[0.04] p-3 text-[9px] leading-relaxed text-slate-400">
        <strong className="text-amber-300">Anti-sniping policy:</strong> a bid inside the final 2 minutes extends the auction by 2 minutes (max 10 extensions). Bids are accepted atomically server-side; the winner has 24 hours to pay, then the next bidder is offered the account if payment fails.
      </div>
    </div>
  );
}

/* ==================================================================== */
/* Orders                                                               */
/* ==================================================================== */

const ORDER_TABS: ("all" | EscrowStatus)[] = [
  "all",
  "awaiting_payment",
  "payment_submitted",
  "payment_confirmed",
  "delivered",
  "completed",
  "disputed",
  "refunded",
  "cancelled",
];

export function AdminOrders() {
  const { orders, setOrderStatus, openThread } = useAppStore();
  const [tab, setTab] = useState<"all" | EscrowStatus>("all");
  const [expanded, setExpanded] = useState<string | null>("GX-2402");

  const visible = tab === "all" ? orders : orders.filter((order) => order.status === tab);

  function act(orderId: string, status: EscrowStatus, message: string) {
    setOrderStatus(orderId, status, message);
    toast.success(message, { description: orderId });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1">
        {ORDER_TABS.map((option) => {
          const count = option === "all" ? orders.length : orders.filter((order) => order.status === option).length;
          return (
            <button key={option} type="button" onClick={() => setTab(option)} aria-pressed={tab === option} className={cn("rounded border px-2 py-1 text-[8px] capitalize", tab === option ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" : "border-white/[0.07] text-slate-500")}>
              {option.replace(/_/g, " ")} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {visible.map((order) => {
          const open = expanded === order.id;
          return (
            <article key={order.id} className="rounded-xl border border-white/[0.07] bg-white/[0.02]">
              <button type="button" onClick={() => setExpanded(open ? null : order.id)} aria-expanded={open} className="w-full px-3 py-2.5 text-left">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[9px] font-bold text-emerald-300">{order.id}</span>
                  <Badge variant={order.status === "completed" ? "success" : order.status === "disputed" ? "danger" : order.status === "delivered" ? "live" : "outline"} className="px-1.5 py-0 text-[7px]">
                    {escrowStatusLabel[order.status].en}
                  </Badge>
                  <span className="text-[8px] text-slate-500">{order.method} · {timeAgo(order.createdAt)}</span>
                  <span className="ml-auto text-[11px] font-bold text-white tabular-nums">{formatBDT(order.amount)}</span>
                  <ChevronDown className={cn("h-3 w-3 text-slate-500 transition", open && "rotate-180")} />
                </div>
                <p className="mt-1 truncate text-[10px] font-medium text-slate-200">{order.title}</p>
                <p className="text-[8px] text-slate-500">{order.buyer} → {order.seller} · {order.game} · fee {formatBDT(order.fee)}</p>
              </button>

              {open && (
                <div className="border-t border-white/[0.06] px-3 py-2.5">
                  <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                    <ol className="space-y-1.5">
                      {order.timeline.map((entry) => (
                        <li key={entry.id} className="flex items-start gap-1.5 text-[9px]">
                          <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400/70" />
                          <span className="min-w-0">
                            <span className="block text-slate-300">{entry.label.en}{entry.note ? ` — ${entry.note}` : ""}</span>
                            <span className="block text-[8px] text-slate-600">{new Date(entry.at).toLocaleString("en-BD")} · {entry.by}</span>
                          </span>
                        </li>
                      ))}
                    </ol>
                    <div className="space-y-1.5">
                      {order.status === "payment_submitted" && (
                        <button type="button" onClick={() => act(order.id, "payment_confirmed", "Payment verified by admin")} className="w-full rounded-md bg-emerald-500 px-2 py-1.5 text-[9px] font-semibold text-[#04120f] hover:bg-emerald-400">
                          Confirm payment
                        </button>
                      )}
                      {order.status === "delivered" && (
                        <button type="button" onClick={() => act(order.id, "completed", "Inspection passed — buyer paid")} className="w-full rounded-md bg-emerald-500 px-2 py-1.5 text-[9px] font-semibold text-[#04120f] hover:bg-emerald-400">
                          Release payout
                        </button>
                      )}
                      {order.status === "disputed" && (
                        <button type="button" onClick={() => act(order.id, "refunded", "Dispute resolved in buyer's favour")} className="w-full rounded-md bg-rose-500 px-2 py-1.5 text-[9px] font-semibold text-white hover:bg-rose-400">
                          Refund buyer
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const id = openThread({
                            subject: `Admin note for ${order.id}`,
                            topic: "order",
                            context: `${order.title} · ${formatBDT(order.amount)}`,
                            message: `Internal follow-up started for ${order.id}.`,
                            orderId: order.id,
                            listingId: order.listingId,
                          });
                          toast.success("Support thread opened", { description: id });
                        }}
                        className="w-full rounded-md border border-white/10 px-2 py-1.5 text-[9px] text-slate-300 hover:bg-white/5"
                      >
                        Open support thread
                      </button>
                      {!["completed", "cancelled", "refunded"].includes(order.status) && (
                        <button type="button" onClick={() => act(order.id, "cancelled", "Order cancelled by admin")} className="w-full rounded-md border border-white/10 px-2 py-1.5 text-[9px] text-rose-300 hover:bg-rose-400/10">
                          Cancel order
                        </button>
                      )}
                      <Link href={`/listing/${order.listingId}`} className="block text-center text-[8px] text-slate-500 hover:text-emerald-300">View listing →</Link>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <p className="flex items-center gap-1.5 text-[8px] text-slate-600">
        <ShieldCheck className="h-3 w-3 text-emerald-500" />
        Status changes are append-only. Disputes cannot be deleted, only resolved with a written reason.
      </p>
    </div>
  );
}
