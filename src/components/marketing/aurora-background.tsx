import { cn } from "@/lib/utils";

/**
 * Animated aurora + grid + floating particles.
 * Purely decorative, so it is hidden from assistive technology.
 * All motion stops automatically under prefers-reduced-motion.
 */
export function AuroraBackground({
  className,
  particles = true,
}: {
  className?: string;
  particles?: boolean;
}) {
  // Deterministic positions keep server and client markup in sync.
  const dots = Array.from({ length: 14 }, (_, index) => {
    const seed = index * 37.7;
    return {
      left: `${(seed * 7) % 96}%`,
      top: `${(seed * 3.3) % 88}%`,
      size: `${2 + ((index * 5) % 4)}px`,
      delay: `${(index % 7) * 0.8}s`,
      duration: `${6 + (index % 5) * 1.6}s`,
      opacity: 0.2 + ((index * 13) % 50) / 100,
    };
  });

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* base aurora wash */}
      <div className="absolute inset-0 bg-aurora opacity-80 dark:opacity-100" />

      {/* moving colour fields */}
      <div className="absolute -top-[20%] left-[8%] h-[38rem] w-[38rem] rounded-full bg-blue-600/25 blur-[110px] animate-aurora dark:bg-blue-600/30" />
      <div
        className="absolute -right-[12%] top-[2%] h-[34rem] w-[34rem] rounded-full bg-violet-600/25 blur-[120px] animate-aurora dark:bg-violet-600/30"
        style={{ animationDelay: "-5s", animationDuration: "19s" }}
      />
      <div
        className="absolute bottom-[-25%] left-[30%] h-[30rem] w-[42rem] rounded-full bg-fuchsia-600/15 blur-[120px] animate-aurora dark:bg-fuchsia-600/20"
        style={{ animationDelay: "-9s", animationDuration: "23s" }}
      />
      <div
        className="absolute right-[18%] top-[35%] h-56 w-56 rounded-full bg-cyan-400/15 blur-[90px] animate-pulse-glow"
        style={{ animationDelay: "-2s" }}
      />

      {/* technical grid, faded at the edges */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent_75%)]" />

      {/* floating particles */}
      {particles && (
        <div className="absolute inset-0">
          {dots.map((dot, index) => (
            <span
              key={index}
              className="absolute rounded-full bg-white animate-float"
              style={{
                left: dot.left,
                top: dot.top,
                width: dot.size,
                height: dot.size,
                opacity: dot.opacity,
                animationDelay: dot.delay,
                animationDuration: dot.duration,
                boxShadow: "0 0 10px rgba(255,255,255,0.6)",
              }}
            />
          ))}
        </div>
      )}

      {/* grain */}
      <div className="noise-overlay absolute inset-0" />

      {/* fade to page background at the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
