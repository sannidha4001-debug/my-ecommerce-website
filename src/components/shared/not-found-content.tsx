"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Compass, Home, SearchX } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { AuroraBackground } from "@/components/marketing/aurora-background";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

/** Animated 404 page, intentionally kept inside the minimal root shell. */
export function NotFoundContent() {
  const { dict } = useI18n();
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden">
      <AuroraBackground />

      <header className="container relative z-10 flex h-20 items-center">
        <Logo />
      </header>

      <main className="container relative z-10 flex flex-1 flex-col items-center justify-center pb-24 text-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
            <span className="h-40 w-40 rounded-full bg-violet-500/20 blur-[80px]" />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
            <SearchX className="h-3 w-3 text-violet-300" aria-hidden />
            Error {dict.notFound.code}
          </div>

          <h1
            className="mt-6 select-none font-display text-[7rem] font-black leading-none tracking-tighter text-gradient sm:text-[10rem]"
            aria-label="404"
          >
            404
          </h1>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-lg"
        >
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {dict.notFound.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {dict.notFound.subtitle}
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/">
                <Home className="h-4 w-4" />
                {dict.notFound.home}
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/marketplace">
                <Compass className="h-4 w-4" />
                {dict.notFound.marketplace}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-muted-foreground">
            <Link href="/how-it-works" className="transition hover:text-foreground">
              {dict.nav.howItWorks}
            </Link>
            <span className="h-1 w-1 rounded-full bg-border" aria-hidden />
            <Link href="/about" className="transition hover:text-foreground">
              {dict.nav.about}
            </Link>
            <span className="h-1 w-1 rounded-full bg-border" aria-hidden />
            <Link href="/contact" className="transition hover:text-foreground">
              {dict.nav.contact}
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
