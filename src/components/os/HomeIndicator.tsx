"use client";

import { motion, type PanInfo } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface HomeIndicatorProps {
  /** Tap (or short swipe up) → Home. When absent the indicator is decorative. */
  onActivate?: () => void;
  /** Swipe up and hold → App Switcher. */
  onHold?: () => void;
  tone?: "light" | "dark";
  className?: string;
}

const HOLD_DISTANCE_PX = 45;
const HOLD_MS = 320;
const HOLD_STILL_PX = 10;
const FLICK_DISTANCE_PX = 40;
const CLICK_GRACE_MS = 400;

/**
 * Bottom home indicator. Decorative on Boot/Lock; otherwise a real button
 * (tap → Home) with the OS swipe gestures layered on top. The App Switcher
 * is also reachable via Control Center and the S key, so the hold gesture
 * is never the only path.
 */
export function HomeIndicator({ onActivate, onHold, tone = "light", className }: HomeIndicatorProps) {
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const armedAtY = useRef<number | null>(null);
  const fired = useRef(false);
  // A drag may end with a synthetic click on the button; ignore clicks for a
  // short window after any drag so a completed gesture isn't undone by "Go Home".
  const ignoreClicksUntil = useRef(0);

  const clearHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
    armedAtY.current = null;
  };

  useEffect(() => {
    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
  }, []);

  const onDragStart = () => {
    fired.current = false;
  };

  // Motion reports drag every frame while the pointer is down, so only
  // re-arm the hold timer when the finger has actually moved since arming.
  const onDrag = (_: unknown, info: PanInfo) => {
    if (!onHold || fired.current) return;
    const y = info.offset.y;
    if (y >= -HOLD_DISTANCE_PX) {
      clearHold();
      return;
    }
    if (armedAtY.current !== null && Math.abs(y - armedAtY.current) < HOLD_STILL_PX) return;
    clearHold();
    armedAtY.current = y;
    // Swipe up, then pause → switcher.
    holdTimer.current = setTimeout(() => {
      fired.current = true;
      onHold();
    }, HOLD_MS);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    clearHold();
    ignoreClicksUntil.current = Date.now() + CLICK_GRACE_MS;
    if (!fired.current && onActivate && info.offset.y < -FLICK_DISTANCE_PX) onActivate();
  };

  const bar = (
    <span
      className={cn(
        "block h-[5px] w-[8.5rem] rounded-full",
        tone === "light" ? "bg-os-text-primary/70" : "bg-os-background/70",
      )}
    />
  );

  const position = "absolute inset-x-0 bottom-[calc(var(--os-safe-bottom)+0.55rem)] z-40 flex justify-center";

  if (!onActivate && !onHold) {
    return (
      <div aria-hidden className={cn(position, "pointer-events-none", className)}>
        {bar}
      </div>
    );
  }

  return (
    <div className={cn(position, className)}>
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.25, bottom: 0 }}
        dragMomentum={false}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        className="touch-none"
      >
        <button
          type="button"
          onClick={() => {
            if (Date.now() < ignoreClicksUntil.current) return;
            onActivate?.();
          }}
          aria-label="Go to Home Screen"
          className="rounded-full px-6 py-3 outline-none focus-visible:ring-2 focus-visible:ring-os-accent"
        >
          {bar}
        </button>
      </motion.div>
    </div>
  );
}
