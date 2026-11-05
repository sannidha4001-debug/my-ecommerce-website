"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Info,
  Loader2,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";
import { MediaUploader, type MediaValue } from "@/components/sell/media-uploader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { commissionFor } from "@/lib/account";
import { games, type Game } from "@/lib/demo-data";
import { useAppStore } from "@/lib/store";
import { cn, formatBDT } from "@/lib/utils";

export function SellForm() {
  const { dict, isBangla } = useI18n();
  const t = dict.sellPage;
  const tr = (en: string, bn: string) => (isBangla ? bn : en);
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { user, addListing } = useAppStore();

  const [game, setGame] = useState<Game>(games[0]);
  const [type, setType] = useState<"fixed" | "auction">("fixed");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [buyNow, setBuyNow] = useState("");
  const [level, setLevel] = useState("");
  const [rank, setRank] = useState("");
  const [platform, setPlatform] = useState("");
  const [tags, setTags] = useState("");
  const [media, setMedia] = useState<MediaValue>({ images: [], video: null });
  const [ownership, setOwnership] = useState(false);
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);

  const numericPrice = Number(price.replace(/[^\d]/g, "")) || 0;
  const fee = useMemo(() => commissionFor(numericPrice), [numericPrice]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    if (!title.trim() || numericPrice < 500 || !description.trim()) {
      toast.error(
        tr(
          "Add a title, a description and a price of at least ৳500.",
          "শিরোনাম, বিবরণ এবং কমপক্ষে ৳৫০০ দাম দিন।",
        ),
      );
      return;
    }
    if (media.images.length === 0) {
      toast.error(tr("Add at least one screenshot.", "অন্তত একটি স্ক্রিনশট যোগ করুন।"));
      return;
    }
    if (!ownership || !terms) {
      toast.error(t.requiredFields);
      return;
    }
    if (!user) {
      toast.info(
        tr("Sign in to publish your listing.", "লিস্টিং প্রকাশ করতে লগ ইন করুন।"),
      );
      router.push("/login?next=/sell");
      return;
    }

    setBusy(true);
    const id = addListing({
      title: title.trim(),
      game,
      type,
      price: numericPrice,
      level: Number(level) || 1,
      rank: rank.trim(),
      platform: platform.trim(),
      description: description.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });

    window.setTimeout(() => {
      setBusy(false);
      toast.success(t.submittedTitle, {
        description: tr(
          "Your listing is live in the marketplace. An admin review is queued.",
          "আপনার লিস্টিং মার্কেটপ্লেসে লাইভ। অ্যাডমিন রিভিউ অপেক্ষমাণ।",
        ),
      });
      router.push(`/listing/${id}`);
    }, 650);
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
    >
      <div className="space-y-5">
        {/* ------------------------------ game ------------------------------ */}
        <section className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-semibold">{dict.sellPage.gameLabel}</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {tr("Pick the game this account belongs to.", "এই অ্যাকাউন্টটি যে গেমের, সেটি বেছে নিন।")}
              </p>
            </div>
            <Badge variant="outline">{tr("Step 1", "ধাপ ১")}</Badge>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {games.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setGame(item)}
                aria-pressed={game.slug === item.slug}
                className={cn(
                  "group relative overflow-hidden rounded-xl border px-3 py-3 text-left transition-all duration-300",
                  game.slug === item.slug
                    ? "border-primary/60 bg-primary/10 shadow-glow"
                    : "border-border bg-white/[0.02] hover:border-primary/30",
                )}
              >
                <span
                  className={cn("mb-2 block h-1.5 w-8 rounded-full bg-gradient-to-r", item.gradient)}
                  aria-hidden
                />
                <span className="block text-[11px] font-semibold leading-tight">{item.name}</span>
                <span className="mt-0.5 block text-[9px] text-muted-foreground">
                  {item.listings.toLocaleString("en-BD")} {tr("live", "লাইভ")}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ----------------------------- details ---------------------------- */}
        <section className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-semibold">{t.formTitle}</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{t.formSubtitle}</p>
            </div>
            <Badge variant="outline">{tr("Step 2", "ধাপ ২")}</Badge>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <Label>{t.typeLabel}</Label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {(["fixed", "auction"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setType(value)}
                    aria-pressed={type === value}
                    className={cn(
                      "rounded-xl border px-3 py-3 text-left transition",
                      type === value
                        ? "border-primary/50 bg-primary/10"
                        : "border-border bg-white/[0.02] hover:border-primary/30",
                    )}
                  >
                    <span className="flex items-center gap-2 text-xs font-semibold">
                      {value === "fixed" ? <Wallet className="h-3.5 w-3.5 text-cyan-300" /> : <Sparkles className="h-3.5 w-3.5 text-amber-300" />}
                      {value === "fixed" ? t.typeFixed : t.typeAuction}
                    </span>
                    <span className="mt-1 block text-[10px] text-muted-foreground">
                      {value === "fixed" ? t.typeFixedHint : t.typeAuctionHint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="listing-title">{t.titleLabel}</Label>
              <Input
                id="listing-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={t.titlePlaceholder}
                maxLength={90}
                className="mt-1.5"
              />
              <p className="mt-1 text-right text-[10px] text-muted-foreground">{title.length}/90</p>
            </div>

            <div>
              <Label htmlFor="listing-description">{t.descriptionLabel}</Label>
              <Textarea
                id="listing-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={t.descriptionPlaceholder}
                maxLength={1200}
                className="mt-1.5 min-h-[130px]"
              />
              <p className="mt-1 text-right text-[10px] text-muted-foreground">{description.length}/1200</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label htmlFor="level">{t.levelLabel}</Label>
                <Input
                  id="level"
                  inputMode="numeric"
                  value={level}
                  onChange={(event) => setLevel(event.target.value.replace(/[^\d]/g, ""))}
                  placeholder="78"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="rank">{t.rankLabel}</Label>
                <Input
                  id="rank"
                  value={rank}
                  onChange={(event) => setRank(event.target.value)}
                  placeholder="Grandmaster"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="platform">{t.platformLabel}</Label>
                <Input
                  id="platform"
                  value={platform}
                  onChange={(event) => setPlatform(event.target.value)}
                  placeholder="Android · Asia"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="price">
                  {type === "auction" ? t.startingBidLabel : t.priceLabel}
                </Label>
                <Input
                  id="price"
                  inputMode="numeric"
                  value={price}
                  onChange={(event) => setPrice(event.target.value.replace(/[^\d]/g, ""))}
                  placeholder="12500"
                  className="mt-1.5"
                />
              </div>
              {type === "auction" && (
                <div>
                  <Label htmlFor="buy-now">{t.buyNowLabel}</Label>
                  <Input
                    id="buy-now"
                    inputMode="numeric"
                    value={buyNow}
                    onChange={(event) => setBuyNow(event.target.value.replace(/[^\d]/g, ""))}
                    placeholder="18000"
                    className="mt-1.5"
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="tags">
                {tr("Highlights (comma separated)", "বৈশিষ্ট্য (কমা দিয়ে আলাদা করুন)")}
              </Label>
              <Input
                id="tags"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder="12 Mythic, Full access, Asia server"
                className="mt-1.5"
              />
            </div>
          </div>
        </section>

        {/* ------------------------------ media ----------------------------- */}
        <section className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-semibold">{t.detailsTitle}</h2>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{t.detailsSubtitle}</p>
            </div>
            <Badge variant="outline">{tr("Step 3", "ধাপ ৩")}</Badge>
          </div>
          <div className="mt-4">
            <MediaUploader onChange={setMedia} />
          </div>
        </section>

        {/* ---------------------------- confirm ----------------------------- */}
        <section className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden />
            <h2 className="font-display text-base font-semibold">
              {tr("Ownership & terms", "মালিকানা ও শর্তাবলি")}
            </h2>
          </div>
          <div className="mt-3 space-y-2.5">
            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-white/[0.02] p-3 text-[11px] leading-relaxed text-muted-foreground">
              <input
                type="checkbox"
                checked={ownership}
                onChange={(event) => setOwnership(event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-violet-500"
              />
              {t.confirmOwnership}
            </label>
            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-white/[0.02] p-3 text-[11px] leading-relaxed text-muted-foreground">
              <input
                type="checkbox"
                checked={terms}
                onChange={(event) => setTerms(event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-violet-500"
              />
              {t.confirmTerms}
            </label>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] text-muted-foreground">
              {tr("Listings are reviewed by an admin before they are featured.", "ফিচার হওয়ার আগে অ্যাডমিন লিস্টিং পর্যালোচনা করেন।")}
            </p>
            <Button type="submit" disabled={busy} className="shrink-0">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {busy ? t.submitting : t.submit}
            </Button>
          </div>
        </section>
      </div>

      {/* ----------------------------- sidebar ----------------------------- */}
      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="gradient-border glass-strong rounded-2xl p-5">
          <h2 className="font-display text-sm font-semibold">{t.feeTitle}</h2>
          <dl className="mt-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">{t.feeSalePrice}</dt>
              <dd className="font-semibold tabular-nums">
                {numericPrice > 0 ? formatBDT(numericPrice) : "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">{t.feeCommission}</dt>
              <dd className="tabular-nums text-rose-300">
                {numericPrice > 0 ? `− ${formatBDT(fee.fee)}` : "—"}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-border/60 pt-2.5">
              <dt className="font-semibold">{t.feeYouReceive}</dt>
              <dd className="font-display text-lg font-bold text-emerald-300 tabular-nums">
                {numericPrice > 0 ? formatBDT(fee.payout) : "—"}
              </dd>
            </div>
          </dl>
          <p className="mt-3 flex items-start gap-1.5 rounded-lg border border-sky-400/15 bg-sky-400/[0.05] px-2.5 py-2 text-[10px] leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-3 w-3 shrink-0 text-sky-300" aria-hidden />
            {t.feeNote}
          </p>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="font-display text-sm font-semibold">{t.stepsTitle}</h2>
          <ol className="mt-3 space-y-2.5">
            {[t.step1, t.step2, t.step3, t.step4].map((step, index) => (
              <li key={step} className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-primary/25 bg-primary/10 text-[9px] font-bold text-primary">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="flex items-center gap-1.5 font-display text-sm font-semibold">
            <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden />
            {t.safetyTitle}
          </h2>
          <ul className="mt-3 space-y-2">
            {[t.safety1, t.safety2, t.safety3, t.safety4].map((item) => (
              <li key={item} className="flex items-start gap-1.5 text-[10px] leading-relaxed text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400/80" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold">{t.needHelp}</p>
          <Link
            href="/contact"
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
          >
            {t.contactSupport}
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>
      </aside>
    </motion.form>
  );
}
