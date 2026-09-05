"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { springs } from "@/animations/spring";
import type { AppDefinition } from "@/data/apps";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import type { AppId } from "@/store/osStore";

interface AppIconProps {
  app: AppDefinition;
  onOpen: (id: AppId) => void;
  /** Hide the text label (Dock). The accessible name is always present. */
  showLabel?: boolean;
  className?: string;
}

/**
 * Home-screen application icon. A real <button> with a spring press
 * (scale .94 → 1). Tint comes from `--os-tint-*` tokens via a CSS variable;
 * the gradient/depth treatment lives in the `os-app-icon` utility.
 */
export function AppIcon({ app, onOpen, showLabel = true, className }: AppIconProps) {
  const reduced = useOSReducedMotion();
  const Icon = app.icon;

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(app.id)}
      aria-label={`Open ${app.name}`}
      whileTap={reduced ? { opacity: 0.7 } : { scale: 0.94 }}
      transition={springs.snappy}
      className={cn(
        "group flex w-full flex-col items-center gap-1.5 outline-none select-none",
        className,
      )}
    >
      <span
        style={{ "--tint": `var(--os-tint-${app.tint})` } as CSSProperties}
        className={cn(
          "os-app-icon flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-os-icon",
          "group-focus-visible:ring-2 group-focus-visible:ring-os-accent group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-os-background",
        )}
      >
        <Icon className="h-[1.65rem] w-[1.65rem]" strokeWidth={1.9} aria-hidden />
      </span>
      {showLabel && (
        <span className="text-[12px] font-medium tracking-[-0.01em] text-os-text-primary">
          {app.label}
        </span>
      )}
    </motion.button>
  );
}
