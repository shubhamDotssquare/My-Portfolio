"use client";

import { Wifi } from "lucide-react";
import { motion, type PanInfo } from "motion/react";
import { useRef } from "react";
import { useClock } from "@/hooks/useClock";
import { cn } from "@/lib/utils";
import { useOSStore } from "@/store/osStore";

interface StatusBarProps {
  /** Hide the time (Lock screen shows its own large clock). */
  hideTime?: boolean;
  /** Tap or swipe-down on the left (time) opens Notification Center. */
  onOpenNotifications?: () => void;
  /** Tap or swipe-down on the right (status icons) opens Control Center. */
  onOpenControlCenter?: () => void;
  className?: string;
}

const SWIPE_DOWN_PX = 40;
const CLICK_GRACE_MS = 250;

export function StatusBar({ hideTime = false, onOpenNotifications, onOpenControlCenter, className }: StatusBarProps) {
  const { time, ready } = useClock();
  const batteryLevel = useOSStore((s) => s.batteryLevel);

  // A pan may end with a synthetic click on the same button; if the swipe
  // already opened the overlay, ignore that button's clicks briefly so it
  // isn't toggled straight back. Time-based per button, because a release
  // outside the button produces no click at all.
  const left = useGestureButton(onOpenNotifications);
  const right = useGestureButton(onOpenControlCenter);

  const clock = (
    <time
      className={cn("min-w-[3.25rem] tabular-nums", hideTime && "invisible")}
      dateTime={ready ? time : undefined}
      suppressHydrationWarning
    >
      {ready ? time : " "}
    </time>
  );

  const status = (
    <span className="flex items-center gap-1.5">
      <SignalBars />
      <Wifi className="h-[15px] w-[15px]" strokeWidth={2.5} aria-label="Wi-Fi connected" />
      <Battery level={batteryLevel} />
    </span>
  );

  return (
    <header
      className={cn(
        "pointer-events-none absolute inset-x-0 top-[var(--os-safe-top)] z-40 flex h-[var(--os-status-height)] items-start justify-between px-5 pt-[0.55rem] text-[15px] font-semibold text-os-text-primary",
        className,
      )}
      aria-label="Status bar"
    >
      {onOpenNotifications && !hideTime ? (
        <motion.button
          type="button"
          onClick={left.onClick}
          onPanEnd={left.onPanEnd}
          aria-label="Open Notification Center"
          className="pointer-events-auto rounded-full px-2 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-os-accent touch-none"
        >
          {clock}
        </motion.button>
      ) : (
        <span className="px-2 py-1.5">{clock}</span>
      )}

      {onOpenControlCenter ? (
        <motion.button
          type="button"
          onClick={right.onClick}
          onPanEnd={right.onPanEnd}
          aria-label="Open Control Center"
          className="pointer-events-auto rounded-full px-2 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-os-accent touch-none"
        >
          {status}
        </motion.button>
      ) : (
        <span className="px-2 py-1.5" aria-label="System status">
          {status}
        </span>
      )}
    </header>
  );
}

function useGestureButton(handler?: () => void) {
  const ignoreClicksUntil = useRef(0);
  return {
    onPanEnd: (_: unknown, info: PanInfo) => {
      if (handler && info.offset.y > SWIPE_DOWN_PX) {
        ignoreClicksUntil.current = Date.now() + CLICK_GRACE_MS;
        handler();
      }
    },
    onClick: () => {
      if (Date.now() < ignoreClicksUntil.current) return;
      handler?.();
    },
  };
}

function SignalBars() {
  return (
    <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" aria-label="Cellular signal: full" role="img">
      <rect x="0" y="8" width="3" height="4" rx="0.75" />
      <rect x="4.5" y="6" width="3" height="6" rx="0.75" />
      <rect x="9" y="3" width="3" height="9" rx="0.75" />
      <rect x="13.5" y="0" width="3" height="12" rx="0.75" />
    </svg>
  );
}

function Battery({ level }: { level: number }) {
  const width = Math.max(2, Math.round((level / 100) * 18));
  const low = level <= 20;

  return (
    <svg width="27" height="13" viewBox="0 0 27 13" role="img" aria-label={`Battery ${level}%`} className="ml-0.5">
      <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke="currentColor" strokeOpacity="0.4" />
      <rect x="24" y="4" width="2.2" height="5" rx="1" fill="currentColor" fillOpacity="0.4" />
      <rect x="2.5" y="2.5" width={width} height="8" rx="2" fill={low ? "var(--os-danger)" : "currentColor"} />
    </svg>
  );
}
