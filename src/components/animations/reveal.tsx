"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Shared motion feel.
 *
 * One easing curve for the whole app keeps transitions predictable. It is a
 * slow-out "expo" curve: quick to start, gentle to settle, which reads as
 * smoother than a linear or sharp ease.
 */
const EASE_SMOOTH = [0.16, 1, 0.3, 1] as const;

/**
 * Scroll-triggered reveal. Fades and lifts content into view exactly once.
 * Uses `amount` (not a negative margin) so the animation starts when a real
 * portion of the element is visible — this avoids sudden pops on tall sections.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.18 }}
      transition={{ duration: 0.75, delay, ease: EASE_SMOOTH }}
      style={reduceMotion ? undefined : { willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}

/** Parent wrapper for staggered children (pair with <StaggerItem>). */
export function Stagger({
  children,
  className,
  delayChildren = 0.04,
  staggerChildren = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}) {
  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: {},
        visible: { transition: { delayChildren, staggerChildren } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.65, ease: EASE_SMOOTH },
        },
      }}
      style={reduceMotion ? undefined : { willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
