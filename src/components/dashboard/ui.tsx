"use client";

import type { ComponentType, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { Badge } from "@/components/ui/badge";
import {
  ESCROW_FLOW,
  escrowStatusLabel,
  escrowStatusTone,
  type EscrowStatus,
} from "@/lib/account";
import { cn } from "@/lib/utils";

/** Tiny bilingual helper: tr("English", "বাংলা"). */
export function useT() {
  const { isBangla } = useI18n();
  return (en: string, bn: string) => (isBangla ? bn : en);
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "violet",
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
  tone?: "violet" | "emerald" | "amber" | "cyan" | "rose";
}) {
  const tones = {
    violet: "text-violet-300 bg-violet-500/10 border-violet-400/20",
    emerald: "text-emerald-300 bg-emerald-500/10 border-emerald-400/20",
    amber: "text-amber-300 bg-amber-500/10 border-amber-400/20",
    cyan: "text-cyan-300 bg-cyan-500/10 border-cyan-400/20",
    rose: "text-rose-300 bg-rose-500/10 border-rose-400/20",
  };
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <span className={cn("grid h-8 w-8 place-items-center rounded-lg border", tones[tone])}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 font-display text-xl font-bold tabular-nums">{value}</p>
      {hint && <p className="mt-0.5 text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  body,
  actionHref,
  actionLabel,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="glass flex flex-col items-center rounded-2xl px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </span>
      <p className="mt-4 font-display text-base font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">{body}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          {actionLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

export function OrderStatusBadge({ status }: { status: EscrowStatus }) {
  const { isBangla } = useI18n();
  return (
    <Badge variant={escrowStatusTone[status]}>
      {isBangla ? escrowStatusLabel[status].bn : escrowStatusLabel[status].en}
    </Badge>
  );
}

/** Five-step escrow rail with completed / current / paused states. */
export function EscrowRail({ status }: { status: EscrowStatus }) {
  const { isBangla } = useI18n();
  const side = status === "disputed" || status === "refunded" || status === "cancelled";
  const index = ESCROW_FLOW.indexOf(status);
  return (
    <ol className="mt-4 grid grid-cols-5 gap-1" aria-label="Escrow progress">
      {ESCROW_FLOW.map((step, i) => {
        const done = !side && i <= index;
        const current = !side && i === index;
        return (
          <li key={step} className="min-w-0">
            <span
              className={cn(
                "block h-1 rounded-full transition-colors",
                side
                  ? "bg-rose-500/40"
                  : done
                    ? "bg-gradient-to-r from-violet-500 to-cyan-400"
                    : "bg-white/10",
              )}
            />
            <span
              className={cn(
                "mt-1.5 block truncate text-[8px] leading-tight sm:text-[9px]",
                current ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
            >
              {isBangla ? escrowStatusLabel[step].bn : escrowStatusLabel[step].en}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="font-display text-sm font-semibold">{children}</h2>
      {action}
    </div>
  );
}
