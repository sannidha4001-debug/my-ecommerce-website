import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative grid place-items-center overflow-hidden rounded-xl bg-brand-gradient shadow-[0_8px_24px_-8px_rgba(99,102,241,0.9)]",
        className,
      )}
      aria-hidden="true"
    >
      {/* soft top-light */}
      <span className="absolute inset-x-0 top-0 h-1/2 bg-white/20 blur-md" />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={cn("relative h-[58%] w-[58%] text-white", animated && "animate-pulse-glow")}
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Two crossing arrows = exchange */}
        <path d="M6.5 6.5h5l6 11h-5" />
        <path d="M17.5 17.5h-5l-6-11h5" />
        <path d="M4.5 6.5H2m2 11H2" className="opacity-70" />
      </svg>
      <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
    </span>
  );
}

export function Logo({
  className,
  markClassName,
  showWordmark = true,
}: {
  className?: string;
  markClassName?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-lg outline-offset-4",
        className,
      )}
      aria-label="GameXchange home"
    >
      <LogoMark
        className={cn(
          "h-9 w-9 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105",
          markClassName,
        )}
      />
      {showWordmark && (
        <span className="font-display text-[19px] font-bold leading-none tracking-tight text-foreground">
          Game
          <span className="text-gradient-static">Xchange</span>
        </span>
      )}
    </Link>
  );
}
