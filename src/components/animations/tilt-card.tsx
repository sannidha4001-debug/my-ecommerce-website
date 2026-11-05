"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * 3D hover tilt with a moving light glare. Used on listing and auction cards.
 *
 * The springs are deliberately soft (low stiffness, high damping) so the card
 * glides after the cursor instead of snapping. The component also writes
 * `--glare-x/y` straight to the DOM instead of React state, which avoids a
 * re-render on every pointer move.
 *
 * Falls back to a plain container when reduced motion is requested.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 5,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), {
    stiffness: 150,
    damping: 22,
    mass: 0.6,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), {
    stiffness: 150,
    damping: 22,
    mass: 0.6,
  });

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType === "touch") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    px.set(x);
    py.set(y);
    ref.current?.style.setProperty("--glare-x", `${x * 100}%`);
    ref.current?.style.setProperty("--glare-y", `${y * 100}%`);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={
        reduceMotion
          ? undefined
          : {
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              willChange: "transform",
            }
      }
      className={cn("group/tilt perspective-1000 relative", className)}
    >
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-500 ease-out group-hover/tilt:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.10), transparent 45%)",
        }}
        aria-hidden="true"
      />
      {children}
    </motion.div>
  );
}
