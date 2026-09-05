import type { Transition } from "motion/react";

/**
 * Centralized motion tokens. Components import from here rather than
 * declaring ad-hoc spring values.
 */
export const springs = {
  /** Button presses, toggles, small UI feedback */
  snappy: { type: "spring", stiffness: 500, damping: 35 },
  /** Screen and app transitions */
  smooth: { type: "spring", stiffness: 300, damping: 30 },
  /** Large surfaces, sheets, ambient movement */
  gentle: { type: "spring", stiffness: 180, damping: 24 },
} as const satisfies Record<string, Transition>;

export const fades = {
  quick: { duration: 0.15, ease: "easeOut" },
  standard: { duration: 0.25, ease: "easeOut" },
  slow: { duration: 0.4, ease: "easeInOut" },
} as const satisfies Record<string, Transition>;

export type SpringName = keyof typeof springs;

/**
 * Pick a transition, falling back to a short fade when motion is reduced.
 * Reduced-motion mode replaces elaborate transitions with brief fades.
 */
export function pickTransition(reduced: boolean, spring: SpringName = "smooth"): Transition {
  return reduced ? fades.quick : springs[spring];
}
