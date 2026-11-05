"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { SectionHeading } from "@/components/marketing/section-heading";
import { GameArtwork } from "@/components/marketing/game-artwork";
import { Stagger, StaggerItem } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { trendingGames } from "@/lib/demo-data";
import { formatCount } from "@/lib/utils";

export function TrendingGames() {
  const { dict, isBangla } = useI18n();

  return (
    <section className="relative py-20 sm:py-24" id="games">
      <div className="container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            align="left"
            eyebrow={dict.home.games.eyebrow}
            title={dict.home.games.title}
            subtitle={dict.home.games.subtitle}
          />
          <Button asChild variant="ghost" size="sm" className="shrink-0 self-start text-muted-foreground sm:self-auto">
            <Link href="/marketplace">
              {dict.common.viewAll}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trendingGames.map((game, index) => (
            <StaggerItem key={game.slug}>
              <Link
                href={`/marketplace?game=${game.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)] transition-all duration-500 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-glow"
              >
                <GameArtwork
                  game={game}
                  index={index}
                  className="h-40 w-full transition-transform duration-700 group-hover:scale-[1.04] sm:h-44"
                />
                <div className="glass absolute inset-x-2 bottom-2 flex items-center justify-between gap-3 rounded-xl px-3.5 py-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-sm font-semibold text-foreground">
                      {game.name}
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      {formatCount(game.listings)} {dict.home.games.listings}
                    </p>
                  </div>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/20 group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <span className="sr-only">
                  {isBangla ? `${game.name} লিস্টিং দেখুন` : `Browse ${game.name} listings`}
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
