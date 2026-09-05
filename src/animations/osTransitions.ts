import type { Variants } from "motion/react";

/**
 * Shared screen-level variants. Reduced-motion variants swap spatial
 * movement for opacity-only changes.
 */

export const screenFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

/** Lock screen lifts away upward, revealing Home beneath. */
export const lockScreenVariants: Variants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: "-18%", scale: 1.02 },
};

/** Home settles in from slightly scaled-down/blurred state. */
export const homeRevealVariants: Variants = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

/** Boot screen dissolves. */
export const bootVariants: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 0, scale: 1.04 },
};

/** Utility: given a reduced flag, choose spatial or fade-only variants. */
export function variantsFor(reduced: boolean, spatial: Variants): Variants {
  return reduced ? screenFade : spatial;
}
