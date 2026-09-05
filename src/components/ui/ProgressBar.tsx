"use client";

import { motion } from "motion/react";
import { fades, springs } from "@/animations/spring";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { clamp, cn } from "@/lib/utils";

interface ProgressBarProps {
  /** 0–100 */
  value: number;
  label: string;
  /** Fill uses `--tint` when true, otherwise the accent. */
  tinted?: boolean;
  className?: string;
}

export function ProgressBar({ value, label, tinted = false, className }: ProgressBarProps) {
  const reduced = useOSReducedMotion();
  const v = clamp(Math.round(value), 0, 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-os-border", className)}
    >
      <motion.div
        className={cn("h-full rounded-full", tinted ? "bg-[var(--tint)]" : "bg-os-accent")}
        initial={false}
        animate={{ width: `${v}%` }}
        transition={reduced ? fades.quick : springs.smooth}
      />
    </div>
  );
}
