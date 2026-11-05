"use client";

import {
  BadgeCheck,
  Gavel,
  Headphones,
  MessagesSquare,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Stagger, StaggerItem } from "@/components/animations/reveal";

const FEATURES = [
  { icon: ShieldCheck, title: "f1Title", body: "f1Body" },
  { icon: BadgeCheck, title: "f2Title", body: "f2Body" },
  { icon: Gavel, title: "f3Title", body: "f3Body" },
  { icon: MessagesSquare, title: "f4Title", body: "f4Body" },
  { icon: Wallet, title: "f5Title", body: "f5Body" },
  { icon: Headphones, title: "f6Title", body: "f6Body" },
] as const;

export function Features() {
  const { dict } = useI18n();

  return (
    <section className="relative py-20 sm:py-24" id="why-gamexchange">
      <div className="pointer-events-none absolute right-0 top-20 -z-10 h-80 w-80 rounded-full bg-fuchsia-600/10 blur-[110px]" />
      <div className="container">
        <SectionHeading
          eyebrow={dict.home.features.eyebrow}
          title={dict.home.features.title}
          subtitle={dict.home.features.subtitle}
        />

        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <StaggerItem key={feature.title} className="h-full">
              <div
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/40 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card/60 hover:shadow-glow ${
                  index === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-500/10 blur-2xl transition-opacity group-hover:opacity-100" />
                <span className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <feature.icon className="h-5 w-5 text-violet-300" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-[15px] font-semibold">
                  {dict.home.features[feature.title]}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {dict.home.features[feature.body]}
                </p>
                <span className="mt-auto pt-4">
                  <span className="block h-px w-8 bg-gradient-to-r from-primary to-transparent transition-all duration-500 group-hover:w-16" />
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
