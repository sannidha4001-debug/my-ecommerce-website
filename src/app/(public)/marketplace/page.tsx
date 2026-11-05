import type { Metadata } from "next";
import { Suspense } from "react";
import { MarketplaceContent } from "@/components/marketplace/marketplace-content";
import { ListingCardSkeleton } from "@/components/marketplace/listing-card";

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Browse verified Free Fire, eFootball, PUBG, Valorant and Clash of Clans accounts. Filter by game, price and seller reputation.",
};

function MarketplaceFallback() {
  return (
    <div className="container py-16">
      <div className="h-9 w-64 animate-pulse rounded-lg bg-muted/70" />
      <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-muted/50" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ListingCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<MarketplaceFallback />}>
      <MarketplaceContent />
    </Suspense>
  );
}
