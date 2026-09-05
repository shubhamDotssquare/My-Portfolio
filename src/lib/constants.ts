/** Reference device dimensions (desktop virtual phone). */
export const DEVICE = {
  width: 390,
  height: 844,
  aspect: "390 / 844",
} as const;

/** Boot screen */
export const BOOT_DURATION_MS = 1300;
export const BOOT_DURATION_REDUCED_MS = 450;
export const SESSION_BOOTED_KEY = "shubham-os:booted";

/** Lock screen unlock gesture */
export const UNLOCK_DISTANCE_PX = 110;
export const UNLOCK_VELOCITY = 600;

/** Breakpoint above which the desktop phone frame is shown (matches Tailwind `md`). */
export const DESKTOP_MIN_WIDTH = 768;

export const OWNER = {
  name: "Shubham",
  title: "Mobile Developer",
  osName: "SHUBHAM OS",
} as const;

/** App icon corner radius in px — mirrors `--radius-os-icon`; Motion needs a number to morph it. */
export const ICON_RADIUS_PX = 18;
