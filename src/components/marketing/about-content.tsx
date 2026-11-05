"use client";

import Link from "next/link";
import {
  ArrowRight,
  Eye,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { PageHero } from "@/components/marketing/page-hero";
import { StatsBand } from "@/components/marketing/stats-band";
import { Reveal, Stagger, StaggerItem } from "@/components/animations/reveal";
import { Counter } from "@/components/animations/counter";
import { LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const VALUE_ICONS = [ShieldCheck, Eye, MapPin];

export function AboutContent() {
  const { dict, isBangla } = useI18n();
  const page = dict.pages.about;

  return (
    <div>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.subtitle}
        homeLabel={dict.nav.home}
        currentLabel={dict.nav.about}
      />

      <div className="container pb-16">
        {/* Story */}
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                <Sparkles className="h-3 w-3" aria-hidden />
                {page.storyTitle}
              </span>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
                <p>{page.story1}</p>
                <p>{page.story2}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="gradient-border glass relative overflow-hidden rounded-3xl p-6">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
              <div className="flex items-center gap-3">
                <LogoMark className="h-12 w-12 rounded-2xl" />
                <div>
                  <p className="font-display text-lg font-bold leading-none">
                    Game<span className="text-gradient-static">Xchange</span>
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {isBangla ? "ঢাকা, বাংলাদেশ" : "Dhaka, Bangladesh"}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  { value: 12480, suffix: "+", label: dict.home.stats.deals },
                  { value: 3260, suffix: "+", label: dict.home.stats.sellers },
                  { value: 4.9, suffix: "/5", decimals: 1, label: dict.home.stats.rating },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5 text-center"
                  >
                    <Counter
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals ?? 0}
                      className="font-display text-sm font-bold sm:text-base"
                    />
                    <p className="mt-0.5 text-[8px] uppercase tracking-wider text-muted-foreground sm:text-[9px]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2.5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                <p className="text-[10px] leading-snug text-emerald-200/90">
                  {isBangla
                    ? "প্রতিটি পেআউটের আগে মানুষের যাচাই, প্রতিটি বিরোধে মানুষের সিদ্ধান্ত।"
                    : "Human verification before every payout. Human judgement in every dispute."}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Values */}
        <div className="mt-16">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {page.valuesTitle}
            </h2>
          </Reveal>
          <Stagger className="mt-6 grid gap-4 md:grid-cols-3">
            {page.values.map((value, index) => {
              const Icon = VALUE_ICONS[index] ?? HeartHandshake;
              return (
                <StaggerItem key={value.title} className="h-full">
                  <div className="glass group h-full rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-glow">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
                      <Icon className="h-5 w-5 text-violet-300" aria-hidden />
                    </span>
                    <h3 className="mt-4 font-display text-base font-semibold">{value.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {value.body}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>

        {/* Community numbers */}
        <Reveal className="mt-16">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {page.numbersTitle}
            </h2>
            <Badge variant="success" className="gap-1">
              <ShieldCheck className="h-3 w-3" />
              {isBangla ? "লাইভ ট্র্যাক করা হচ্ছে" : "Tracked live"}
            </Badge>
          </div>
        </Reveal>
      </div>

      <StatsBand />

      <div className="container">
        <Reveal>
          <div className="gradient-border glass mt-16 flex flex-col items-center justify-between gap-5 rounded-2xl p-6 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="font-display text-xl font-semibold">{page.ctaTitle}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {isBangla
                  ? "আজই অ্যাকাউন্ট খুলুন — প্রথম ডিল পর্যন্ত কোনো ফি নেই।"
                  : "Create an account today — no fee until your first completed deal."}
              </p>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/register">
                {page.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
