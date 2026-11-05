"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Gently pulls its child toward the cursor — the classic "magnetic button"
 * micro-interaction. The spring is soft so the button drifts rather than
 * snapping, and it resets slowly when the pointer leaves.
 *
 * Disabled on reduced-motion and touch-only devices.
 */
export function Magnetic({
  children,
  className,
  strength = 0.18,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useSpring(0, { stiffness: 150, damping: 20, mass: 0.6 });
  const y = useSpring(0, { stiffness: 150, damping: 20, mass: 0.6 });

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType === "touch") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((event.clientX - rect.left - rect.width / 2) * strength);
    y.set((event.clientY - rect.top - rect.height / 2) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={cn("inline-flex", className)}
      style={{
        x,
        y,
        willChange: "transform",
      }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
    </motion.div>
  );
}
