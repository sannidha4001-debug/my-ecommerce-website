"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { Reveal } from "@/components/animations/reveal";
import { Magnetic } from "@/components/animations/magnetic";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  const { dict } = useI18n();

  return (
    <section className="relative py-16 sm:py-24">
      <div className="container">
        <Reveal>
          <div className="gradient-border glass relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-16">
            {/* inner aurora */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-aurora opacity-60" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-fuchsia-500/25 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-blue-500/20 blur-[90px]" />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-pattern bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/70 backdrop-blur">
              <Sparkles className="h-3 w-3 text-violet-300" aria-hidden />
              {dict.home.features.badge}
            </span>

            <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[44px]">
              {dict.home.cta.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {dict.home.cta.subtitle}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Magnetic>
                <Button asChild size="lg" className="w-full min-w-[190px] sm:w-auto">
                  <Link href="/register">
                    {dict.home.cta.primary}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </Magnetic>
              <Button asChild size="lg" variant="glass" className="w-full min-w-[170px] sm:w-auto">
                <Link href="/marketplace">{dict.home.cta.secondary}</Link>
              </Button>
            </div>

            <p className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
              {dict.home.cta.guarantee}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
