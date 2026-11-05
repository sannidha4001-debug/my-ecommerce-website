"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileCheck2,
  Heart,
  Info,
  Landmark,
  Loader2,
  LockKeyhole,
  MessageSquare,
  Phone,
  Plus,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Upload,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime, timeAgo, type Thread } from "@/lib/account";
import { useAppStore } from "@/lib/store";
import { cn, formatBDT } from "@/lib/utils";
import { EmptyState, SectionTitle, StatCard, useT } from "@/components/dashboard/ui";

/* ==================================================================== */
/* Support                                                              */
/* ==================================================================== */

const TOPICS: { value: Thread["topic"]; en: string; bn: string }[] = [
  { value: "order", en: "Order", bn: "অর্ডার" },
  { value: "offer", en: "Offer", bn: "অফার" },
  { value: "payment", en: "Payment", bn: "পেমেন্ট" },
  { value: "account", en: "Account", bn: "অ্যাকাউন্ট" },
  { value: "other", en: "Other", bn: "অন্যান্য" },
];

export function SupportSection() {
  const tr = useT();
  const { threads, replyThread, resolveThread, openThread } = useAppStore();
  const [selectedId, setSelectedId] = useState<string | null>(threads[0]?.id ?? null);
  const [reply, setReply] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState<Thread["topic"]>("order");
  const [message, setMessage] = useState("");

  const selected = threads.find((thread) => thread.id === selectedId) ?? threads[0];

  function send() {
    if (!selected || !reply.trim()) return;
    replyThread(selected.id, reply);
    setReply("");
    toast.success(tr("Message sent to support", "সাপোর্টে মেসেজ পাঠানো হয়েছে"));
  }

  function createTicket(event: React.FormEvent) {
    event.preventDefault();
    if (subject.trim().length < 4 || message.trim().length < 10) {
      toast.error(tr("Add a subject and at least 10 characters of detail.", "বিষয় ও অন্তত ১০ অক্ষরের বিবরণ দিন।"));
      return;
    }
    const id = openThread({
      subject: subject.trim(),
      topic,
      context: "Created from the dashboard support desk",
      message: message.trim(),
    });
    setComposeOpen(false);
    setSubject("");
    setMessage("");
    setSelectedId(id);
    toast.success(tr("Ticket opened", "টিকিট খোলা হয়েছে"), { description: id });
  }

  return (
    <div className="space-y-4">
      <div className="glass flex items-start gap-2.5 rounded-xl p-3.5">
        <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
        <div className="min-w-0">
          <p className="text-xs font-semibold">{tr("Admin-mediated conversations only", "শুধু অ্যাডমিন-মধ্যস্থিত কথোপকথন")}</p>
          <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
            {tr(
              "Members cannot message each other. Every message, offer and handover proof passes through a GameXchange admin. Never share a game password, OTP or recovery code here either.",
              "ক্রেতা ও বিক্রেতা একে অপরকে মেসেজ করতে পারেন না। প্রতিটি মেসেজ, অফার ও হ্যান্ডওভার প্রমাণ GameXchange অ্যাডমিনের মাধ্যমে যায়। এখানেও গেম পাসওয়ার্ড, OTP বা রিকভারি কোড শেয়ার করবেন না।",
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">
          {threads.filter((thread) => thread.status === "open").length} {tr("open tickets", "খোলা টিকিট")}
        </p>
        <Button size="sm" onClick={() => setComposeOpen((value) => !value)}>
          <Plus className="h-3.5 w-3.5" />
          {tr("New ticket", "নতুন টিকিট")}
        </Button>
      </div>

      {composeOpen && (
        <form onSubmit={createTicket} className="glass rounded-2xl p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="ticket-subject">{tr("Subject", "বিষয়")}</Label>
              <Input id="ticket-subject" value={subject} onChange={(event) => setSubject(event.target.value)} placeholder={tr("Payment not verified", "পেমেন্ট যাচাই হয়নি")} className="mt-1.5" maxLength={90} />
            </div>
            <div>
              <Label htmlFor="ticket-topic">{tr("Topic", "বিষয়শ্রেণি")}</Label>
              <select
                id="ticket-topic"
                value={topic}
                onChange={(event) => setTopic(event.target.value as Thread["topic"])}
                className="mt-1.5 flex h-11 w-full rounded-xl border border-border bg-white/[0.04] px-3 text-sm text-foreground outline-none focus:border-primary/60"
              >
                {TOPICS.map((item) => (
                  <option key={item.value} value={item.value}>{tr(item.en, item.bn)}</option>
                ))}
              </select>
            </div>
          </div>
          <Label htmlFor="ticket-message" className="mt-3 block">{tr("What do you need?", "আপনার কী দরকার?")}</Label>
          <Textarea id="ticket-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder={tr("Explain the issue. Never include passwords or OTPs.", "সমস্যা লিখুন। পাসওয়ার্ড বা OTP লিখবেন না।")} className="mt-1.5 min-h-[90px]" maxLength={800} />
          <div className="mt-2 flex gap-2">
            <Button type="submit" size="sm">{tr("Open ticket", "টিকিট খুলুন")}</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setComposeOpen(false)}>{tr("Cancel", "বাতিল")}</Button>
          </div>
        </form>
      )}

      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="glass max-h-[560px] space-y-1 overflow-y-auto rounded-2xl p-2">
          {threads.map((thread) => (
            <button
              key={thread.id}
              type="button"
              onClick={() => setSelectedId(thread.id)}
              className={cn(
                "w-full rounded-xl border px-3 py-2.5 text-left transition",
                selected?.id === thread.id
                  ? "border-primary/30 bg-primary/10"
                  : "border-transparent hover:bg-white/[0.04]",
              )}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-bold text-primary">{thread.id}</span>
                <Badge variant={thread.status === "open" ? "warning" : "success"} className="px-1.5 py-0 text-[8px]">
                  {thread.status === "open" ? tr("Open", "খোলা") : tr("Resolved", "সমাধান")}
                </Badge>
                {thread.unread > 0 && <span className="ml-auto grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[8px] font-bold text-white">{thread.unread}</span>}
              </div>
              <p className="mt-1 line-clamp-2 text-[11px] font-medium">{thread.subject}</p>
              <p className="mt-0.5 text-[9px] text-muted-foreground">{timeAgo(thread.updatedAt)} · {thread.messages.length} {tr("messages", "মেসেজ")}</p>
            </button>
          ))}
        </div>

        {selected ? (
          <div className="glass flex min-h-[420px] flex-col rounded-2xl">
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border/60 p-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-primary">{selected.id}</span>
                  <Badge variant="outline">{tr(TOPICS.find((item) => item.value === selected.topic)?.en ?? "Other", TOPICS.find((item) => item.value === selected.topic)?.bn ?? "অন্যান্য")}</Badge>
                  {selected.orderId && <Badge variant="secondary">{selected.orderId}</Badge>}
                </div>
                <h3 className="mt-1 text-sm font-semibold">{selected.subject}</h3>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{selected.context}</p>
              </div>
              {selected.status === "open" && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    resolveThread(selected.id);
                    toast.success(tr("Ticket marked resolved", "টিকিট সমাধান হয়েছে"));
                  }}
                >
                  <Check className="h-3.5 w-3.5" />
                  {tr("Resolve", "সমাধান")}
                </Button>
              )}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {selected.messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.author === "you" ? "justify-end" : "justify-start")}>
                  {msg.author === "system" ? (
                    <div className="mx-auto max-w-md rounded-lg border border-border/60 bg-white/[0.02] px-3 py-2 text-center text-[10px] leading-relaxed text-muted-foreground">
                      <ShieldCheck className="mx-auto mb-1 h-3 w-3 text-emerald-400" />
                      {msg.body}
                    </div>
                  ) : (
                    <div className={cn("max-w-[85%] rounded-2xl px-3.5 py-2.5", msg.author === "you" ? "bg-brand-gradient text-white" : "border border-violet-400/20 bg-violet-400/[0.08]")}>
                      <p className={cn("text-[9px] font-semibold", msg.author === "you" ? "text-white/70" : "text-violet-300")}>
                        {msg.author === "you" ? tr("You", "আপনি") : tr("GameXchange admin", "GameXchange অ্যাডমিন")}
                      </p>
                      <p className="mt-0.5 whitespace-pre-line text-[11px] leading-relaxed">{msg.body}</p>
                      <p className={cn("mt-1 text-[8px]", msg.author === "you" ? "text-white/50" : "text-muted-foreground/60")}>{formatDateTime(msg.at)}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-border/60 p-3">
              <div className="flex gap-2">
                <Input
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      send();
                    }
                  }}
                  placeholder={selected.status === "resolved" ? tr("Ticket resolved — open a new one to continue", "টিকিট সমাধান — চালাতে নতুন খুলুন") : tr("Reply to the admin…", "অ্যাডমিনকে উত্তর দিন…")}
                  disabled={selected.status === "resolved"}
                  className="h-9 text-xs"
                />
                <Button size="icon-sm" onClick={send} disabled={selected.status === "resolved" || !reply.trim()} aria-label={tr("Send reply", "উত্তর পাঠান")}>
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="mt-1.5 text-center text-[9px] text-muted-foreground/70">
                {tr("Visible to GameXchange support only. Sellers cannot see or reply here.", "শুধু GameXchange সাপোর্ট দেখেন। বিক্রেতা দেখতে বা উত্তর দিতে পারেন না।")}
              </p>
            </div>
          </div>
        ) : (
          <EmptyState icon={MessageSquare} title={tr("No tickets yet", "এখনো টিকিট নেই")} body={tr("Open a ticket and an admin will reply here.", "একটি টিকিট খুলুন, অ্যাডমিন এখানে উত্তর দেবেন।")} />
        )}
      </div>
    </div>
  );
}

