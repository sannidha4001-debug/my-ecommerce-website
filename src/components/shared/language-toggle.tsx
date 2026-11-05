"use client";

import { Languages } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/components/providers/i18n-provider";
import { localeLabels } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Accessible two-option language switcher with an animated active pill.
 * The choice is stored in a cookie so the server renders the right language
 * on the next visit.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, dict } = useI18n();

  return (
    <div
      className={cn(
        "relative flex items-center gap-0.5 rounded-lg border border-border bg-white/[0.04] p-0.5",
        className,
      )}
      role="group"
      aria-label={dict.nav.switchLanguage}
    >
      <Languages className="ml-1.5 mr-0.5 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
      {(["en", "bn"] as const).map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            className={cn(
              "relative rounded-md px-1.5 py-1 text-[11px] font-semibold transition-colors",
              active ? "text-white" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="active-language-pill"
                className="absolute inset-0 rounded-md bg-brand-gradient shadow-[0_2px_10px_-2px_rgba(99,102,241,0.8)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative">{code === "en" ? "EN" : localeLabels.bn}</span>
          </button>
        );
      })}
    </div>
  );
}
