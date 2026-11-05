"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3 } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn, formatDuration } from "@/lib/utils";

/**
 * Live countdown.
 *
 * Pass `endsInHours` for demo/scheduled data. The absolute deadline is created
 * on the client after mount, which avoids React hydration mismatches. Real
 * auctions (Phase 5) will pass a fixed `endsAt` from the database.
 */
export function Countdown({
  endsInHours,
  endsAt,
  className,
  showIcon = true,
  label,
  live = false,
}: {
  endsInHours?: number;
  endsAt?: string | Date;
  className?: string;
  showIcon?: boolean;
  label?: string;
  live?: boolean;
}) {
  const { dict } = useI18n();
  const deadline = useMemo(() => {
    if (endsAt) return new Date(endsAt).getTime();
    if (typeof endsInHours === "number") return Date.now() + endsInHours * 3_600_000;
    return null;
  }, [endsAt, endsInHours]);

  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (deadline === null) return;
    setRemaining(Math.max(0, deadline - Date.now()));

    const interval = window.setInterval(() => {
      setRemaining(Math.max(0, deadline - Date.now()));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [deadline]);

  // Before hydration: reserve space with a neutral placeholder.
  if (remaining === null) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 tabular-nums", className)}>
        {showIcon && <Clock3 className="h-3.5 w-3.5" aria-hidden />}
        <span className="opacity-60">--:--:--</span>
      </span>
    );
  }

  const ended = remaining <= 0;
  const duration = formatDuration(remaining);
  const urgent = remaining > 0 && remaining < 30 * 60 * 1000;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold tabular-nums",
        urgent && !ended && "text-rose-300",
        className,
      )}
      aria-label={ended ? dict.common.ended : `${label ?? "Time left"}: ${duration.label}`}
    >
      {showIcon && <Clock3 className="h-3.5 w-3.5" aria-hidden />}
      {live && !ended && (
        <span className="relative flex h-1.5 w-1.5" aria-hidden>
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-400" />
        </span>
      )}
      <span>{ended ? dict.common.ended : duration.label}</span>
    </span>
  );
}
