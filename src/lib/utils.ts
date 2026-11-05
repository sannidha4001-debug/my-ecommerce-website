import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional Tailwind classes without conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Bangladeshi Taka, e.g. 12500 -> "৳12,500". */
export function formatBDT(amount: number, options?: { compact?: boolean }) {
  if (options?.compact && amount >= 100000) {
    const lakhs = amount / 100000;
    return `৳${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
  }
  return `৳${new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

/** Format large counts, e.g. 12400 -> "12.4K". */
export function formatCount(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Display a public username with partial masking, e.g. "rafi_99" -> "ra***99".
 * Used on bid history so bidders cannot reliably identify each other.
 */
export function maskUsername(username: string) {
  if (username.length <= 3) return `${username[0] ?? ""}**`;
  const start = username.slice(0, 2);
  const end = username.slice(-2);
  return `${start}***${end}`;
}

/** Split a date into a stable countdown payload (milliseconds remaining). */
export function millisecondsUntil(target: string | number | Date) {
  return Math.max(0, new Date(target).getTime() - Date.now());
}

/** Format milliseconds as HH:MM:SS (or DDd HHh for long auctions). */
export function formatDuration(ms: number) {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, label: "Ended" };
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const label =
    days > 0
      ? `${days}d ${String(hours).padStart(2, "0")}h`
      : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
          seconds,
        ).padStart(2, "0")}`;
  return { days, hours, minutes, seconds, label };
}

/** Clamp a number between a minimum and maximum. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
