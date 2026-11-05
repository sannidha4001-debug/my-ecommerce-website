import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/animations/reveal";

/** Consistent section intro used across the marketing pages. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  titleClassName,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "max-w-3xl font-display text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[42px]",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
