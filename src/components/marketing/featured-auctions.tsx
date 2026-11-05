"use client";

import Link from "next/link";
import { ArrowRight, Clock3, ShieldCheck } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ListingCard } from "@/components/marketplace/listing-card";
import { Stagger, StaggerItem, Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { featuredAuctions } from "@/lib/demo-data";

export function FeaturedAuctions() {
  const { dict } = useI18n();
  const auctions = featuredAuctions.slice(0, 3);

  return (
    <section className="relative py-20 sm:py-24" id="auctions">
      <div className="pointer-events-none absolute left-1/2 top-24 -z-10 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[100px]" />
      <div className="container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow={dict.home.auctions.eyebrow}
            title={dict.home.auctions.title}
            subtitle={dict.home.auctions.subtitle}
          />
          <Button asChild variant="secondary" size="sm" className="shrink-0 self-start sm:self-auto">
            <Link href="/marketplace?type=auction">
              {dict.home.auctions.viewAll}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {auctions.map((auction, index) => (
            <StaggerItem key={auction.id} className="h-full">
              <ListingCard listing={auction} index={index} />
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
            {dict.home.auctions.bidderNote}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-cyan-300" aria-hidden />
            {dict.home.auctions.wonNote}
          </span>
        </Reveal>
      </div>
    </section>
  );
}
