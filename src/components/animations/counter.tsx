"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

type CounterProps = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

/** Animated number that counts up the first time it scrolls into view. */
export function Counter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.8,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }

    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        setDisplay(latest);
      },
    });

    return () => controls.stop();
  }, [inView, value, duration, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      <span className="tabular-nums">
        {prefix}
        {display.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
        {suffix}
      </span>
    </span>
  );
}
