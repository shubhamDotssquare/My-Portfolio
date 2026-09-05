"use client";

import { cn } from "@/lib/utils";

interface HomeIndicatorProps {
  /** When provided, the indicator becomes an accessible "go home" control. */
  onActivate?: () => void;
  /** Light variant for dark backgrounds (default) or dark for light content. */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Bottom home indicator bar. Decorative by default; when `onActivate` is
 * provided it becomes a real button (the non-gesture path to Home).
 */
export function HomeIndicator({ onActivate, tone = "light", className }: HomeIndicatorProps) {
  const bar = (
    <span
      className={cn(
        "block h-[5px] w-[8.5rem] rounded-full",
        tone === "light" ? "bg-os-text-primary/70" : "bg-os-background/70",
      )}
    />
  );

  const position =
    "absolute inset-x-0 bottom-[calc(var(--os-safe-bottom)+0.55rem)] z-40 flex justify-center";

  if (!onActivate) {
    return (
      <div aria-hidden className={cn(position, "pointer-events-none", className)}>
        {bar}
      </div>
    );
  }

  return (
    <div className={cn(position, className)}>
      <button
        type="button"
        onClick={onActivate}
        aria-label="Go to Home Screen"
        className="rounded-full px-4 py-2 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-os-accent"
      >
        {bar}
      </button>
    </div>
  );
}
