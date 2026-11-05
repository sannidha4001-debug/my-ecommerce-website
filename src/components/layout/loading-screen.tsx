"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LogoMark } from "@/components/brand/logo";

const SESSION_KEY = "gx-loaded-once";

/**
 * Premium branded loading screen shown once per browser session.
 * Respects reduced motion and never blocks for more than ~1.5 seconds.
 */
export function LoadingScreen() {
  const [open, setOpen] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const alreadyLoaded = sessionStorage.getItem(SESSION_KEY);

    if (alreadyLoaded) {
      setOpen(false);
      return;
    }

    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(
      () => {
        setOpen(false);
        sessionStorage.setItem(SESSION_KEY, "1");
      },
      reduceMotion ? 250 : 1500,
    );

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[200] grid place-items-center overflow-hidden bg-[#07071a]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          role="status"
          aria-label="Loading GameXchange"
        >
          {/* faint aurora behind the logo */}
          <div className="pointer-events-none absolute inset-0 bg-aurora opacity-70" />
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />

          <div className="relative flex flex-col items-center gap-6">
            <div className="relative grid place-items-center">
              <motion.span
                className="absolute h-28 w-28 rounded-full border border-violet-400/30"
                animate={{ scale: [0.9, 1.5], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.span
                className="absolute h-20 w-20 rounded-full border border-cyan-300/30"
                animate={{ scale: [0.9, 1.7], opacity: [0.5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.5,
                }}
              />
              <motion.div
                initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <LogoMark className="h-16 w-16 rounded-2xl" animated />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-center"
            >
              <p className="font-display text-xl font-bold tracking-tight text-white">
                Game<span className="text-gradient-static">Xchange</span>
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-slate-400">
                Secure escrow marketplace
              </p>
            </motion.div>

            <div className="h-[3px] w-40 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-brand-gradient"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: reduceMotion ? 0.2 : 1.25,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
