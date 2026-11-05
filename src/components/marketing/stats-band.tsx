"use client";

import { useI18n } from "@/components/providers/i18n-provider";
import { Counter } from "@/components/animations/counter";
import { stats } from "@/lib/demo-data";

/** Animated credibility strip directly beneath the hero. */
export function StatsBand() {
  const { dict } = useI18n();

  return (
    <section className="relative border-y border-border/60 bg-white/[0.015]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/5 to-transparent" />
      <div className="container relative grid grid-cols-2 divide-x divide-border/50 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.labelKey}
            className={`flex flex-col items-center gap-1 px-3 py-7 text-center ${
              index >= 2 ? "border-t border-border/50 lg:border-t-0" : ""
            } ${index === 1 ? "border-l-0 lg:border-l" : ""} ${
              index === 3 ? "border-l-0 lg:border-l" : ""
            }`}
          >
            <Counter
              value={stat.value}
              decimals={stat.decimals}
              prefix={"prefix" in stat ? stat.prefix : undefined}
              suffix={stat.suffix}
              className="font-display text-2xl font-bold tracking-tight sm:text-3xl"
            />
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:text-xs">
              {dict.home.stats[stat.labelKey]}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
