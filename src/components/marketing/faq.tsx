"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MessageCircle, Minus, Plus } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";

export function FAQ() {
  const { dict } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();
  const t = dict.home.faq;

  return (
    <section className="relative py-20 sm:py-24" id="faq">
      <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* Left: intro + support card */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              {t.eyebrow}
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl">
              {t.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t.subtitle}
            </p>

            <div className="glass mt-7 rounded-2xl p-5">
              <p className="text-sm font-semibold">{t.stillQuestions}</p>
              <Button asChild size="sm" variant="secondary" className="mt-3">
                <Link href="/contact">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {t.contact}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Right: accordion */}
        <div className="space-y-2.5">
          {t.items.map((item, index) => {
            const open = openIndex === index;
            return (
              <Reveal key={item.q} delay={index * 0.04}>
                <div
                  className={`overflow-hidden rounded-xl border transition-colors ${
                    open
                      ? "border-primary/30 bg-primary/[0.05]"
                      : "border-border/70 bg-card/30 hover:border-border"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : index)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-button-${index}`}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                  >
                    <span className="text-sm font-medium text-foreground">{item.q}</span>
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-colors ${
                        open
                          ? "border-primary/30 bg-primary/20 text-primary"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`faq-panel-${index}`}
                        role="region"
                        aria-labelledby={`faq-button-${index}`}
                        initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <p className="px-4 pb-4 text-xs leading-relaxed text-muted-foreground">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
