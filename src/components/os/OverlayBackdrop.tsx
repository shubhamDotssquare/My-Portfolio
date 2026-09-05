"use client";

import { motion } from "motion/react";
import { fades } from "@/animations/spring";
import { cn } from "@/lib/utils";

interface OverlayBackdropProps {
  onClose: () => void;
  label?: string;
  className?: string;
}

/** Dimmed, blurred scrim behind a system overlay. Clicking it closes the overlay. */
export function OverlayBackdrop({ onClose, label = "Close", className }: OverlayBackdropProps) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: "none" }}
      transition={fades.standard}
      className={cn(
        "absolute inset-0 z-[34] cursor-default bg-black/45 outline-none backdrop-blur-[var(--os-blur-md)]",
        className,
      )}
    />
  );
}
