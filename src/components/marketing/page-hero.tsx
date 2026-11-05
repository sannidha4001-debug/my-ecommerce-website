import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { AuroraBackground } from "@/components/marketing/aurora-background";

/** Shared compact hero for inner pages. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  homeLabel,
  currentLabel,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  homeLabel: string;
  currentLabel: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-10 pt-10 sm:pt-14">
      <AuroraBackground particles={false} />
      <div className="container relative z-10">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
        >
          <Link href="/" className="transition hover:text-foreground">
            {homeLabel}
          </Link>
          <ChevronRight className="h-3 w-3" aria-hidden />
          <span className="text-foreground/80">{currentLabel}</span>
        </nav>

        <div className="mt-6 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-[46px]">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>
          {children}
        </div>
      </div>
    </section>
  );
}
