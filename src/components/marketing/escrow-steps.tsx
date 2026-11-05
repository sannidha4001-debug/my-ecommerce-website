"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  MessagesSquare,
  MousePointerClick,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Stagger, StaggerItem, Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";

const STEPS = [
  { icon: MousePointerClick, title: "step1Title", body: "step1Body" },
  { icon: Wallet, title: "step2Title", body: "step2Body" },
  { icon: MessagesSquare, title: "step3Title", body: "step3Body" },
  { icon: ShieldCheck, title: "step4Title", body: "step4Body" },
] as const;

export function EscrowSteps() {
  const { dict } = useI18n();

  return (
    <section className="relative overflow-hidden py-20 sm:py-24" id="how-escrow-works">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/[0.04] to-transparent" />
      <div className="pointer-events-none absolute left-0 top-1/3 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]" />

      <div className="container">
        <SectionHeading
          eyebrow={dict.home.escrow.eyebrow}
          title={dict.home.escrow.title}
          subtitle={dict.home.escrow.subtitle}
        />

        <div className="relative mt-12">
          {/* connector line behind the cards */}
          <div
            className="absolute left-[12%] right-[12%] top-[46px] hidden h-px bg-gradient-to-r from-blue-500/30 via-violet-400/50 to-fuchsia-500/30 lg:block"
            aria-hidden
          />

          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <StaggerItem key={step.title} className="h-full">
                <div className="group glass relative h-full rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow">
                  <span
                    className="absolute right-4 top-4 font-display text-3xl font-bold text-white/[0.06] transition-colors group-hover:text-white/10"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="relative">
                    <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-brand-gradient-soft ring-1 ring-inset ring-white/10">
                      <step.icon className="h-5 w-5 text-violet-300" aria-hidden />
                      <span className="absolute -inset-1 -z-10 rounded-xl bg-violet-500/20 opacity-0 blur transition-opacity group-hover:opacity-100" />
                    </span>
                    <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                      {dict.home.escrow.stepLabel} {index + 1}
                    </p>
                    <h3 className="mt-1.5 font-display text-base font-semibold">
                      {dict.home.escrow[step.title]}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {dict.home.escrow[step.body]}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal delay={0.15}>
          <div className="gradient-border glass mt-6 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
              <BadgeCheck className="h-5 w-5 text-emerald-400" aria-hidden />
            </span>
            <p className="flex-1 text-xs leading-relaxed text-muted-foreground">
              {dict.home.escrow.note}
            </p>
            <Button asChild variant="ghost" size="sm" className="shrink-0 self-start text-cyan-300 hover:text-cyan-200 sm:self-auto">
              <Link href="/how-it-works">
                {dict.home.escrow.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
