"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldAlert, X } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";

const DISMISS_KEY = "gx-warning-dismissed";

/**
 * Site-wide anti-scam reminder. Loaded above the navbar, dismissible for the
 * current session. Phase 5 will let the admin edit this message from settings.
 */
export function WarningBanner() {
  const { dict } = useI18n();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) === "1") {
      setVisible(false);
    }
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative z-[60] overflow-hidden border-b border-amber-400/20 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-violet-500/10 backdrop-blur-md"
        >
          <div className="container flex items-center gap-3 py-2 text-[11px] leading-snug sm:text-xs">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
            <p className="flex-1 text-foreground/80">
              <strong className="font-semibold text-amber-300">
                {dict.home.scamWarning.strong}
              </strong>{" "}
              {dict.home.scamWarning.text}
            </p>
            <button
              type="button"
              onClick={dismiss}
              aria-label={dict.home.scamWarning.dismiss}
              className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-foreground/50 transition hover:bg-white/10 hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
