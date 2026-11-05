"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Grid2X2,
  Info,
  List,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
} from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { AuroraBackground } from "@/components/marketing/aurora-background";
import {
  ListingCard,
  ListingCardSkeleton,
} from "@/components/marketplace/listing-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { games, listings } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

type TypeFilter = "all" | "fixed" | "auction";
type SortOption = "newest" | "price-asc" | "price-desc" | "ending" | "bids";

export function MarketplaceContent() {
  const { dict, isBangla } = useI18n();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [game, setGame] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visible, setVisible] = useState(6);
  const [loading, setLoading] = useState(true);

  // Deep links such as /marketplace?game=free-fire&type=auction
  const gameParam = searchParams.get("game");
  const typeParam = searchParams.get("type");

  useEffect(() => {
    if (gameParam && games.some((item) => item.slug === gameParam)) {
      setGame(gameParam);
    }
    if (typeParam === "auction" || typeParam === "fixed") {
      setTypeFilter(typeParam);
    }
  }, [gameParam, typeParam]);

  // A short skeleton phase demonstrates loading states and feels alive.
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const min = Number(minPrice);
    const max = Number(maxPrice);
    const hasMin = minPrice.trim() !== "" && Number.isFinite(min);
    const hasMax = maxPrice.trim() !== "" && Number.isFinite(max);
    const needle = query.trim().toLowerCase();

    const result = listings.filter((listing) => {
      if (game !== "all" && listing.game.slug !== game) return false;
      if (typeFilter !== "all" && listing.type !== typeFilter) return false;
      if (verifiedOnly && !listing.seller.verified) return false;
      if (hasMin && listing.price < min) return false;
      if (hasMax && listing.price > max) return false;
      if (needle) {
        const haystack = [
          listing.title,
          listing.game.name,
          listing.rank,
          listing.platform,
          listing.seller.username,
          ...listing.tags,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });

    return [...result].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "ending":
          return (a.endsInHours ?? Number.MAX_SAFE_INTEGER) - (b.endsInHours ?? Number.MAX_SAFE_INTEGER);
        case "bids":
          return b.bids - a.bids;
        default:
          return 0;
      }
    });
  }, [game, typeFilter, verifiedOnly, minPrice, maxPrice, query, sort]);

  // Reset pagination whenever the result set changes.
  useEffect(() => {
    setVisible(6);
  }, [game, typeFilter, verifiedOnly, minPrice, maxPrice, query, sort]);

  const activeFilterCount =
    (game !== "all" ? 1 : 0) +
    (typeFilter !== "all" ? 1 : 0) +
    (verifiedOnly ? 1 : 0) +
    (minPrice.trim() ? 1 : 0) +
    (maxPrice.trim() ? 1 : 0);

  function resetFilters() {
    setQuery("");
    setGame("all");
    setTypeFilter("all");
    setMinPrice("");
    setMaxPrice("");
    setVerifiedOnly(false);
    setSort("newest");
  }

  const shown = filtered.slice(0, visible);

  return (
    <div>
      {/* Compact page hero */}
      <section className="relative isolate overflow-hidden pb-8 pt-10 sm:pt-14">
        <AuroraBackground particles={false} />
        <div className="container relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Link href="/" className="transition hover:text-foreground">
              {dict.nav.home}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-foreground/80">{dict.nav.marketplace}</span>
          </nav>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  {dict.marketplace.title}
                </h1>
                <Badge variant="gradient" className="translate-y-0.5">
                  {filtered.length} {dict.marketplace.results}
                </Badge>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {dict.marketplace.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/20 bg-amber-400/5 px-2.5 py-1.5">
                <Info className="h-3 w-3 text-amber-400" aria-hidden />
                {dict.marketplace.previewNotice}
              </span>
            </div>
          </div>

          <p className="mt-3 max-w-3xl text-[10px] leading-relaxed text-muted-foreground/70">
            {dict.marketplace.previewNote}
          </p>
        </div>
      </section>

      <div className="container pb-10">
        {/* Search + toolbar */}
        <div className="glass sticky top-[72px] z-30 rounded-2xl p-3">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={dict.marketplace.searchPlaceholder}
                aria-label={dict.marketplace.searchPlaceholder}
                className="h-10 border-white/10 bg-white/[0.04] pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setFiltersOpen((open) => !open)}
                aria-expanded={filtersOpen}
                aria-controls="marketplace-filters"
                className="h-10"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {dict.marketplace.filters}
                {activeFilterCount > 0 && (
                  <span className="ml-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-gradient px-1 text-[9px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>

              <div className="relative hidden sm:block">
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortOption)}
                  aria-label={dict.marketplace.sortLabel}
                  className="h-10 appearance-none rounded-lg border border-border bg-white/[0.04] pl-3 pr-8 text-xs font-medium text-foreground outline-none transition hover:border-border/80 focus-visible:border-primary/60"
                >
                  <option value="newest">{dict.marketplace.newest}</option>
                  <option value="price-asc">{dict.marketplace.priceLow}</option>
                  <option value="price-desc">{dict.marketplace.priceHigh}</option>
                  <option value="ending">{dict.marketplace.endingSoon}</option>
                  <option value="bids">{dict.marketplace.mostBids}</option>
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
              </div>

              <div className="flex items-center gap-0.5 rounded-lg border border-border bg-white/[0.04] p-0.5">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  aria-pressed={view === "grid"}
                  aria-label={dict.marketplace.gridView}
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-md transition",
                    view === "grid"
                      ? "bg-brand-gradient text-white shadow"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Grid2X2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  aria-pressed={view === "list"}
                  aria-label={dict.marketplace.listView}
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-md transition",
                    view === "list"
                      ? "bg-brand-gradient text-white shadow"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable advanced filters */}
          <AnimatePresence initial={false}>
            {filtersOpen && (
              <motion.div
                id="marketplace-filters"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-3 grid gap-3 border-t border-white/5 pt-3 sm:grid-cols-2 lg:grid-cols-5">
                  <div>
                    <Label htmlFor="min-price" className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {dict.marketplace.min}
                    </Label>
                    <Input
                      id="min-price"
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={minPrice}
                      onChange={(event) => setMinPrice(event.target.value)}
                      placeholder="৳0"
                      className="mt-1.5 h-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-price" className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {dict.marketplace.max}
                    </Label>
                    <Input
                      id="max-price"
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={maxPrice}
                      onChange={(event) => setMaxPrice(event.target.value)}
                      placeholder="৳100,000"
                      className="mt-1.5 h-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type-filter" className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {dict.marketplace.listingType}
                    </Label>
                    <div className="relative mt-1.5">
                      <select
                        id="type-filter"
                        value={typeFilter}
                        onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
                        className="h-9 w-full appearance-none rounded-lg border border-border bg-white/[0.04] pl-3 pr-8 text-xs text-foreground outline-none transition focus-visible:border-primary/60"
                      >
                        <option value="all">{dict.marketplace.allTypes}</option>
                        <option value="fixed">{dict.marketplace.fixed}</option>
                        <option value="auction">{dict.marketplace.auctionType}</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {dict.marketplace.verifiedOnly}
                    </span>
                    <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-xs text-foreground/80">
                      <Switch
                        checked={verifiedOnly}
                        onCheckedChange={setVerifiedOnly}
                        aria-label={dict.marketplace.verifiedOnly}
                      />
                      {dict.common.verified}
                    </label>
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="h-9 w-full text-muted-foreground"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      {dict.marketplace.reset}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game chips */}
          <div className="scrollbar-none mt-3 flex items-center gap-1.5 overflow-x-auto border-t border-white/5 pt-3">
            <button
              type="button"
              onClick={() => setGame("all")}
              className={cn(
                "shrink-0 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition",
                game === "all"
                  ? "border-primary/30 bg-primary/15 text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {dict.marketplace.allGames}
            </button>
            {games.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setGame(item.slug)}
                className={cn(
                  "shrink-0 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition",
                  game === item.slug
                    ? "border-primary/30 bg-primary/15 text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Result count row */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {dict.marketplace.showing}{" "}
            <span className="font-semibold text-foreground">{shown.length}</span>{" "}
            {dict.marketplace.of}{" "}
            <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
            {dict.marketplace.results}
          </p>
          <div className="flex items-center gap-2 sm:hidden">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              aria-label={dict.marketplace.sortLabel}
              className="h-8 rounded-lg border border-border bg-white/[0.04] px-2 text-[11px] text-foreground"
            >
              <option value="newest">{dict.marketplace.newest}</option>
              <option value="price-asc">{dict.marketplace.priceLow}</option>
              <option value="price-desc">{dict.marketplace.priceHigh}</option>
              <option value="ending">{dict.marketplace.endingSoon}</option>
              <option value="bids">{dict.marketplace.mostBids}</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mt-4" aria-live="polite" aria-busy={loading}>
          {loading ? (
            <div
              className={cn(
                "grid gap-4",
                view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
              )}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <ListingCardSkeleton key={index} view={view} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass flex flex-col items-center rounded-2xl px-6 py-16 text-center">
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <SearchX className="h-6 w-6 text-violet-300" aria-hidden />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold">
                {dict.marketplace.emptyTitle}
              </h2>
              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                {dict.marketplace.emptyBody}
              </p>
              <Button variant="secondary" size="sm" onClick={resetFilters} className="mt-5">
                <RotateCcw className="h-3.5 w-3.5" />
                {dict.marketplace.reset}
              </Button>
            </div>
          ) : (
            <motion.div
              layout
              className={cn(
                "grid gap-4",
                view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
              )}
            >
              <AnimatePresence mode="popLayout">
                {shown.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3, delay: index < 6 ? index * 0.04 : 0 }}
                    className="h-full"
                  >
                    <ListingCard listing={listing} view={view} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Load more */}
        {!loading && filtered.length > visible && (
          <div className="mt-8 flex justify-center">
            <Button variant="secondary" onClick={() => setVisible((count) => count + 3)}>
              {dict.marketplace.loadMore}
              <span className="text-[10px] text-muted-foreground">
                ({filtered.length - visible})
              </span>
            </Button>
          </div>
        )}

        <p className="mt-10 text-center text-[10px] text-muted-foreground/60">
          {isBangla
            ? "সব লিস্টিং অ্যাডমিন অনুমোদনের পর লাইভ হয়।"
            : "Every listing is reviewed by an admin before it goes live."}
        </p>
      </div>
    </div>
  );
}
