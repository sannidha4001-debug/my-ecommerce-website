"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Gavel,
  Heart,
  Info,
  Loader2,
  LockKeyhole,
  MessageSquareLock,
  Play,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Video,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bidDepositFor, commissionFor } from "@/lib/account";
import { normaliseBid, useAppStore } from "@/lib/store";
import { cn, formatBDT, maskUsername } from "@/lib/utils";

type GalleryView = { id: string; label: { en: string; bn: string }; video?: boolean };

const GALLERY: GalleryView[] = [
  { id: "cover", label: { en: "Cover", bn: "কভার" } },
  { id: "profile", label: { en: "Profile", bn: "প্রোফাইল" } },
  { id: "inventory", label: { en: "Inventory", bn: "ইনভেন্টরি" } },
  { id: "video", label: { en: "Video", bn: "ভিডিও" }, video: true },
];

export function ListingDetail({ listingId }: { listingId: string }) {
  const { dict, isBangla } = useI18n();
  const tr = (en: string, bn: string) => (isBangla ? bn : en);
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const {
    hydrated,
    user,
    getListing,
    bidsFor,
    endsAtFor,
    requestBidDeposit,
    bidDeposits,
    settings,
    makeOffer,
    offers,
    createOrder,
    toggleWatch,
    isWatched,
    openThread,
    listings,
  } = useAppStore();

  const listing = useMemo(() => getListing(listingId), [getListing, listingId]);
  const [gallery, setGallery] = useState(0);
  const [method, setMethod] = useState("bKash");
  const [bidAmount, setBidAmount] = useState("");
  const [bidMethod, setBidMethod] = useState<"bKash" | "Nagad">("bKash");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [depositOpen, setDepositOpen] = useState(false);
  const [buying, setBuying] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpMessage, setHelpMessage] = useState("");

  const bids = listing ? bidsFor(listing.id) : [];
  const endsAt = listing ? endsAtFor(listing.id) : undefined;
  const watched = listing ? isWatched(listing.id) : false;
  const topBid = bids[0]?.amount ?? listing?.price ?? 0;
  const myOffer = listing
    ? offers.find(
        (offer) =>
          offer.listingId === listing.id &&
          offer.buyer === user?.name &&
          offer.status === "pending",
      )
    : undefined;
  // The newest deposit this signed-in member submitted for this auction.
  const myDeposit =
    listing && user
      ? bidDeposits
          .filter(
            (deposit) =>
              deposit.listingId === listing.id && deposit.bidderEmail === user.email,
          )
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
      : undefined;

  // Pre-fill a sensible first bid once we know the highest bid.
  useEffect(() => {
    if (listing?.type === "auction") {
      setBidAmount(String(topBid + 500));
    }
  }, [listing?.id, listing?.type, topBid]);

  if (!hydrated) {
    return (
      <div className="container py-12">
        <div className="glass h-[520px] animate-pulse rounded-3xl" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-display text-5xl font-black text-muted-foreground/30">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold">
          {tr("This listing is no longer available", "এই লিস্টিং আর নেই")}
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {tr(
            "It may have been sold, paused by an admin, or removed by the seller.",
            "এটি বিক্রি হয়েছে, অ্যাডমিন পজ করেছেন, বা বিক্রেতা সরিয়েছেন।",
          )}
        </p>
        <Button asChild className="mt-6">
          <Link href="/marketplace">
            <ArrowLeft className="h-4 w-4" />
            {dict.common.browseMarketplace}
          </Link>
        </Button>
      </div>
    );
  }

  const isAuction = listing.type === "auction";
  const highest = bids[0]?.amount ?? listing.price;
  const minimum = highest + 500;
  const depositPercent = Math.max(0, settings.bidDepositPercent);
  const typedBid = normaliseBid(bidAmount);
  const depositPreview = bidDepositFor(typedBid || minimum, depositPercent);
  const depositNumber = bidMethod === "bKash" ? settings.bkashNumber : settings.nagadNumber;
  const related = listings.filter((item) => item.id !== listing.id && item.game.slug === listing.game.slug).slice(0, 3);

  function requireAuth() {
    if (user) return true;
    toast.info(tr("Sign in to continue securely.", "নিরাপদে এগোতে লগ ইন করুন।"));
    router.push(`/login?next=/listing/${listingId}`);
    return false;
  }

  function openDeposit() {
    if (!listing || !requireAuth()) return;
    const amount = normaliseBid(bidAmount);
    if (amount < minimum) {
      toast.error(
        tr(
          `Minimum bid is ${formatBDT(minimum)}.`,
          `সর্বনিম্ন বিড ${formatBDT(minimum)}।`,
        ),
      );
      return;
    }
    if (user && !user.phoneVerified) {
      toast.info(tr("Verify your phone before paying a deposit.", "ডিপোজিট দেওয়ার আগে ফোন ভেরিফাই করুন।"));
      router.push("/dashboard/verify");
      return;
    }
    setDepositOpen(true);
  }

  function handleDeposit() {
    if (!listing || !requireAuth()) return;
    const amount = normaliseBid(bidAmount);
    const result = requestBidDeposit({
      listing,
      amount,
      method: bidMethod,
      senderNumber,
      transactionId,
    });
    if (!result.ok) {
      const messages: Record<string, [string, string]> = {
        auth: ["Sign in to bid.", "বিড দিতে লগ ইন করুন।"],
        phone: [
          "Verify your phone number before bidding.",
          "বিড করার আগে ফোন নম্বর ভেরিফাই করুন।",
        ],
        low: [`Bid at least ${formatBDT(minimum)}.`, `কমপক্ষে ${formatBDT(minimum)} বিড করুন।`],
        own: ["You cannot bid on your own listing.", "নিজের লিস্টিংয়ে বিড করা যাবে না।"],
        sender: [
          "Enter the bKash/Nagad number you paid from.",
          "যে বিকাশ/নগদ নম্বর থেকে টাকা পাঠিয়েছেন সেটি লিখুন।",
        ],
        trx: [
          "Enter the transaction ID from the payment SMS.",
          "পেমেন্ট SMS-এ থাকা ট্রানজেকশন আইডি লিখুন।",
        ],
        pending: [
          "You already have a deposit waiting for admin confirmation.",
          "আপনার একটি ডিপোজিট ইতিমধ্যে অ্যাডমিন যাচাইয়ের অপেক্ষায় আছে।",
        ],
        trxUsed: [
          "This transaction ID was already submitted. Check the SMS and enter the correct one.",
          "এই ট্রানজেকশন আইডি আগেই জমা হয়েছে। SMS দেখে সঠিক আইডি দিন।",
        ],
      };
      const pair = messages[result.error ?? "low"];
      toast.error(pair ? tr(pair[0], pair[1]) : tr("Could not submit the deposit.", "ডিপোজিট জমা দেওয়া যায়নি।"));
      return;
    }
    setDepositOpen(false);
    setTransactionId("");
    toast.success(tr("Deposit submitted for verification", "ডিপোজিট যাচাইয়ের জন্য জমা হয়েছে"), {
      description: tr(
        "An admin will match your transaction ID. The bid goes live only after approval.",
        "অ্যাডমিন আপনার ট্রানজেকশন আইডি মিলিয়ে দেখবেন। অনুমোদনের পরেই বিড চালু হবে।",
      ),
    });
  }

  function handleBuy() {
    if (!listing || !requireAuth()) return;
    setBuying(true);
    const result = createOrder(listing, method);
    window.setTimeout(() => {
      setBuying(false);
      if (!result.ok) {
        const msg =
          result.error === "own"
            ? tr("You cannot buy your own listing.", "নিজের লিস্টিং কেনা যাবে না।")
            : tr("Could not create the order.", "অর্ডার তৈরি করা যায়নি।");
        toast.error(msg);
        return;
      }
      toast.success(tr("Escrow order created", "এস্ক্রো অর্ডার তৈরি হয়েছে"), {
        description: `${result.orderId} · ${tr("Pay within 12 hours to reserve the account.", "অ্যাকাউন্ট ধরে রাখতে ১২ ঘণ্টার মধ্যে পেমেন্ট করুন।")}`,
      });
      router.push("/dashboard/orders");
    }, 650);
  }

  function handleOffer() {
    if (!listing || !requireAuth()) return;
    const amount = normaliseBid(offerAmount);
    if (amount < listing.price * 0.5) {
      toast.error(
        tr(
          "Offers must be at least 50% of the asking price.",
          "অফার দামের কমপক্ষে ৫০% হতে হবে।",
        ),
      );
      return;
    }
    const result = makeOffer(listing, amount, offerMessage);
    if (!result.ok) {
      toast.error(
        result.error === "pending"
          ? tr("You already have a pending offer.", "আপনার একটি অফার অপেক্ষমাণ আছে।")
          : tr("Could not send the offer.", "অফার পাঠানো যায়নি।"),
      );
      return;
    }
    setOfferOpen(false);
    setOfferMessage("");
    toast.success(tr("Offer sent through the admin desk", "অ্যাডমিন ডেস্কে অফার পাঠানো হয়েছে"), {
      description: tr(
        "The seller cannot reply privately. An admin will relay the answer.",
        "বিক্রেতা সরাসরি উত্তর দিতে পারবেন না। অ্যাডমিন উত্তর পৌঁছে দেবেন।",
      ),
    });
  }

  function handleHelp() {
    if (!listing || !requireAuth()) return;
    if (helpMessage.trim().length < 12) {
      toast.error(tr("Write a little more detail.", "একটু বেশি বিস্তারিত লিখুন।"));
      return;
    }
    const id = openThread({
      subject: `Question about ${listing.id}`,
      topic: "other",
      context: `${listing.title} · ${formatBDT(listing.price)} · seller ${listing.seller.username}`,
      message: helpMessage,
      listingId: listing.id,
    });
    setHelpOpen(false);
    setHelpMessage("");
    toast.success(tr("Admin ticket opened", "অ্যাডমিন টিকিট খোলা হয়েছে"), {
      description: `${id} · ${tr("Reply inside the dashboard. Never share passwords.", "ড্যাশবোর্ডে উত্তর দিন। পাসওয়ার্ড শেয়ার করবেন না।")}`,
    });
    router.push("/dashboard/support");
  }

  return (
    <div className="pb-20">
      {/* breadcrumb + title */}
      <section className="border-b border-border/60 bg-gradient-to-b from-violet-500/[0.06] to-transparent">
        <div className="container py-6">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
            <Link href="/" className="hover:text-foreground">{dict.nav.home}</Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <Link href="/marketplace" className="hover:text-foreground">{dict.nav.marketplace}</Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span className="text-foreground/80">{listing.game.name}</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={isAuction ? "live" : "secondary"}>
                  {isAuction ? dict.common.liveAuction : dict.common.fixedPrice}
                </Badge>
                {listing.featured && <Badge variant="gradient">{dict.common.featured}</Badge>}
                <span className="text-[10px] text-muted-foreground">{listing.id.toUpperCase()} · {listing.createdAt}</span>
              </div>
              <h1 className="mt-2 max-w-3xl font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
                {listing.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Tag className="h-3 w-3" />{listing.platform}</span>
                <span className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{listing.seller.rating.toFixed(1)} · {listing.seller.deals} {tr("deals", "ডিল")}</span>
                <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-emerald-400" />{tr("Escrow protected", "এস্ক্রো সুরক্ষিত")}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                toggleWatch(listing.id);
                toast.success(
                  watched
                    ? tr("Removed from wishlist", "উইশলিস্ট থেকে সরানো হয়েছে")
                    : tr("Saved to wishlist", "উইশলিস্টে সেভ হয়েছে"),
                );
              }}
              aria-pressed={watched}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition",
                watched
                  ? "border-rose-400/40 bg-rose-500/15 text-rose-300"
                  : "border-border bg-white/[0.03] text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              <Heart className={cn("h-3.5 w-3.5", watched && "fill-current")} />
              {watched ? dict.common.watching : dict.common.watch}
            </button>
          </div>
        </div>
      </section>

      <div className="container mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* ------------------------------- left ------------------------------ */}
        <div className="min-w-0 space-y-5">
          <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="glass overflow-hidden rounded-2xl"
          >
            <div className="relative aspect-[16/9] bg-black/20">
              <GameArtwork
                game={listing.game}
                index={gallery}
                label={GALLERY[gallery]?.label[isBangla ? "bn" : "en"]}
                className="h-full w-full"
              />
              {GALLERY[gallery]?.video ? (
                <div className="absolute inset-0 grid place-items-center bg-black/35">
                  <div className="text-center">
                    <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md">
                      <Play className="h-6 w-6 fill-white text-white" aria-hidden />
                    </span>
                    <p className="mt-3 text-xs font-semibold text-white">
                      {tr("Seller video walkthrough", "বিক্রেতার ভিডিও ওয়াকথ্রু")}
                    </p>
                    <p className="text-[10px] text-white/70">
                      {tr("Private video · 0:48 · demo preview", "প্রাইভেট ভিডিও · ০:৪৮ · ডেমো প্রিভিউ")}
                    </p>
                  </div>
                </div>
              ) : (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 text-[10px] text-white backdrop-blur">
                  <LockKeyhole className="h-3 w-3" />
                  {tr("Watermarked preview", "ওয়াটারমার্ক প্রিভিউ")}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-border/60 p-3">
              {GALLERY.map((view, index) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setGallery(index)}
                  aria-pressed={gallery === index}
                  className={cn(
                    "relative h-14 w-20 overflow-hidden rounded-lg border text-[9px] font-semibold text-white transition",
                    gallery === index ? "border-primary ring-2 ring-primary/30" : "border-border opacity-70 hover:opacity-100",
                  )}
                >
                  <GameArtwork game={listing.game} index={index} className="h-full w-full" />
                  {view.video && (
                    <span className="absolute inset-0 grid place-items-center bg-black/45">
                      <Video className="h-4 w-4" aria-hidden />
                    </span>
                  )}
                </button>
              ))}
              <p className="ml-auto max-w-[200px] text-right text-[10px] leading-relaxed text-muted-foreground">
                {tr(
                  "Screenshots are watermarked. The full album unlocks after payment confirmation.",
                  "স্ক্রিনশটে ওয়াটারমার্ক আছে। পেমেন্ট নিশ্চিত হলে পুরো অ্যালবাম খুলবে।",
                )}
              </p>
            </div>
          </motion.section>

          {/* description */}
          <section className="glass rounded-2xl p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold">{tr("Account details", "অ্যাকাউন্টের বিবরণ")}</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {listing.description}
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: tr("Level", "লেভেল"), value: String(listing.level) },
                { label: tr("Rank", "র‍্যাংক"), value: listing.rank },
                { label: tr("Platform", "প্ল্যাটফর্ম"), value: listing.platform },
                { label: tr("Server", "সার্ভার"), value: listing.game.name },
              ].map((spec) => (
                <div key={spec.label} className="rounded-xl border border-border bg-white/[0.02] p-3">
                  <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{spec.label}</dt>
                  <dd className="mt-1 truncate text-xs font-semibold">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {listing.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </section>

          {/* inspection timeline */}
          <section className="glass rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-cyan-300" aria-hidden />
              <h2 className="font-display text-lg font-semibold">{tr("How your protection works", "আপনার সুরক্ষা যেভাবে কাজ করে")}</h2>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                [tr("1. Payment held", "১. পেমেন্ট আটকে রাখা"), tr("Your money is held by GameXchange, not the seller.", "আপনার টাকা বিক্রেতার কাছে নয়, GameXchange-এ থাকে।")],
                [tr("2. Credentials delivered", "২. তথ্য হস্তান্তর"), tr("The seller hands over through an admin-monitored order.", "বিক্রেতা অ্যাডমিন-নজরদারি অর্ডারে তথ্য দেন।")],
                [tr("3. 48-hour inspection", "৩. ৪৮ ঘণ্টা যাচাই"), tr("Change email, phone and password before releasing.", "টাকা ছাড়ার আগে ইমেইল, ফোন ও পাসওয়ার্ড বদলান।")],
                [tr("4. Dispute if needed", "৪. প্রয়োজনে বিরোধ"), tr("Admin reviews evidence and can refund you.", "অ্যাডমিন প্রমাণ দেখে টাকা ফেরত দিতে পারেন।")],
              ].map(([title, body]) => (
                <div key={title} className="rounded-xl border border-border/70 bg-white/[0.02] p-3.5">
                  <p className="text-xs font-semibold">{title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-start gap-1.5 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] px-3 py-2 text-[10px] leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 h-3 w-3 shrink-0 text-amber-300" aria-hidden />
              {tr(
                "Never share your game password, OTP or recovery code in any chat. GameXchange staff will never ask for them.",
                "কোনো চ্যাটে গেম পাসওয়ার্ড, OTP বা রিকভারি কোড শেয়ার করবেন না। GameXchange কখনো এগুলো চাইবে না।",
              )}
            </p>
          </section>

          {/* related */}
          {related.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">{tr("More in", "আরও দেখুন")} {listing.game.name}</h2>
                <Link href={`/marketplace?game=${listing.game.slug}`} className="text-[11px] font-medium text-primary hover:underline">
                  {dict.common.viewAll}
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item, index) => (
                  <ListingCard key={item.id} listing={item} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ------------------------------- right ----------------------------- */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="gradient-border glass-strong rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {isAuction ? dict.common.currentBid : dict.common.fixedPrice}
            </p>
            <div className="mt-1 flex items-end justify-between gap-2">
              <p className="font-display text-3xl font-bold tabular-nums">{formatBDT(isAuction ? highest : listing.price)}</p>
              {listing.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">{formatBDT(listing.originalPrice)}</span>
              )}
            </div>

            {isAuction && (
              <div className="mt-2 flex items-center justify-between rounded-lg border border-rose-400/20 bg-rose-500/[0.06] px-2.5 py-1.5 text-[11px]">
                <span className="inline-flex items-center gap-1 text-rose-200"><Gavel className="h-3 w-3" />{tr("Auction ends in", "নিলাম শেষ হবে")}</span>
                <Countdown endsAt={endsAt} live showIcon={false} className="text-rose-200" />
              </div>
            )}

            <div className="mt-4 space-y-2">
              {isAuction ? (
                <>
                  {myDeposit && (
                    <div
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-[10px] leading-relaxed",
                        myDeposit.status === "pending" &&
                          "border-amber-400/25 bg-amber-400/[0.07] text-amber-200",
                        myDeposit.status === "confirmed" &&
                          "border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-200",
                        myDeposit.status === "rejected" &&
                          "border-rose-400/25 bg-rose-400/[0.07] text-rose-200",
                        myDeposit.status === "refunded" &&
                          "border-border bg-white/[0.03] text-muted-foreground",
                      )}
                    >
                      <p className="font-semibold">
                        {myDeposit.status === "pending" &&
                          tr("Deposit awaiting admin confirmation", "ডিপোজিট অ্যাডমিন নিশ্চিতকরণের অপেক্ষায়")}
                        {myDeposit.status === "confirmed" &&
                          tr("Deposit confirmed — your bid is live", "ডিপোজিট নিশ্চিত — আপনার বিড চালু")}
                        {myDeposit.status === "rejected" &&
                          tr("Deposit rejected — please retry", "ডিপোজিট প্রত্যাখ্যাত — আবার চেষ্টা করুন")}
                        {myDeposit.status === "refunded" &&
                          tr("Deposit refunded", "ডিপোজিট ফেরত দেওয়া হয়েছে")}
                      </p>
                      <p className="mt-0.5">
                        {myDeposit.method} · {formatBDT(myDeposit.deposit)} · TrxID {myDeposit.transactionId} · {tr("bid", "বিড")} {formatBDT(myDeposit.amount)}
                      </p>
                      {myDeposit.status === "pending" && (
                        <p className="mt-0.5 text-amber-200/80">
                          {tr(
                            "The bid is placed automatically once an admin matches your transaction ID.",
                            "অ্যাডমিন ট্রানজেকশন আইডি মিলালেই বিড স্বয়ংক্রিয়ভাবে বসে যাবে।",
                          )}
                        </p>
                      )}
                    </div>
                  )}

                  {myDeposit?.status !== "pending" && (
                    <>
                      <Label htmlFor="bid">{tr("Your bid", "আপনার বিড")}</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">৳</span>
                        <Input
                          id="bid"
                          inputMode="numeric"
                          value={bidAmount}
                          onChange={(event) => setBidAmount(event.target.value.replace(/[^\d]/g, ""))}
                          className="pl-7 text-base font-semibold"
                        />
                      </div>
                      <div className="flex gap-1.5">
                        {[500, 1000, 2500].map((step) => (
                          <button
                            key={step}
                            type="button"
                            onClick={() => setBidAmount(String(normaliseBid(bidAmount) + step))}
                            className="flex-1 rounded-lg border border-border py-1.5 text-[10px] font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                          >
                            +{formatBDT(step)}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {tr("Minimum bid", "সর্বনিম্ন বিড")}: {formatBDT(minimum)} · {Math.max(listing.bids, bids.length)} {dict.common.bids}
                      </p>

                      <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.05] px-3 py-2 text-[10px] leading-relaxed">
                        <p className="flex items-center justify-between gap-2 font-semibold text-cyan-200">
                          <span>{tr(`${depositPercent}% bid deposit`, `${depositPercent}% বিড ডিপোজিট`)}</span>
                          <span className="tabular-nums">{formatBDT(depositPreview)}</span>
                        </p>
                        <p className="mt-0.5 text-muted-foreground">
                          {tr(
                            `Send ${formatBDT(depositPreview)} by ${bidMethod} to the admin number, then enter your sender number and transaction ID. Refundable if you do not win.`,
                            `${formatBDT(depositPreview)} ${bidMethod}-এ অ্যাডমিন নম্বরে পাঠিয়ে প্রেরকের নম্বর ও ট্রানজেকশন আইডি দিন। না জিতলে ফেরতযোগ্য।`,
                          )}
                        </p>
                      </div>

                      <Button onClick={openDeposit} className="w-full">
                        <Gavel className="h-4 w-4" />
                        {depositOpen
                          ? tr("Enter payment details below", "নিচে পেমেন্টের তথ্য দিন")
                          : tr(`Continue with ${depositPercent}% deposit`, `${depositPercent}% ডিপোজিট দিয়ে এগোন`)}
                      </Button>

                      {depositOpen && (
                        <motion.div
                          initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="overflow-hidden rounded-xl border border-border bg-white/[0.02] p-3"
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {tr("Admin payment numbers", "অ্যাডমিন পেমেন্ট নম্বর")}
                          </p>
                          <div className="mt-2 grid grid-cols-2 gap-1.5">
                            {(["bKash", "Nagad"] as const).map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setBidMethod(option)}
                                aria-pressed={bidMethod === option}
                                className={cn(
                                  "rounded-lg border px-2 py-2 text-left text-[10px] transition",
                                  bidMethod === option
                                    ? "border-primary/50 bg-primary/10 text-foreground"
                                    : "border-border text-muted-foreground hover:border-primary/30",
                                )}
                              >
                                <span className="block font-semibold">{option}</span>
                                <span className="mt-0.5 block tabular-nums text-[9px]">
                                  {option === "bKash" ? settings.bkashNumber : settings.nagadNumber}
                                </span>
                              </button>
                            ))}
                          </div>
                          <p className="mt-2 rounded-lg bg-black/25 px-2.5 py-2 text-[10px] font-semibold tabular-nums text-cyan-200">
                            {tr("Send exactly", "ঠিক এই পরিমাণ পাঠান")}: {formatBDT(depositPreview)} → {depositNumber}
                          </p>
                          <Label htmlFor="sender" className="mt-2 block text-[10px]">
                            {tr("Your bKash/Nagad number", "আপনার বিকাশ/নগদ নম্বর")}
                          </Label>
                          <Input
                            id="sender"
                            inputMode="tel"
                            value={senderNumber}
                            onChange={(event) => setSenderNumber(event.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="mt-1 h-9 text-xs"
                          />
                          <Label htmlFor="trx" className="mt-2 block text-[10px]">
                            {tr("Transaction ID (TrxID)", "ট্রানজেকশন আইডি (TrxID)")}
                          </Label>
                          <Input
                            id="trx"
                            value={transactionId}
                            onChange={(event) => setTransactionId(event.target.value.toUpperCase())}
                            placeholder="BK9F2K1LQ7"
                            className="mt-1 h-9 text-xs tracking-wider"
                            maxLength={24}
                          />
                          <Button onClick={handleDeposit} size="sm" className="mt-2 w-full">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {tr("Submit deposit for admin check", "অ্যাডমিন যাচাইয়ে ডিপোজিট জমা দিন")}
                          </Button>
                          <p className="mt-1.5 text-center text-[9px] leading-relaxed text-muted-foreground">
                            {tr(
                              "Your bid appears on the auction only after an admin confirms the TrxID.",
                              "অ্যাডমিন TrxID নিশ্চিত করার পরেই আপনার বিড নিলামে দেখা যাবে।",
                            )}
                          </p>
                        </motion.div>
                      )}

                      {user && !user.phoneVerified && (
                        <Link href="/dashboard/verify" className="block text-center text-[10px] text-amber-300 hover:underline">
                          {tr("Verify your phone to unlock bidding", "বিড শুরু করতে ফোন ভেরিফাই করুন")}
                        </Link>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <Label>{tr("Pay with", "পেমেন্ট মাধ্যম")}</Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["bKash", "Nagad", "Wallet"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setMethod(option)}
                        aria-pressed={method === option}
                        className={cn(
                          "rounded-lg border py-2 text-[10px] font-semibold transition",
                          method === option
                            ? "border-primary/50 bg-primary/10 text-foreground"
                            : "border-border text-muted-foreground hover:border-primary/30",
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <Button onClick={handleBuy} disabled={buying} className="w-full">
                    {buying ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
                    {tr("Buy with escrow", "এস্ক্রো দিয়ে কিনুন")}
                  </Button>
                  {myOffer ? (
                    <div className="rounded-lg border border-amber-400/25 bg-amber-400/[0.07] px-2.5 py-2 text-[10px] text-amber-200">
                      {tr("Offer pending", "অফার অপেক্ষমাণ")}: {formatBDT(myOffer.amount)}
                    </div>
                  ) : (
                    <Button variant="secondary" onClick={() => setOfferOpen((value) => !value)} className="w-full">
                      <Tag className="h-3.5 w-3.5" />
                      {tr("Make a price offer", "দামের অফার দিন")}
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* offer form */}
            {offerOpen && !isAuction && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 overflow-hidden border-t border-border/60 pt-4"
              >
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  {tr(
                    "Offers go to the seller through an admin. The seller cannot message you directly.",
                    "অফার অ্যাডমিনের মাধ্যমে বিক্রেতার কাছে যায়। বিক্রেতা সরাসরি মেসেজ করতে পারবেন না।",
                  )}
                </p>
                <Input
                  inputMode="numeric"
                  value={offerAmount}
                  onChange={(event) => setOfferAmount(event.target.value.replace(/[^\d]/g, ""))}
                  placeholder={tr("Your offer (৳)", "আপনার অফার (৳)")}
                  className="mt-2 h-9 text-xs"
                />
                <Textarea
                  value={offerMessage}
                  onChange={(event) => setOfferMessage(event.target.value)}
                  placeholder={tr("Optional note for the seller…", "বিক্রেতার জন্য ঐচ্ছিক নোট…")}
                  className="mt-2 min-h-[64px] text-xs"
                  maxLength={240}
                />
                <Button onClick={handleOffer} size="sm" className="mt-2 w-full">
                  {tr("Send offer", "অফার পাঠান")}
                </Button>
              </motion.div>
            )}

            <div className="mt-4 space-y-2 border-t border-border/60 pt-3 text-[10px] text-muted-foreground">
              <p className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3 text-emerald-400" />{tr("Money held until you approve", "আপনি অনুমোদন না করা পর্যন্ত টাকা আটকে থাকে")}</p>
              <p className="flex items-center gap-1.5"><Clock3 className="h-3 w-3 text-cyan-400" />{tr("48-hour inspection window", "৪৮ ঘণ্টা যাচাইয়ের সময়")}</p>
              {isAuction && (
                <p className="flex items-center gap-1.5"><Wallet className="h-3 w-3 text-amber-400" />{tr(`${depositPercent}% refundable bid deposit, admin-verified`, `${depositPercent}% ফেরতযোগ্য বিড ডিপোজিট, অ্যাডমিন যাচাইকৃত`)}</p>
              )}
              <p className="flex items-center gap-1.5"><MessageSquareLock className="h-3 w-3 text-violet-400" />{tr("All messages are admin-mediated", "সব মেসেজ অ্যাডমিন-মধ্যস্থিত")}</p>
            </div>
          </div>

          {/* seller card: no contact */}
          <div className="glass rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{tr("Seller", "বিক্রেতা")}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-gradient text-[11px] font-bold uppercase text-white">
                {listing.seller.username.slice(0, 2)}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1 truncate text-sm font-semibold">
                  {listing.seller.username}
                  {listing.seller.verified && <BadgeCheck className="h-3.5 w-3.5 text-cyan-400" aria-label={dict.common.verifiedSeller} />}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {listing.seller.rating.toFixed(1)} ★ · {listing.seller.deals} {tr("deals", "ডিল")} · {tr("since", "থেকে")} {listing.seller.joined}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-start gap-1.5 rounded-xl border border-violet-400/15 bg-violet-400/[0.05] px-3 py-2 text-[10px] leading-relaxed text-muted-foreground">
              <LockKeyhole className="mt-0.5 h-3 w-3 shrink-0 text-violet-300" aria-hidden />
              {tr(
                "Direct contact is disabled for your safety. An admin relays every message and offer.",
                "আপনার নিরাপত্তায় সরাসরি যোগাযোগ বন্ধ। প্রতিটি মেসেজ ও অফার অ্যাডমিন পৌঁছে দেন।",
              )}
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3 w-full"
              onClick={() => setHelpOpen((value) => !value)}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {tr("Ask an admin about this listing", "এই লিস্টিং নিয়ে অ্যাডমিনকে জিজ্ঞাসা করুন")}
            </Button>
            {helpOpen && (
              <div className="mt-3 border-t border-border/60 pt-3">
                <Textarea
                  value={helpMessage}
                  onChange={(event) => setHelpMessage(event.target.value)}
                  placeholder={tr(
                    "What do you need checked? Never include passwords or OTPs.",
                    "কী যাচাই করতে চান? পাসওয়ার্ড বা OTP লিখবেন না।",
                  )}
                  className="min-h-[80px] text-xs"
                  maxLength={500}
                />
                <Button size="sm" onClick={handleHelp} className="mt-2 w-full">
                  {tr("Open support ticket", "সাপোর্ট টিকিট খুলুন")}
                </Button>
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-5">
            <p className="flex items-center gap-1.5 text-xs font-semibold">
              <Wallet className="h-3.5 w-3.5 text-cyan-300" />
              {tr("Payout after sale", "বিক্রির পর পেআউট")}
            </p>
            <div className="mt-2 space-y-1 text-[10px] text-muted-foreground">
              <p className="flex justify-between"><span>{tr("Buyer pays", "ক্রেতা দেন")}</span><span className="tabular-nums">{formatBDT(listing.price)}</span></p>
              <p className="flex justify-between"><span>{tr("Commission (7%, min ৳50)", "কমিশন (৭%, সর্বনিম্ন ৳৫০)")}</span><span className="tabular-nums">− {formatBDT(commissionFor(listing.price).fee)}</span></p>
              <p className="flex justify-between border-t border-border/60 pt-1 font-semibold text-foreground"><span>{tr("Seller receives", "বিক্রেতা পান")}</span><span className="tabular-nums">{formatBDT(commissionFor(listing.price).payout)}</span></p>
            </div>
          </div>
        </aside>
      </div>

      {/* bid history (masked) */}
      {isAuction && (
        <div className="container mt-6">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-semibold">{tr("Bid history", "বিড হিস্ট্রি")}</h2>
              <Badge variant="outline">{tr("Masked identities", "গোপন পরিচয়")}</Badge>
            </div>
            <div className="mt-3 divide-y divide-border/60">
              {bids.length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground">{tr("No bids yet. Be the first.", "এখনো কোনো বিড নেই। প্রথম হোন।")}</p>
              )}
              {bids.slice(0, 6).map((bid, index) => (
                <div key={bid.id} className="flex items-center justify-between py-2 text-xs">
                  <span className="inline-flex items-center gap-2">
                    <span className={cn("grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold", index === 0 ? "bg-emerald-400/15 text-emerald-300" : "bg-white/5 text-muted-foreground")}>
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{maskUsername(bid.bidder)}</span>
                    {index === 0 && <Badge variant="success" className="px-1.5 py-0 text-[9px]">{tr("Top", "শীর্ষ")}</Badge>}
                  </span>
                  <span className="tabular-nums font-semibold">{formatBDT(bid.amount)}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              {tr("Bids are atomic and verified server-side in production.", "প্রোডাকশনে বিড সার্ভার-সাইডে যাচাই হয়।")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
