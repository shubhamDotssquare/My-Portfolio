"use client";

import { useSyncExternalStore } from "react";
import { DESKTOP_MIN_WIDTH } from "@/lib/constants";

export type DeviceMode = "mobile" | "desktop";

const QUERY = `(min-width: ${DESKTOP_MIN_WIDTH}px)`;

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): DeviceMode {
  return window.matchMedia(QUERY).matches ? "desktop" : "mobile";
}

function getServerSnapshot(): DeviceMode {
  return "desktop";
}

/**
 * "desktop" → the virtual phone frame is shown.
 * "mobile"  → the browser viewport itself is the OS.
 *
 * Layout is handled in CSS (see PhoneFrame); use this hook only for
 * behavioural differences (gesture thresholds, safe areas, etc).
 */
export function useDeviceMode(): DeviceMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
