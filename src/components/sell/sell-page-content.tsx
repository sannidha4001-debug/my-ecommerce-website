"use client";

import { Info } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { PageHero } from "@/components/marketing/page-hero";
import { SellForm } from "@/components/sell/sell-form";

/** Client wrapper so the whole sell page switches language instantly. */
export function SellPageContent() {
  const { dict } = useI18n();
  const t = dict.sellPage;

  return (
    <>
      <PageHero
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
        homeLabel={dict.nav.home}
        currentLabel={dict.nav.sell}
      />
      <section className="container pb-20">
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-sky-400/15 bg-sky-400/[0.05] px-3.5 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-300" aria-hidden />
          {t.previewNote}
        </div>
        <SellForm />
      </section>
    </>
  );
}
