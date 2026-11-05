"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Smooth transition whenever a public page changes. */
export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={reduceMotion ? undefined : { willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
