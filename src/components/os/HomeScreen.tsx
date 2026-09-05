"use client";

import { Lock } from "lucide-react";
import { motion } from "motion/react";
import { homeRevealVariants, variantsFor } from "@/animations/osTransitions";
import { pickTransition } from "@/animations/spring";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { OWNER } from "@/lib/constants";
import { getGreeting } from "@/lib/utils";
import { useOSStore } from "@/store/osStore";

/**
 * Home screen shell (M1). The app grid, dock and app engine land in M3/M4;
 * this establishes layout, safe areas and the lock/unlock round-trip.
 */
export function HomeScreen() {
  const lock = useOSStore((s) => s.lock);
  const reduced = useOSReducedMotion();

  return (
    <motion.main
      aria-label="Home screen"
      className="absolute inset-0 z-10 flex flex-col os-wallpaper os-pt-safe os-pb-safe"
      variants={variantsFor(reduced, homeRevealVariants)}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pickTransition(reduced, "smooth")}
    >
      <div className="flex flex-1 flex-col px-7 pt-6">
        <p className="os-heading text-[1.9rem] leading-[1.15] text-os-text-primary">
          {getGreeting()},
          <br />
          Guest 👋
        </p>
        <p className="mt-3 text-[15px] text-os-text-secondary">Welcome to {OWNER.osName}.</p>

        {/* Placeholder for AppGrid (M3) */}
        <div
          aria-hidden
          className="mt-10 grid grid-cols-3 gap-x-4 gap-y-6"
        >
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 rounded-os-icon os-glass" />
              <div className="h-2.5 w-12 rounded-full bg-os-border" />
            </div>
          ))}
        </div>

        <div className="flex-1" />

        <div className="mb-4 flex items-center justify-between">
          <p className="text-[12px] text-os-text-tertiary">M1 · OS Kernel</p>
          <button
            type="button"
            onClick={lock}
            className="flex items-center gap-2 rounded-full os-glass px-4 py-2 text-[13px] font-medium text-os-text-primary outline-none transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-os-accent"
          >
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Lock
          </button>
        </div>
      </div>
    </motion.main>
  );
}
