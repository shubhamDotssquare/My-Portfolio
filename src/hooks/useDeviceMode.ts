"use client";

import { useSyncExternalStore } from "react";
import { DESKTOP_MIN_HEIGHT, DESKTOP_MIN_WIDTH, FRAME_BOX } from "@/lib/constants";

export type DeviceMode = "mobile" | "desktop";

const QUERY = `(min-width: ${DESKTOP_MIN_WIDTH}px) and (min-height: ${DESKTOP_MIN_HEIGHT}px)`;

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

/* ------------------------------------------------------------------ */

const STAGE_INSET_X = 48; // stage padding
const STAGE_INSET_Y = 128; // stage padding + caption + hints

function subscribeResize(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getScale(): number {
  if (!window.matchMedia(QUERY).matches) return 1;
  const byHeight = (window.innerHeight - STAGE_INSET_Y) / FRAME_BOX.height;
  const byWidth = (window.innerWidth - STAGE_INSET_X) / FRAME_BOX.width;
  return Math.min(1, byHeight, byWidth);
}

/**
 * Desktop: the 390×844 device is laid out at its reference size and scaled
 * (transform) to fit the viewport, so typography and spacing never reflow —
 * a smaller window shows a proportionally smaller phone. Mobile: always 1.
 * Server snapshot is 1; the client corrects after hydration.
 */
export function useDeviceScale(): number {
  return useSyncExternalStore(subscribeResize, getScale, () => 1);
}
