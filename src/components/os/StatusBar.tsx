"use client";

import { Wifi } from "lucide-react";
import { useClock } from "@/hooks/useClock";
import { useOSStore } from "@/store/osStore";
import { cn } from "@/lib/utils";

interface StatusBarProps {
  /** Hide the time (Lock screen shows its own large clock). */
  hideTime?: boolean;
  className?: string;
}

export function StatusBar({ hideTime = false, className }: StatusBarProps) {
  const { time, ready } = useClock();
  const batteryLevel = useOSStore((s) => s.batteryLevel);

  return (
    <header
      className={cn(
        "pointer-events-none absolute inset-x-0 top-[var(--os-safe-top)] z-40 flex h-[var(--os-status-height)] items-start justify-between px-7 pt-[0.95rem] text-[15px] font-semibold text-os-text-primary",
        className,
      )}
      aria-label="Status bar"
    >
      <time
        className={cn("min-w-[3.25rem] tabular-nums", hideTime && "invisible")}
        dateTime={ready ? time : undefined}
        suppressHydrationWarning
      >
        {ready ? time : " "}
      </time>

      <div className="flex items-center gap-1.5" aria-label="System status">
        <SignalBars />
        <Wifi className="h-[15px] w-[15px]" strokeWidth={2.5} aria-label="Wi-Fi connected" />
        <Battery level={batteryLevel} />
      </div>
    </header>
  );
}

function SignalBars() {
  return (
    <svg
      width="17"
      height="12"
      viewBox="0 0 17 12"
      fill="currentColor"
      aria-label="Cellular signal: full"
      role="img"
    >
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
    <svg
      width="27"
      height="13"
      viewBox="0 0 27 13"
      role="img"
      aria-label={`Battery ${level}%`}
      className="ml-0.5"
    >
      <rect
        x="0.5"
        y="0.5"
        width="22"
        height="12"
        rx="3.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.4"
      />
      <rect x="24" y="4" width="2.2" height="5" rx="1" fill="currentColor" fillOpacity="0.4" />
      <rect
        x="2.5"
        y="2.5"
        width={width}
        height="8"
        rx="2"
        fill={low ? "var(--os-danger)" : "currentColor"}
      />
    </svg>
  );
}
