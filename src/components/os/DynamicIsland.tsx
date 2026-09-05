"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { springs } from "@/animations/spring";
import { cn } from "@/lib/utils";

interface DynamicIslandProps {
  /** Optional expanded content (notifications, activity). */
  children?: ReactNode;
  expanded?: boolean;
  className?: string;
}

/**
 * The pill at the top of the screen. Static by default; can expand to
 * present transient system content. Uses `layout` so size changes spring.
 */
export function DynamicIsland({ children, expanded = false, className }: DynamicIslandProps) {
  return (
    <motion.div
      layout
      transition={springs.smooth}
      aria-hidden={!expanded}
      className={cn(
        "absolute left-1/2 top-[calc(var(--os-safe-top)+0.7rem)] z-50 flex -translate-x-1/2 items-center justify-center overflow-hidden rounded-full bg-os-island text-os-text-primary",
        expanded ? "h-[4.5rem] w-[82%] px-4" : "h-[2.15rem] w-[7.5rem]",
        className,
      )}
    >
      {expanded ? (
        children
      ) : (
        <span
          aria-hidden
          className="absolute right-[0.7rem] h-[0.55rem] w-[0.55rem] rounded-full bg-[#0f1520] shadow-[inset_0_0_2px_rgba(255,255,255,0.25)]"
        />
      )}
    </motion.div>
  );
}