/* ==================================================================== */
/* Wishlist                                                             */
/* ==================================================================== */

export function WishlistSection() {
  const tr = useT();
  const { listings, watchlist } = useAppStore();
  const saved = useMemo(
    () => listings.filter((listing) => watchlist.includes(listing.id)),
    [listings, watchlist],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">
          {saved.length} {tr("saved accounts", "সেভ করা অ্যাকাউন্ট")}
        </p>
        <Button asChild size="sm" variant="secondary">
          <Link href="/marketplace">
            {tr("Browse marketplace", "মার্কেটপ্লেস")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
      {saved.length === 0 ? (
        <EmptyState
          icon={Heart}
          title={tr("Your wishlist is empty", "আপনার উইশলিস্ট খালি")}
          body={tr("Tap the heart on any listing to save it here and track price changes.", "যেকোনো লিস্টিংয়ে হার্ট চাপলে এখানে সেভ হবে এবং দামের পরিবর্তন দেখা যাবে।")}
          actionHref="/marketplace"
          actionLabel={tr("Find your next account", "পরবর্তী অ্যাকাউন্ট খুঁজুন")}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {saved.map((listing, index) => (
            <ListingCard key={listing.id} listing={listing} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ==================================================================== */
/* Wallet                                                               */
/* ==================================================================== */

type Transaction = {
  id: string;
  type: "credit" | "debit";
  label: { en: string; bn: string };
  amount: number;
  at: string;
  method: string;
};

const START_TRANSACTIONS: Transaction[] = [
  { id: "TX-8891", type: "credit", label: { en: "Seller payout · GX-2403", bn: "বিক্রেতা পেআউট · GX-2403" }, amount: 4185, at: "2026-10-28T10:20:00.000Z", method: "bKash" },
  { id: "TX-8874", type: "debit", label: { en: "Withdrawal to bKash", bn: "বিকাশে উত্তোলন" }, amount: 3000, at: "2026-10-26T16:00:00.000Z", method: "bKash" },
  { id: "TX-8860", type: "credit", label: { en: "Refund · cancelled order", bn: "রিফান্ড · বাতিল অর্ডার" }, amount: 1500, at: "2026-10-21T09:10:00.000Z", method: "Wallet" },
];

export function WalletSection() {
  const tr = useT();
  const { user, orders, deposit, withdraw } = useAppStore();
  const [transactions, setTransactions] = useState<Transaction[]>(START_TRANSACTIONS);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [method, setMethod] = useState("bKash");

  if (!user) return null;

  const escrowHeld = orders
    .filter((order) => ["payment_submitted", "payment_confirmed", "delivered"].includes(order.status))
    .reduce((total, order) => total + order.amount, 0);

  function addDeposit(event: React.FormEvent) {
    event.preventDefault();
    const amount = Number(depositAmount);
    if (!amount || amount < 100) {
      toast.error(tr("Minimum deposit is ৳100.", "সর্বনিম্ন ডিপোজিট ৳১০০।"));
      return;
    }
    deposit(amount);
    setTransactions((current) => [
      { id: `TX-${Math.floor(9000 + Math.random() * 900)}`, type: "credit", label: { en: "Wallet top-up", bn: "ওয়ালেট টপ-আপ" }, amount, at: new Date().toISOString(), method },
      ...current,
    ]);
    setDepositAmount("");
    toast.success(tr("Wallet topped up", "ওয়ালেট টপ-আপ হয়েছে"), {
      description: tr("Demo balance only — no real money moved.", "শুধু ডেমো ব্যালেন্স — আসল টাকা নড়েনি।"),
    });
  }

  function requestWithdraw(event: React.FormEvent) {
    event.preventDefault();
    const amount = Number(withdrawAmount);
    const result = withdraw(amount);
    if (!result.ok) {
      toast.error(
        result.error === "min"
          ? tr("Minimum withdrawal is ৳500.", "সর্বনিম্ন উত্তোলন ৳৫০০।")
          : tr("Withdrawal is higher than your balance.", "ব্যালেন্সের চেয়ে বেশি উত্তোলন।"),
      );
      return;
    }
    setTransactions((current) => [
      { id: `TX-${Math.floor(9000 + Math.random() * 900)}`, type: "debit", label: { en: "Withdrawal request", bn: "উত্তোলন অনুরোধ" }, amount, at: new Date().toISOString(), method },
      ...current,
    ]);
    setWithdrawAmount("");
    toast.success(tr("Withdrawal requested", "উত্তোলন অনুরোধ হয়েছে"), {
      description: tr("Admins review payouts within 24 hours.", "অ্যাডমিন ২৪ ঘণ্টায় পেআউট পর্যালোচনা করেন।"),
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard icon={Wallet} label={tr("Available balance", "উপলব্ধ ব্যালেন্স")} value={formatBDT(user.balance)} hint={tr("Ready to withdraw", "উত্তোলনের জন্য প্রস্তুত")} tone="emerald" />
        <StatCard icon={ShieldCheck} label={tr("Held in escrow", "এস্ক্রোতে")} value={formatBDT(escrowHeld)} hint={tr("Across active orders", "সক্রিয় অর্ডারে")} tone="violet" />
        <StatCard icon={CreditCard} label={tr("This month", "এই মাসে")} value={formatBDT(5685)} hint={tr("Demo earnings", "ডেমো আয়")} tone="cyan" />
        <StatCard icon={Landmark} label={tr("Pending payout", "অপেক্ষমাণ পেআউট")} value={formatBDT(0)} hint={tr("No pending requests", "কোনো অনুরোধ নেই")} tone="amber" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={addDeposit} className="glass rounded-2xl p-4">
          <SectionTitle>{tr("Add money", "টাকা যোগ করুন")}</SectionTitle>
          <Label htmlFor="deposit">{tr("Amount (৳)", "পরিমাণ (৳)")}</Label>
          <Input id="deposit" inputMode="numeric" value={depositAmount} onChange={(event) => setDepositAmount(event.target.value.replace(/[^\d]/g, ""))} placeholder="1000" className="mt-1.5" />
          <div className="mt-2 flex gap-1.5">
            {[500, 1000, 2500].map((amount) => (
              <button key={amount} type="button" onClick={() => setDepositAmount(String(amount))} className="flex-1 rounded-lg border border-border py-1.5 text-[10px] text-muted-foreground hover:border-primary/40 hover:text-foreground">
                +{formatBDT(amount)}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">{tr("Method", "মাধ্যম")}</p>
          <div className="mt-1 grid grid-cols-2 gap-1.5">
            {["bKash", "Nagad"].map((option) => (
              <button key={option} type="button" onClick={() => setMethod(option)} aria-pressed={method === option} className={cn("rounded-lg border py-2 text-[10px] font-semibold", method === option ? "border-primary/50 bg-primary/10" : "border-border text-muted-foreground")}>{option}</button>
            ))}
          </div>
          <Button type="submit" size="sm" className="mt-3 w-full">
            <Smartphone className="h-3.5 w-3.5" />
            {tr("Top up wallet", "ওয়ালেট টপ-আপ")}
          </Button>
        </form>

        <form onSubmit={requestWithdraw} className="glass rounded-2xl p-4">
          <SectionTitle>{tr("Withdraw to bKash / Nagad", "বিকাশ / নগদে তুলুন")}</SectionTitle>
          <Label htmlFor="withdraw">{tr("Amount (৳)", "পরিমাণ (৳)")}</Label>
          <Input id="withdraw" inputMode="numeric" value={withdrawAmount} onChange={(event) => setWithdrawAmount(event.target.value.replace(/[^\d]/g, ""))} placeholder="500" className="mt-1.5" />
          <p className="mt-1 text-[10px] text-muted-foreground">{tr("Minimum ৳500 · 24-hour admin review", "সর্বনিম্ন ৳৫০০ · ২৪ ঘণ্টা অ্যাডমিন রিভিউ")}</p>
          <div className="mt-2 flex gap-1.5">
            {[500, 1000, user.balance].filter((amount, index, all) => amount > 0 && all.indexOf(amount) === index).slice(0, 3).map((amount) => (
              <button key={amount} type="button" onClick={() => setWithdrawAmount(String(amount))} className="flex-1 rounded-lg border border-border py-1.5 text-[10px] text-muted-foreground hover:border-primary/40 hover:text-foreground">
                {formatBDT(amount)}
              </button>
            ))}
          </div>
          <Button type="submit" size="sm" variant="secondary" className="mt-3 w-full">
            <Banknote className="h-3.5 w-3.5" />
            {tr("Request withdrawal", "উত্তোলন অনুরোধ")}
          </Button>
          <p className="mt-2 flex items-start gap-1 text-[9px] leading-relaxed text-muted-foreground/80">
            <Info className="mt-0.5 h-2.5 w-2.5 shrink-0" />
            {tr("Demo wallet. Real payouts require verified KYC and are sent by an admin.", "ডেমো ওয়ালেট। আসল পেআউটে ভেরিফাইড KYC লাগে এবং অ্যাডমিন পাঠান।")}
          </p>
        </form>
      </div>

      <div className="glass rounded-2xl">
        <div className="flex items-center justify-between border-b border-border/60 p-4">
          <h2 className="font-display text-sm font-semibold">{tr("Transactions", "লেনদেন")}</h2>
          <Badge variant="outline">{tr("Last 30 days", "গত ৩০ দিন")}</Badge>
        </div>
        <div className="divide-y divide-border/50">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-lg border", tx.type === "credit" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-rose-400/20 bg-rose-400/10 text-rose-300")}>
                {tx.type === "credit" ? <ArrowRight className="h-3.5 w-3.5 -rotate-45" /> : <ArrowRight className="h-3.5 w-3.5 rotate-45" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium">{tr(tx.label.en, tx.label.bn)}</p>
                <p className="text-[9px] text-muted-foreground">{tx.id} · {tx.method} · {timeAgo(tx.at)}</p>
              </div>
              <p className={cn("text-xs font-semibold tabular-nums", tx.type === "credit" ? "text-emerald-300" : "text-rose-300")}>
                {tx.type === "credit" ? "+" : "−"} {formatBDT(tx.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
        <div className="flex items-center gap-2">
          <BadgeCheck className={cn("h-4 w-4", user.kyc === "verified" ? "text-emerald-400" : "text-amber-300")} />
          <div>
            <p className="text-xs font-semibold">{tr("KYC status", "KYC স্ট্যাটাস")}: <span className="capitalize">{user.kyc}</span></p>
            <p className="text-[10px] text-muted-foreground">{tr("Verified accounts withdraw without limits.", "ভেরিফাইড অ্যাকাউন্টে সীমা ছাড়া উত্তোলন।")}</p>
          </div>
        </div>
        <Button asChild size="sm" variant="secondary">
          <Link href="/dashboard/verify">{tr("Manage KYC", "KYC দেখুন")}</Link>
        </Button>
      </div>
    </div>
  );
}

/* ==================================================================== */
/* Verification                                                         */
/* ==================================================================== */

export function VerifySection() {
  const tr = useT();
  const { user, verifyPhone, submitKyc } = useAppStore();
  const [codeSent, setCodeSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [nid, setNid] = useState("");
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [twoFactor, setTwoFactor] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  function sendOtp() {
    setCodeSent(true);
    toast.success(tr("Demo code sent", "ডেমো কোড পাঠানো হয়েছে"), {
      description: tr("Enter any 6 digits to verify.", "যেকোনো ৬ সংখ্যা দিলে ভেরিফাই হবে।"),
    });
  }

  function submitOtp(event: React.FormEvent) {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      toast.error(tr("Enter the 6-digit code.", "৬ সংখ্যার কোড দিন।"));
      return;
    }
    verifyPhone();
    toast.success(tr("Phone verified", "ফোন ভেরিফাইড"), {
      description: tr("Bidding and selling are now unlocked.", "বিড ও বিক্রি চালু হয়েছে।"),
    });
  }

  function submitKycForm(event: React.FormEvent) {
    event.preventDefault();
    if (nid.replace(/\D/g, "").length < 10 || fullName.trim().length < 3) {
      toast.error(tr("Enter your full name and a valid NID number.", "পুরো নাম ও সঠিক NID নম্বর দিন।"));
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      submitKyc();
      setSaving(false);
      toast.success(tr("KYC submitted", "KYC জমা হয়েছে"), {
        description: tr("An admin reviews it within one business day.", "অ্যাডমিন এক কর্মদিবসে পর্যালোচনা করেন।"),
      });
    }, 700);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: tr("Email", "ইমেইল"), done: true, value: user.email },
          { label: tr("Phone", "ফোন"), done: user.phoneVerified, value: user.phone },
          { label: tr("KYC / NID", "KYC / NID"), done: user.kyc === "verified", value: user.kyc === "verified" ? tr("Verified", "ভেরিফাইড") : user.kyc === "pending" ? tr("Under review", "পর্যালোচনায়") : tr("Not submitted", "জমা হয়নি") },
        ].map((item) => (
          <div key={item.label} className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
              {item.done ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <Clock3 className="h-4 w-4 text-amber-300" />}
            </div>
            <p className="mt-1 truncate text-xs font-semibold">{item.value}</p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <div className={cn("h-full rounded-full", item.done ? "w-full bg-emerald-400" : "w-1/3 bg-amber-400")} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-cyan-300" />
            <h2 className="font-display text-sm font-semibold">{tr("Phone verification", "ফোন ভেরিফিকেশন")}</h2>
          </div>
          {user.phoneVerified ? (
            <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-3 text-[11px] text-emerald-200">
              <CheckCircle2 className="mb-1 h-4 w-4" />
              {tr("Your phone is verified. You can bid in auctions and receive payouts.", "আপনার ফোন ভেরিফাইড। নিলামে বিড ও পেআউট নিতে পারবেন।")}
            </div>
          ) : (
            <form onSubmit={submitOtp} className="mt-3">
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                {tr("We send a one-time code to", "আমরা একবার ব্যবহারের কোড পাঠাই")} <span className="font-semibold text-foreground">{user.phone}</span>. {tr("Required before bidding.", "বিডের আগে আবশ্যক।")}
              </p>
              {!codeSent ? (
                <Button type="button" size="sm" className="mt-2" onClick={sendOtp}>
                  <Smartphone className="h-3.5 w-3.5" />
                  {tr("Send code", "কোড পাঠান")}
                </Button>
              ) : (
                <div className="mt-2 flex gap-2">
                  <Input value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" placeholder="123456" className="h-9 max-w-[140px] text-center tracking-[0.3em]" />
                  <Button type="submit" size="sm">{tr("Verify", "ভেরিফাই")}</Button>
                </div>
              )}
            </form>
          )}
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-violet-300" />
            <h2 className="font-display text-sm font-semibold">{tr("Security", "নিরাপত্তা")}</h2>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-border bg-white/[0.02] px-3 py-2.5">
              <div>
                <p className="text-[11px] font-medium">{tr("Two-factor authentication", "দুই-ধাপ প্রমাণীকরণ")}</p>
                <p className="text-[9px] text-muted-foreground">{tr("Authenticator app (TOTP)", "অথেনটিকেটর অ্যাপ (TOTP)")}</p>
              </div>
              <button type="button" onClick={() => { setTwoFactor((value) => !value); toast.success(twoFactor ? tr("2FA disabled", "2FA বন্ধ") : tr("2FA enabled (demo)", "2FA চালু (ডেমো)")); }} aria-pressed={twoFactor} className={cn("relative h-5 w-9 rounded-full transition", twoFactor ? "bg-emerald-500" : "bg-white/15")}>
                <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white transition", twoFactor ? "left-[18px]" : "left-0.5")} />
              </button>
            </div>
            <button type="button" onClick={() => toast.info(tr("Password reset email is a demo action.", "পাসওয়ার্ড রিসেট ইমেইল ডেমো।"))} className="flex w-full items-center justify-between rounded-xl border border-border bg-white/[0.02] px-3 py-2.5 text-left transition hover:border-primary/30">
              <span>
                <span className="block text-[11px] font-medium">{tr("Change password", "পাসওয়ার্ড বদলান")}</span>
                <span className="block text-[9px] text-muted-foreground">{tr("Last changed 3 months ago", "৩ মাস আগে বদলানো")}</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <div className="rounded-xl border border-border bg-white/[0.02] px-3 py-2.5">
              <p className="text-[11px] font-medium">{tr("Active session", "সক্রিয় সেশন")}</p>
              <p className="text-[9px] text-muted-foreground">{tr("This browser · auto-locks after 30 minutes", "এই ব্রাউজার · ৩০ মিনিটে অটো-লক")}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={submitKycForm} className="glass rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-emerald-300" />
            <h2 className="font-display text-sm font-semibold">{tr("Identity verification (KYC)", "পরিচয় যাচাই (KYC)")}</h2>
          </div>
          <Badge variant={user.kyc === "verified" ? "success" : user.kyc === "pending" ? "warning" : "outline"}>
            {user.kyc === "verified" ? tr("Verified", "ভেরিফাইড") : user.kyc === "pending" ? tr("Under review", "পর্যালোচনায়") : tr("Required for payouts", "পেআউটে আবশ্যক")}
          </Badge>
        </div>

        {user.kyc === "pending" || user.kyc === "verified" ? (
          <div className="mt-3 rounded-xl border border-border bg-white/[0.02] p-4 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
            <p className="mt-2 text-xs font-semibold">
              {user.kyc === "verified" ? tr("Identity verified", "পরিচয় যাচাই সম্পন্ন") : tr("Documents submitted", "ডকুমেন্ট জমা হয়েছে")}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {tr("NID and selfie are encrypted and only visible to the KYC team.", "NID ও সেলফি এনক্রিপ্টেড, শুধু KYC টিম দেখেন।")}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="kyc-name">{tr("Full legal name", "পূর্ণ আইনি নাম")}</Label>
                <Input id="kyc-name" value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="kyc-nid">{tr("NID number", "NID নম্বর")}</Label>
                <Input id="kyc-nid" value={nid} onChange={(event) => setNid(event.target.value.replace(/[^\d]/g, "").slice(0, 17))} placeholder="1990123456789" className="mt-1.5" />
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[tr("NID front", "NID সামনে"), tr("NID back", "NID পেছনে")].map((label) => (
                <label key={label} className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-white/[0.02] px-3 py-5 text-center transition hover:border-primary/40">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="mt-1 text-[10px] font-medium text-muted-foreground">{label}</span>
                  <span className="text-[9px] text-muted-foreground/60">{tr("JPG/PNG · max 5 MB", "JPG/PNG · সর্বোচ্চ ৫ MB")}</span>
                  <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={() => toast.info(tr("File selected for demo preview only.", "ফাইল শুধু ডেমো প্রিভিউতে নির্বাচিত।"))} />
                </label>
              ))}
            </div>
            <p className="mt-2 flex items-start gap-1.5 text-[9px] leading-relaxed text-muted-foreground">
              <LockKeyhole className="mt-0.5 h-2.5 w-2.5 shrink-0" />
              {tr("Demo mode does not upload files. In production, documents go to a private encrypted bucket with admin-only RLS.", "ডেমো মোডে ফাইল আপলোড হয় না। প্রোডাকশনে ডকুমেন্ট প্রাইভেট এনক্রিপ্টেড বাকেটে যায়, শুধু অ্যাডমিন দেখেন।")}
            </p>
            <Button type="submit" size="sm" className="mt-3" disabled={saving}>
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileCheck2 className="h-3.5 w-3.5" />}
              {tr("Submit for review", "পর্যালোচনায় জমা")}
            </Button>
          </>
        )}
      </form>
    </div>
  );
}

/* ==================================================================== */
/* Reviews                                                              */
/* ==================================================================== */

const SEED_REVIEWS = [
  { id: "r1", author: "Ayaan R.", rating: 5, role: "buyer" as const, body: "Delivered in 15 minutes and the admin confirmed the email change. Very smooth.", at: "2026-10-27T12:00:00.000Z", listing: "Grandmaster · 12 Mythic Skins" },
  { id: "r2", author: "Farhan K.", rating: 5, role: "buyer" as const, body: "Seller was patient with the recovery-phone removal. Escrow made it stress-free.", at: "2026-10-18T09:00:00.000Z", listing: "Epic Squad · 92 Rated" },
  { id: "r3", author: "Nusrat J.", rating: 5, role: "seller" as const, body: "Payment released quickly after inspection. Clear 7% fee, no surprises.", at: "2026-10-11T17:30:00.000Z", listing: "Legendary Squad · 105 Rated" },
];

export function ReviewsSection() {
  const tr = useT();
  const { orders, user } = useAppStore();
  const [tab, setTab] = useState<"received" | "given">("received");
  const [reviews, setReviews] = useState(SEED_REVIEWS);
  const [orderId, setOrderId] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const completed = orders.filter((order) => order.status === "completed");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!orderId || body.trim().length < 10) {
      toast.error(tr("Choose a completed order and write a short review.", "সম্পন্ন অর্ডার বেছে নিয়ে ছোট রিভিউ লিখুন।"));
      return;
    }
    setReviews((current) => [
      {
        id: `r-${Date.now()}`,
        author: user?.name ?? "You",
        rating,
        role: "buyer",
        body: body.trim(),
        at: new Date().toISOString(),
        listing: completed.find((order) => order.id === orderId)?.title ?? "Completed order",
      },
      ...current,
    ]);
    setBody("");
    setOrderId("");
    toast.success(tr("Review published", "রিভিউ প্রকাশিত"), {
      description: tr("Thanks for helping other traders.", "অন্য ট্রেডারদের সাহায্য করার জন্য ধন্যবাদ।"),
    });
  }

  const average = (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="glass flex flex-wrap items-center gap-4 rounded-2xl p-4">
        <div className="text-center">
          <p className="font-display text-3xl font-bold text-amber-300">{average}</p>
          <div className="mt-1 flex justify-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={cn("h-3 w-3", star <= Math.round(Number(average)) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
            ))}
          </div>
          <p className="mt-1 text-[9px] text-muted-foreground">{reviews.length} {tr("reviews", "রিভিউ")}</p>
        </div>
        <div className="min-w-[160px] flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((review) => review.rating === star).length;
            return (
              <div key={star} className="flex items-center gap-2 text-[9px] text-muted-foreground">
                <span className="w-2">{star}</span>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full bg-amber-400" style={{ width: `${(count / reviews.length) * 100}%` }} />
                </div>
                <span className="w-3 text-right">{count}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-1">
          {(["received", "given"] as const).map((value) => (
            <button key={value} type="button" onClick={() => setTab(value)} aria-pressed={tab === value} className={cn("rounded-lg border px-2.5 py-1.5 text-[10px] font-medium", tab === value ? "border-primary/30 bg-primary/10" : "border-border text-muted-foreground")}>
              {value === "received" ? tr("Received", "প্রাপ্ত") : tr("Given", "দেওয়া")}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        {reviews.map((review) => (
          <article key={review.id} className="glass rounded-2xl p-4">
            <div className="flex items-start gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-gradient text-[10px] font-bold text-white">
                {review.author.slice(0, 2)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="text-xs font-semibold">{review.author}</p>
                  <Badge variant="outline" className="px-1.5 py-0 text-[8px]">{review.role === "buyer" ? tr("Buyer", "ক্রেতা") : tr("Seller", "বিক্রেতা")}</Badge>
                  <Badge variant="success" className="px-1.5 py-0 text-[8px]">{tr("Verified trade", "যাচাইকৃত লেনদেন")}</Badge>
                  <span className="ml-auto text-[9px] text-muted-foreground">{timeAgo(review.at)}</span>
                </div>
                <div className="mt-0.5 flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={cn("h-2.5 w-2.5", star <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/25")} />
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{review.body}</p>
                <p className="mt-1 truncate text-[9px] text-muted-foreground/60">{review.listing}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <form onSubmit={submit} className="glass rounded-2xl p-4">
        <SectionTitle>{tr("Leave a review", "রিভিউ দিন")}</SectionTitle>
        {completed.length === 0 ? (
          <p className="text-[11px] text-muted-foreground">{tr("Complete an order first — only verified trades can be reviewed.", "আগে একটি অর্ডার সম্পন্ন করুন — শুধু যাচাইকৃত লেনদেনের রিভিউ যায়।")}</p>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="review-order">{tr("Completed order", "সম্পন্ন অর্ডার")}</Label>
                <select id="review-order" value={orderId} onChange={(event) => setOrderId(event.target.value)} className="mt-1.5 flex h-11 w-full rounded-xl border border-border bg-white/[0.04] px-3 text-sm text-foreground outline-none">
                  <option value="">{tr("Choose an order", "অর্ডার বেছে নিন")}</option>
                  {completed.map((order) => (
                    <option key={order.id} value={order.id}>{order.id} · {order.title.slice(0, 34)}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>{tr("Rating", "রেটিং")}</Label>
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} aria-label={`${star} stars`} className="p-0.5">
                      <Star className={cn("h-5 w-5 transition", star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30 hover:text-amber-300")} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder={tr("How was the handover and the seller's communication?", "হ্যান্ডওভার ও বিক্রেতার যোগাযোগ কেমন ছিল?")} className="mt-3 min-h-[80px] text-xs" maxLength={500} />
            <Button type="submit" size="sm" className="mt-2">
              <Sparkles className="h-3.5 w-3.5" />
              {tr("Publish review", "রিভিউ প্রকাশ")}
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
