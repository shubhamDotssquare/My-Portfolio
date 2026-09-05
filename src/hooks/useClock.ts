"use client";

import { useEffect, useState } from "react";
import { formatClockTime, formatMonthDay, formatWeekday } from "@/lib/utils";

export interface ClockState {
  /** "9:41" */
  time: string;
  /** "Thursday" */
  weekday: string;
  /** "September 3" */
  monthDay: string;
  /** false during SSR / before first client tick */
  ready: boolean;
}

const EMPTY: ClockState = { time: "", weekday: "", monthDay: "", ready: false };

function read(): ClockState {
  const now = new Date();
  return {
    time: formatClockTime(now),
    weekday: formatWeekday(now),
    monthDay: formatMonthDay(now),
    ready: true,
  };
}

/** Live clock, updating on the minute boundary. Hydration-safe. */
export function useClock(): ClockState {
  const [state, setState] = useState<ClockState>(EMPTY);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      setState(read());
      const msToNextMinute = 60_000 - (Date.now() % 60_000);
      timeout = setTimeout(tick, msToNextMinute + 20);
    };

    tick();
    return () => clearTimeout(timeout);
  }, []);

  return state;
}
