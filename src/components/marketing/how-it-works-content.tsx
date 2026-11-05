"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Info,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { PageHero } from "@/components/marketing/page-hero";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";

export function HowItWorksContent() {
  const { dict, isBangla } = useI18n();
  const page = dict.pages.howItWorks;

  return (
    <div>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.subtitle}
        homeLabel={dict.nav.home}
        currentLabel={dict.nav.howItWorks}
      />

      <div className="container pb-16">
        {/* Intro */}
        <Reveal>
          <div className="gradient-border glass relative overflow-hidden rounded-2xl p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-500/15 blur-3xl" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-gradient-soft ring-1 ring-white/10">
                <ShieldCheck className="h-5 w-5 text-emerald-400" aria-hidden />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold">
                  {isBangla ? "একটি ট্রাস্ট মেশিন" : "A trust machine, in plain words"}
                </h2>
                <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {page.intro}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Timeline */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="relative">
            <div
              className="absolute bottom-10 left-[22px] top-6 w-px bg-gradient-to-b from-blue-500/50 via-violet-500/50 to-fuchsia-500/40 sm:left-[26px]"
              aria-hidden
            />
            <div className="space-y-4">
              {page.steps.map((step, index) => (
                <Reveal key={step.title} delay={index * 0.03}>
                  <div className="relative flex gap-4 sm:gap-5">
                    <div className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-primary/25 bg-[#0f1030] font-display text-sm font-bold text-white shadow-glow sm:h-[52px] sm:w-[52px]">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="glass flex-1 rounded-2xl p-4 transition-colors hover:border-primary/25 sm:p-5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-sm font-semibold sm:text-base">
                          {step.title}
                        </h3>
                        {index === page.steps.length - 1 && (
                          <BadgeCheck className="h-4 w-4 text-emerald-400" aria-hidden />
                        )}
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-[13px]">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Fees */}
        <div id="fees" className="mx-auto mt-16 grid max-w-4xl scroll-mt-28 gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="glass h-full rounded-2xl p-5 sm:p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Sparkles className="h-5 w-5 text-violet-300" aria-hidden />
              </span>
              <h2 className="mt-4 font-display text-xl font-semibold">{page.feesTitle}</h2>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {page.feesBody}
              </p>
              <ul className="mt-5 space-y-2.5">
                {page.feesPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-xs text-foreground/80">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="gradient-border glass h-full overflow-hidden rounded-2xl p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {isBangla ? "উদাহরণ" : "Worked example"}
              </p>
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2.5">
                  <span className="text-muted-foreground">{dict.common.currentBid}</span>
                  <span className="font-semibold">৳10,000</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2.5">
                  <span className="text-muted-foreground">
                    {dict.common.commission} (7%, min ৳50)
                  </span>
                  <span className="font-semibold text-rose-300">− ৳700</span>
                </div>
                <div className="divider-glow" />
                <div className="flex items-center justify-between rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-3">
                  <span className="font-medium text-emerald-200">
                    {isBangla ? "বিক্রেতা পাবেন" : "Seller receives"}
                  </span>
                  <span className="font-display text-lg font-bold text-emerald-300">৳9,300</span>
                </div>
              </div>
              <p className="mt-4 flex items-start gap-1.5 text-[10px] leading-relaxed text-muted-foreground/70">
                <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
                {isBangla
                  ? "চূড়ান্ত ফি রিলিজের আগে অর্ডার পেজে দেখানো হয়।"
                  : "The exact fee is always shown on the order page before release."}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Safety rules */}
        <Reveal>
          <div
            id="safety"
            className="mx-auto mt-8 max-w-4xl scroll-mt-28 overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/[0.07] via-rose-500/[0.04] to-transparent p-5 sm:p-6"
          >
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-amber-400/20 bg-amber-400/10">
                <ShieldAlert className="h-5 w-5 text-amber-400" aria-hidden />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold">{page.safetyTitle}</h2>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {page.safetyPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-xs leading-relaxed text-foreground/80">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="font-display text-lg font-semibold">{page.ctaTitle}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{page.ctaBody}</p>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/marketplace">
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
