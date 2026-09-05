"use client";

import { useReducedMotion as useSystemReducedMotion } from "motion/react";
import { useOSStore } from "@/store/osStore";

/**
 * True when motion should be minimized — either the OS user disabled it
 * via Control Center, or the system prefers reduced motion.
 */
export function useOSReducedMotion(): boolean {
  const systemReduced = useSystemReducedMotion();
  const motionEnabled = useOSStore((s) => s.motionEnabled);
  return Boolean(systemReduced) || !motionEnabled;
}
