"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  PlayCircle,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";
import { AuroraBackground } from "@/components/marketing/aurora-background";
import { GameArtwork } from "@/components/marketing/game-artwork";
import { TiltCard } from "@/components/animations/tilt-card";
import { Countdown } from "@/components/animations/countdown";
import { Magnetic } from "@/components/animations/magnetic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getGame } from "@/lib/demo-data";
import { formatBDT } from "@/lib/utils";

export function Hero() {
  const { dict, isBangla } = useI18n();
  const reduceMotion = useReducedMotion();
  const freeFire = getGame("free-fire");

  function previewAction() {
    toast.info(dict.common.preview, {
      description: isBangla
        ? "লাইভ বিডিং ও চেকআউট পরবর্তী ধাপে চালু হবে।"
        : "Live bidding and checkout are enabled in the next build phases.",
    });
  }

  return (
    <section className="relative isolate overflow-hidden pb-20 pt-12 sm:pt-16 lg:pb-28 lg:pt-24">
      <AuroraBackground />

      <div className="container relative z-10 grid items-center gap-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10">
        {/* ---------- Copy ---------- */}
        <div className="max-w-2xl">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <Badge
              variant="glass"
              className="gap-2 border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-foreground/80"
            >
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {dict.home.hero.badge}
              <span className="text-muted-foreground/60">·</span>
              <span className="inline-flex items-center gap-1 text-cyan-300">
                <TrendingUp className="h-3 w-3" />
                {dict.home.hero.liveNow}
              </span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 font-display text-[2.55rem] font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.85rem] xl:text-[4.15rem]"
          >
            {dict.home.hero.titleLine1}{" "}
            <span className="block">
              <span className="text-gradient">{dict.home.hero.titleHighlight}</span>
            </span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            {dict.home.hero.subtitle}
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Magnetic>
              <Button asChild size="lg" className="w-full pr-5 sm:w-auto">
                <Link href="/marketplace">
                  {dict.home.hero.ctaPrimary}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </Magnetic>
            <Button asChild size="lg" variant="glass" className="w-full sm:w-auto">
              <Link href="/how-it-works">
                <PlayCircle className="h-4 w-4 text-cyan-300" />
                {dict.home.hero.ctaSecondary}
              </Link>
            </Button>
          </motion.div>

          {/* Trust points */}
          <motion.ul
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-7 flex flex-wrap gap-x-5 gap-y-2.5"
          >
            {[
              { icon: ShieldCheck, label: dict.home.hero.trust1 },
              { icon: BadgeCheck, label: dict.home.hero.trust2 },
              { icon: Clock3, label: dict.home.hero.trust3 },
            ].map((item) => (
              <li
                key={item.label}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground"
              >
                <item.icon className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
                {item.label}
              </li>
            ))}
          </motion.ul>

          {/* Social proof */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.55 }}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {["RH", "NJ", "AC", "SI"].map((initials, index) => (
                  <span
                    key={initials}
                    className={`grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-gradient-to-br text-[9px] font-bold text-white ${
                      [
                        "from-orange-500 to-rose-600",
                        "from-emerald-500 to-teal-600",
                        "from-blue-500 to-indigo-600",
                        "from-fuchsia-500 to-purple-600",
                      ][index]
                    }`}
                  >
                    {initials}
                  </span>
                ))}
                <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-white/10 text-[9px] font-bold text-foreground backdrop-blur">
                  12K+
                </span>
              </div>
              <div>
                <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-3 w-3 fill-amber-400 text-amber-400"
                      aria-hidden
                    />
                  ))}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {dict.home.hero.gamers}
                </p>
              </div>
            </div>
            <div className="hidden h-8 w-px bg-border sm:block" />
            <p className="max-w-[170px] text-[11px] leading-snug text-muted-foreground">
              {dict.home.hero.rating}
            </p>
          </motion.div>
        </div>

        {/* ---------- Visual composition ---------- */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-[420px] lg:max-w-[430px]"
        >
          {/* ambient glow */}
          <div className="absolute inset-10 -z-10 rounded-full bg-violet-600/30 blur-[90px]" />
          <div className="absolute -right-10 top-1/3 -z-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

          {/* rotating ring behind card */}
          <div
            className="pointer-events-none absolute -inset-6 rounded-[2.5rem] border border-white/5"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -inset-12 rounded-[3rem] border border-white/[0.03]"
            aria-hidden
          />

          <div className="animate-float-slow will-change-transform">
            <TiltCard maxTilt={5}>
              <div className="glass-strong gradient-border overflow-hidden rounded-3xl p-3 shadow-glow-lg">
                {/* Card header */}
                <div className="flex items-center justify-between px-1 pb-3 pt-1">
                  <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <span className="relative flex h-1.5 w-1.5" aria-hidden>
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400" />
                    </span>
                    {dict.home.hero.liveCardLabel}
                  </span>
                  <Badge variant="success" className="gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    {dict.home.hero.protectedDeal}
                  </Badge>
                </div>

                {/* Artwork */}
                <div className="relative overflow-hidden rounded-2xl">
                  <GameArtwork game={freeFire} className="h-40 w-full" />
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
                    <Badge variant="glass" className="border-white/20 bg-black/40 text-[10px] text-white">
                      {dict.home.hero.liveCardGame}
                    </Badge>
                    <Badge variant="live" className="border-rose-300/30 bg-black/45 text-[10px] backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400" aria-hidden />
                      {dict.common.live}
                    </Badge>
                  </div>
                </div>

                {/* Details */}
                <div className="px-1 pb-1 pt-3.5">
                  <h2 className="line-clamp-1 font-display text-[15px] font-semibold text-foreground">
                    {dict.home.hero.liveCardTitle}
                  </h2>

                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {dict.home.hero.liveCardBid}
                      </p>
                      <p className="font-display text-2xl font-bold leading-tight">
                        {formatBDT(24500)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {dict.home.hero.liveCardBids}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-right">
                      <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                        {dict.home.hero.liveCardEnds}
                      </p>
                      <Countdown
                        endsInHours={2.4}
                        live
                        showIcon={false}
                        label={dict.common.endsIn}
                        className="text-[12px] text-rose-300"
                      />
                    </div>
                  </div>

                  <Button onClick={previewAction} className="mt-3 w-full" size="sm">
                    {dict.home.hero.placeBid}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>

                  <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5">
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-rose-600 text-[8px] font-bold text-white">
                        RG
                      </span>
                      rafi_gamer
                      <BadgeCheck className="h-3 w-3 text-cyan-400" aria-hidden />
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      4.9 · 214
                    </span>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Floating chip: escrow protected */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="absolute -left-3 top-8 z-20 hidden items-center gap-2 rounded-xl border border-emerald-400/20 bg-[#0b1222]/90 px-3 py-2 shadow-glow backdrop-blur-xl sm:flex lg:-left-7"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-400/15">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </span>
            <div>
              <p className="text-[11px] font-semibold text-foreground">
                {dict.home.hero.protectedDeal}
              </p>
              <p className="text-[9px] text-muted-foreground">GameXchange</p>
            </div>
          </motion.div>

          {/* Floating chip: payout released */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="absolute -right-2 bottom-14 z-20 hidden items-center gap-2 rounded-xl border border-cyan-400/20 bg-[#0b1222]/90 px-3 py-2 shadow-glow-cyan backdrop-blur-xl sm:flex lg:-right-6"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-400/15">
              <CheckCircle2 className="h-4 w-4 text-cyan-300" />
            </span>
            <div>
              <p className="text-[11px] font-semibold text-foreground">
                {dict.home.hero.floatingBadge}
              </p>
              <p className="text-[9px] text-muted-foreground">
                {dict.home.hero.floatingBadgeSub}
              </p>
            </div>
          </motion.div>

          {/* Floating chip: seller */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="absolute -bottom-4 left-4 z-20 hidden items-center gap-2 rounded-xl border border-violet-400/20 bg-[#0b1222]/90 px-3 py-2 shadow-glow backdrop-blur-xl sm:flex lg:left-0"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-[9px] font-bold text-white">
              NJ
            </span>
            <p className="text-[10px] font-medium text-foreground">
              {dict.home.hero.miniSeller}
              <span className="ml-1 text-cyan-400">✓</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
