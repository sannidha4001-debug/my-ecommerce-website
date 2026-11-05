"use client";

import Link from "next/link";
import { BadgeCheck, Heart, Star, Gavel, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/components/providers/i18n-provider";
import { TiltCard } from "@/components/animations/tilt-card";
import { Countdown } from "@/components/animations/countdown";
import { GameArtwork } from "@/components/marketing/game-artwork";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/lib/demo-data";
import { useAppStore } from "@/lib/store";
import { cn, formatBDT } from "@/lib/utils";

/** Shared listing card for the marketplace and homepage rails. */
export function ListingCard({
  listing,
  view = "grid",
  index = 0,
}: {
  listing: Listing;
  view?: "grid" | "list";
  index?: number;
}) {
  const { dict } = useI18n();
  const { toggleWatch, isWatched } = useAppStore();
  const watched = isWatched(listing.id);
  const isAuction = listing.type === "auction";

  function handleWatch() {
    toggleWatch(listing.id);
    toast.success(
      watched ? dict.marketplace.watchRemoved : dict.marketplace.watchAdded,
      { description: listing.title },
    );
  }

  return (
    <TiltCard className={cn("h-full", view === "list" && "w-full")}>
      <article
        className={cn(
          "glass group relative flex h-full overflow-hidden rounded-2xl transition-all duration-300 hover:border-primary/30 hover:shadow-glow",
          view === "list" && "flex-col sm:flex-row",
        )}
      >
        {/* Cover */}
        <div
          className={cn(
            "relative shrink-0",
            view === "grid" ? "h-44 w-full" : "h-44 w-full sm:h-auto sm:w-60",
          )}
        >
          <GameArtwork
            game={listing.game}
            index={index}
            className={cn("h-full w-full", view === "grid" ? "" : "sm:absolute sm:inset-0")}
            label={listing.rank}
          />

          {/* status badges */}
          <div className="absolute left-3 top-11 flex flex-col items-start gap-1.5">
            {listing.featured && (
              <Badge variant="gradient" className="shadow-glow">
                {dict.common.featured}
              </Badge>
            )}
            {isAuction && (
              <Badge variant="live" className="gap-1 border-rose-300/30 bg-black/30 backdrop-blur-md">
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400" />
                </span>
                {dict.common.live}
              </Badge>
            )}
          </div>

          {/* watch button */}
          <button
            type="button"
            onClick={handleWatch}
            aria-pressed={watched}
            aria-label={watched ? dict.common.watching : dict.common.watch}
            className={cn(
              "absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/50",
              watched && "border-rose-300/40 bg-rose-500/80",
            )}
          >
            <Heart className={cn("h-3.5 w-3.5 transition", watched && "fill-current")} />
          </button>

          {/* live countdown */}
          {isAuction && listing.endsInHours !== undefined && (
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-lg border border-white/15 bg-black/40 px-2.5 py-1.5 text-[11px] text-white backdrop-blur-md">
              <span className="text-white/70">{dict.common.endsIn}</span>
              <Countdown
                endsInHours={listing.endsInHours}
                live
                showIcon={false}
                label={dict.common.endsIn}
                className="text-white"
              />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex min-w-0 flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/listing/${listing.id}`} className="min-w-0">
              <h3 className="line-clamp-2 min-h-[2.5rem] font-display text-[15px] font-semibold leading-snug text-foreground transition group-hover:text-primary">
                {listing.title}
              </h3>
            </Link>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="font-medium">
              {dict.common.level} {listing.level}
            </Badge>
            <Badge variant="secondary" className="font-medium">
              {listing.rank}
            </Badge>
            {view === "list" && (
              <Badge variant="outline" className="hidden sm:inline-flex">
                {listing.platform}
              </Badge>
            )}
          </div>

          {view === "list" && (
            <p className="mt-2 hidden line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:block">
              {listing.description}
            </p>
          )}

          {/* Seller */}
          <div className="mt-3 flex items-center gap-2 border-t border-border/60 pt-3">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-gradient text-[9px] font-bold uppercase text-white">
              {listing.seller.username.slice(0, 2)}
            </span>
            <span className="min-w-0 truncate text-xs font-medium text-foreground/90">
              {listing.seller.username}
            </span>
            {listing.seller.verified && (
              <BadgeCheck
                className="h-3.5 w-3.5 shrink-0 text-cyan-400"
                aria-label={dict.common.verifiedSeller}
              />
            )}
            <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />
              {listing.seller.rating.toFixed(1)}
            </span>
          </div>

          {/* Price + CTA */}
          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {isAuction ? dict.common.currentBid : dict.common.fixedPrice}
              </p>
              <p className="font-display text-lg font-bold leading-tight text-foreground">
                {formatBDT(listing.price)}
              </p>
              {isAuction && (
                <p className="text-[10px] text-muted-foreground">
                  {listing.bids} {dict.common.bids}
                </p>
              )}
            </div>
            <Button
              asChild
              size="sm"
              variant={isAuction ? "default" : "secondary"}
              className="shrink-0"
            >
              <Link href={`/listing/${listing.id}`}>
                {isAuction ? <Gavel className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
                {isAuction ? dict.home.hero.placeBid : dict.common.buyNow}
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

/** Loading placeholder with the same silhouette as ListingCard. */
export function ListingCardSkeleton({ view = "grid" }: { view?: "grid" | "list" }) {
  return (
    <div
      className={cn(
        "glass overflow-hidden rounded-2xl",
        view === "list" ? "flex flex-col sm:flex-row" : "",
      )}
    >
      <div
        className={cn(
          "shimmer-surface",
          view === "grid" ? "h-44 w-full" : "h-44 w-full sm:h-auto sm:w-60",
        )}
      />
      <div className="flex-1 space-y-3 p-4">
        <div className="h-4 w-4/5 rounded bg-muted/70" />
        <div className="h-4 w-3/5 rounded bg-muted/70" />
        <div className="flex gap-2 pt-2">
          <div className="h-5 w-16 rounded-full bg-muted/70" />
          <div className="h-5 w-16 rounded-full bg-muted/70" />
        </div>
        <div className="h-8 w-full rounded-lg bg-muted/60" />
      </div>
    </div>
  );
}
