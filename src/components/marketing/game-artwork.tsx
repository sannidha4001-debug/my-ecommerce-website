import { cn } from "@/lib/utils";
import type { Game } from "@/lib/demo-data";

/**
 * Generated cover art for demo listings.
 * No external images needed in Phase 1 — gradients, rings and typography give
 * each game a distinct, premium identity. Real screenshots replace this in
 * Phase 3 while keeping the same visual frame.
 */
export function GameArtwork({
  game,
  className,
  index = 0,
  label,
}: {
  game: Game;
  className?: string;
  index?: number;
  label?: string;
}) {
  const shifts = ["-translate-x-6", "translate-x-4", "-translate-y-3", "translate-y-5"];
  const shift = shifts[index % shifts.length];

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-gradient-to-br",
        game.gradient,
        className,
      )}
      style={{ boxShadow: `inset 0 0 80px ${game.glow}` }}
    >
      {/* light from the top-left */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.38),transparent_52%)]" />

      {/* abstract rings */}
      <div
        className={cn(
          "absolute -right-10 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full border border-white/25",
          shift,
        )}
      />
      <div className="absolute -right-2 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full border border-white/20" />
      <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-black/20 blur-2xl" />

      {/* diagonal light streak */}
      <div className="absolute -left-1/3 top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-md" />

      {/* grid */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-25" />

      {/* game monogram */}
      <span className="absolute -bottom-5 right-1 select-none font-display text-[92px] font-black leading-none tracking-tighter text-white/20">
        {game.short}
      </span>
      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
        {game.name}
      </span>
      {label && (
        <span className="absolute bottom-3 left-4 rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
          {label}
        </span>
      )}

      {/* darken bottom for overlaid text */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />

      {/* grain */}
      <div className="noise-overlay absolute inset-0" />
    </div>
  );
}
