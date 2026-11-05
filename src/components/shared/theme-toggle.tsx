"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { dict } = useI18n();

  // Avoid rendering a mismatched icon during server hydration.
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-white/[0.04] text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground",
        className,
      )}
      aria-label={dict.nav.toggleTheme}
      title={dict.nav.toggleTheme}
    >
      <motion.span
        key={mounted ? resolvedTheme : "placeholder"}
        initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="grid place-items-center"
      >
        {mounted && isDark ? (
          <Sun className="h-4 w-4 text-amber-300" />
        ) : (
          <Moon className="h-4 w-4 text-violet-400" />
        )}
      </motion.span>
    </button>
  );
}
