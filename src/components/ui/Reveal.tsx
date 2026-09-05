"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { fades, springs } from "@/animations/spring";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";

interface RevealProps {
  children: ReactNode;
  /** Stagger position; delay is capped so long lists don't crawl. */
  index?: number;
  className?: string;
}

/** Fade-up on mount for content blocks. Opacity-only under reduced motion. */
export function Reveal({ children, index = 0, className }: RevealProps) {
  const reduced = useOSReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? fades.quick : { ...springs.smooth, delay: Math.min(index, 8) * 0.045 }}
    >
      {children}
    </motion.div>
  );
}
