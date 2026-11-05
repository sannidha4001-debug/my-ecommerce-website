"use client";

import { useI18n } from "@/components/providers/i18n-provider";

/** Keyboard users can jump straight past the navigation. */
export function SkipLink() {
  const { isBangla } = useI18n();

  return (
    <a
      href="#main"
      className="sr-only z-[300] rounded-lg bg-brand-gradient px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      {isBangla ? "মূল কনটেন্টে যান" : "Skip to content"}
    </a>
  );
}
