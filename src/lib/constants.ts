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

/** Viewport needed for the desktop phone frame (matches the `desktop` CSS variant). */
export const DESKTOP_MIN_WIDTH = 768;
export const DESKTOP_MIN_HEIGHT = 560;
/** Below this height the `short` CSS variant applies (compact Lock/Home). */
export const SHORT_VIEWPORT_PX = 640;
/** Bezel box around the 390×844 screen (10px padding each side). */
export const FRAME_BOX = { width: 410, height: 864 } as const;

export const OWNER = {
  name: "Shubham",
  title: "Mobile Developer",
  osName: "SHUBHAM OS",
} as const;

/** App icon corner radius in px — mirrors `--radius-os-icon`; Motion needs a number to morph it. */
export const ICON_RADIUS_PX = 18;
