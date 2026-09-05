"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { fades } from "@/animations/spring";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import {
  BOOT_DURATION_MS,
  BOOT_DURATION_REDUCED_MS,
  OWNER,
  SESSION_BOOTED_KEY,
} from "@/lib/constants";
import { session } from "@/lib/utils";
import { useOSStore } from "@/store/osStore";

type Phase = "init" | "ready";

/**
 * First-visit boot sequence. 1–1.5s, reduced-motion aware, never blocks:
 * the visitor can tap/press to skip straight to the Lock screen.
 */
export function BootScreen() {
  const completeBoot = useOSStore((s) => s.completeBoot);
  const reduced = useOSReducedMotion();
  const [phase, setPhase] = useState<Phase>("init");

  const duration = reduced ? BOOT_DURATION_REDUCED_MS : BOOT_DURATION_MS;

  useEffect(() => {
    const readyAt = setTimeout(() => setPhase("ready"), duration * 0.72);
    const doneAt = setTimeout(() => {
      session.set(SESSION_BOOTED_KEY, "1");
      completeBoot();
    }, duration);

    return () => {
      clearTimeout(readyAt);
      clearTimeout(doneAt);
    };
  }, [duration, completeBoot]);

  const skip = () => {
    session.set(SESSION_BOOTED_KEY, "1");
    completeBoot();
  };

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={`${OWNER.osName} is starting`}
      onClick={skip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "Escape") skip();
      }}
      tabIndex={0}
      className="absolute inset-0 z-[60] flex cursor-default flex-col items-center justify-center bg-os-background outline-none select-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reduced ? 1 : 1.03 }}
      transition={fades.standard}
    >
      <motion.h1
        className="os-heading text-[1.35rem] tracking-[0.22em] text-os-text-primary"
        initial={{ opacity: 0, y: reduced ? 0 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {OWNER.osName}
      </motion.h1>

      <p className="mt-3 h-5 text-[13px] text-os-text-tertiary">
        {phase === "init" ? "Initializing..." : "System Ready"}
      </p>

      <div
        className="mt-6 h-[3px] w-40 overflow-hidden rounded-full bg-os-border"
        role="progressbar"
        aria-label="Boot progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={phase === "ready" ? 100 : undefined}
      >
        <motion.div
          className="h-full rounded-full bg-os-text-primary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: duration / 1000 * 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <span className="absolute bottom-[calc(var(--os-safe-bottom)+2.5rem)] text-[11px] tracking-[0.14em] text-os-text-tertiary/70 uppercase">
        Tap to skip
      </span>
    </motion.div>
  );
}
