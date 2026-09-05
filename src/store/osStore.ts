import { create } from "zustand";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type OSMode =
  | "boot"
  | "lock"
  | "home"
  | "app"
  | "control-center"
  | "notifications"
  | "spotlight"
  | "app-switcher";

export type AppId =
  | "about"
  | "projects"
  | "case-studies"
  | "developer-lab"
  | "experience"
  | "architecture"
  | "contact"
  | "resume";

export type OverlayMode = Extract<
  OSMode,
  "control-center" | "notifications" | "spotlight" | "app-switcher"
>;

export type PerformanceMode = "high" | "balanced";

export interface OSState {
  mode: OSMode;
  currentApp: AppId | null;
  previousApp: AppId | null;
  recentApps: AppId[];

  isLocked: boolean;
  isControlCenterOpen: boolean;
  isNotificationCenterOpen: boolean;
  isSpotlightOpen: boolean;

  isDarkMode: boolean;
  motionEnabled: boolean;
  soundEnabled: boolean;
  performanceMode: PerformanceMode;
  batteryLevel: number;
}

export interface OSActions {
  /** Boot → Lock */
  completeBoot: () => void;
  /** Lock → Home */
  unlock: () => void;
  /** Any → Lock */
  lock: () => void;

  /** Open an application (Home/App → App) */
  openApp: (id: AppId) => void;
  /** Close current application (App → Home) */
  closeApp: () => void;
  /** Return to Home from anywhere unlocked, closing overlays. */
  goHome: () => void;

  /** System overlays */
  openOverlay: (overlay: OverlayMode) => void;
  closeOverlay: () => void;
  toggleOverlay: (overlay: OverlayMode) => void;

  /** Preferences */
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
  setMotionEnabled: (value: boolean) => void;
  toggleMotion: () => void;
  setSoundEnabled: (value: boolean) => void;
  toggleSound: () => void;
  setPerformanceMode: (mode: PerformanceMode) => void;
  setBatteryLevel: (level: number) => void;
}

export type OSStore = OSState & OSActions;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const MAX_RECENT_APPS = 6;

const OVERLAY_FLAGS: Record<
  OverlayMode,
  Partial<Pick<OSState, "isControlCenterOpen" | "isNotificationCenterOpen" | "isSpotlightOpen">>
> = {
  "control-center": { isControlCenterOpen: true },
  notifications: { isNotificationCenterOpen: true },
  spotlight: { isSpotlightOpen: true },
  "app-switcher": {},
};

const CLOSED_OVERLAY_FLAGS = {
  isControlCenterOpen: false,
  isNotificationCenterOpen: false,
  isSpotlightOpen: false,
} as const;

function isOverlay(mode: OSMode): mode is OverlayMode {
  return (
    mode === "control-center" ||
    mode === "notifications" ||
    mode === "spotlight" ||
    mode === "app-switcher"
  );
}

/** The mode beneath any overlay: "app" if an app is open, otherwise "home". */
function baseMode(state: Pick<OSState, "currentApp">): Extract<OSMode, "home" | "app"> {
  return state.currentApp ? "app" : "home";
}

export const initialOSState: OSState = {
  mode: "boot",
  currentApp: null,
  previousApp: null,
  recentApps: [],

  isLocked: true,
  isControlCenterOpen: false,
  isNotificationCenterOpen: false,
  isSpotlightOpen: false,

  isDarkMode: true,
  motionEnabled: true,
  soundEnabled: false,
  performanceMode: "high",
  batteryLevel: 100,
};

/* ------------------------------------------------------------------ */
/* Store — single source of truth for OS navigation & preferences      */
/* ------------------------------------------------------------------ */

export const useOSStore = create<OSStore>()((set, get) => ({
  ...initialOSState,

  completeBoot: () => {
    if (get().mode !== "boot") return;
    set({ mode: "lock", isLocked: true });
  },

  unlock: () => {
    if (get().mode !== "lock") return;
    set({ mode: "home", isLocked: false, ...CLOSED_OVERLAY_FLAGS });
  },

  lock: () => {
    if (get().mode === "boot") return;
    set({
      mode: "lock",
      isLocked: true,
      currentApp: null,
      previousApp: null,
      ...CLOSED_OVERLAY_FLAGS,
    });
  },

  openApp: (id) => {
    const { mode, currentApp, recentApps } = get();
    if (mode === "boot" || mode === "lock") return;
    if (currentApp === id && mode === "app") return;

    set({
      mode: "app",
      currentApp: id,
      previousApp: currentApp,
      recentApps: [id, ...recentApps.filter((a) => a !== id)].slice(0, MAX_RECENT_APPS),
      ...CLOSED_OVERLAY_FLAGS,
    });
  },

  closeApp: () => {
    const { mode, currentApp } = get();
    if (mode === "boot" || mode === "lock") return;
    set({
      mode: "home",
      currentApp: null,
      previousApp: currentApp,
      ...CLOSED_OVERLAY_FLAGS,
    });
  },

  goHome: () => {
    const { mode, currentApp } = get();
    if (mode === "boot" || mode === "lock") return;
    set({
      mode: "home",
      currentApp: null,
      previousApp: currentApp,
      ...CLOSED_OVERLAY_FLAGS,
    });
  },

  openOverlay: (overlay) => {
    const { mode } = get();
    if (mode === "boot" || mode === "lock") return;
    set({ mode: overlay, ...CLOSED_OVERLAY_FLAGS, ...OVERLAY_FLAGS[overlay] });
  },

  closeOverlay: () => {
    const state = get();
    if (!isOverlay(state.mode)) return;
    set({ mode: baseMode(state), ...CLOSED_OVERLAY_FLAGS });
  },

  toggleOverlay: (overlay) => {
    const { mode, openOverlay, closeOverlay } = get();
    if (mode === overlay) closeOverlay();
    else openOverlay(overlay);
  },

  setDarkMode: (value) => set({ isDarkMode: value }),
  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
  setMotionEnabled: (value) => set({ motionEnabled: value }),
  toggleMotion: () => set((s) => ({ motionEnabled: !s.motionEnabled })),
  setSoundEnabled: (value) => set({ soundEnabled: value }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  setPerformanceMode: (performanceMode) => set({ performanceMode }),
  setBatteryLevel: (level) =>
    set({ batteryLevel: Math.min(100, Math.max(0, Math.round(level))) }),
}));

/* Convenience selectors (stable references for React re-render control) */
export const selectMode = (s: OSStore) => s.mode;
export const selectIsUnlocked = (s: OSStore) => s.mode !== "boot" && s.mode !== "lock";
export const selectCurrentApp = (s: OSStore) => s.currentApp;
