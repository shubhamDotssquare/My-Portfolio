import { create } from "zustand";
import { parsePath } from "@/lib/routes";

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

/** Where an app was launched from — drives the icon → window morph. */
export type LaunchSource = "grid" | "dock" | "none";

export interface OpenAppOptions {
  /** Nested route segments after the app path (e.g. a project slug). */
  params?: string[];
  source?: LaunchSource;
}

export interface OSState {
  mode: OSMode;
  currentApp: AppId | null;
  /** Nested route segments for the current app ("/projects/rise-club" → ["rise-club"]). */
  appParams: string[];
  launchSource: LaunchSource;
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
  /** 0.3 – 1; rendered as a dimming layer over the screen. */
  brightness: number;
  /** Notification ids the visitor has swiped away this session. */
  dismissedNotifications: string[];
}

export interface OSActions {
  /** Boot → Lock */
  completeBoot: () => void;
  /** Lock → Home */
  unlock: () => void;
  /** Any → Lock */
  lock: () => void;

  /** Open an application (Home/App → App). Re-opening the current app only updates params. */
  openApp: (id: AppId, options?: OpenAppOptions) => void;
  /** Close current application (App → Home) */
  closeApp: () => void;
  /** Return to Home from anywhere unlocked, closing overlays. */
  goHome: () => void;
  /**
   * Make OS state reflect a URL (initial load, browser Back/Forward).
   * During boot it only records the target so boot/unlock land in the app.
   */
  syncFromPath: (pathname: string) => void;

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
  setBrightness: (value: number) => void;

  /** Notifications */
  dismissNotification: (id: string) => void;
  clearNotifications: (ids: string[]) => void;

  /** App Switcher */
  removeRecentApp: (id: AppId) => void;

  /** Lock → App directly (tapping a lock-screen notification). */
  unlockTo: (id: AppId, params?: string[]) => void;
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

export function isOverlay(mode: OSMode): mode is OverlayMode {
  return (
    mode === "control-center" ||
    mode === "notifications" ||
    mode === "spotlight" ||
    mode === "app-switcher"
  );
}

function sameParams(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/** The mode beneath any overlay: "app" if an app is open, otherwise "home". */
function baseMode(state: Pick<OSState, "currentApp">): Extract<OSMode, "home" | "app"> {
  return state.currentApp ? "app" : "home";
}

export const initialOSState: OSState = {
  mode: "boot",
  currentApp: null,
  appParams: [],
  launchSource: "none",
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
  brightness: 1,
  dismissedNotifications: [],
};

/* ------------------------------------------------------------------ */
/* Store — single source of truth for OS navigation & preferences      */
/* ------------------------------------------------------------------ */

export const useOSStore = create<OSStore>()((set, get) => ({
  ...initialOSState,

  completeBoot: () => {
    const { mode, currentApp } = get();
    if (mode !== "boot") return;
    // A deep link (e.g. /projects) opens straight into the app; "/" shows the lock screen.
    if (currentApp) set({ mode: "app", isLocked: false });
    else set({ mode: "lock", isLocked: true });
  },

  unlock: () => {
    const { mode, currentApp } = get();
    if (mode !== "lock") return;
    set({ mode: currentApp ? "app" : "home", isLocked: false, ...CLOSED_OVERLAY_FLAGS });
  },

  lock: () => {
    if (get().mode === "boot") return;
    set({
      mode: "lock",
      isLocked: true,
      currentApp: null,
      appParams: [],
      launchSource: "none",
      previousApp: null,
      ...CLOSED_OVERLAY_FLAGS,
    });
  },

  openApp: (id, options = {}) => {
    const { mode, currentApp, appParams, recentApps } = get();
    if (mode === "boot" || mode === "lock") return;
    const params = options.params ?? [];

    // Same app: only navigate within it (keeps the window mounted).
    if (currentApp === id && mode === "app") {
      if (!sameParams(appParams, params)) set({ appParams: params });
      return;
    }

    set({
      mode: "app",
      currentApp: id,
      appParams: params,
      launchSource: options.source ?? "none",
      previousApp: currentApp,
      recentApps: [id, ...recentApps.filter((a) => a !== id)].slice(0, MAX_RECENT_APPS),
      ...CLOSED_OVERLAY_FLAGS,
    });
  },

  closeApp: () => get().goHome(),

  goHome: () => {
    const { mode, currentApp } = get();
    if (mode === "boot" || mode === "lock") return;
    set({
      mode: "home",
      currentApp: null,
      appParams: [],
      launchSource: "none",
      previousApp: currentApp,
      ...CLOSED_OVERLAY_FLAGS,
    });
  },

  syncFromPath: (pathname) => {
    const route = parsePath(pathname);
    const { mode, currentApp, appParams, recentApps } = get();

    // Booting or locked: record the destination; completeBoot/unlock will land there.
    if (mode === "boot" || mode === "lock") {
      set(
        route
          ? { currentApp: route.appId, appParams: route.params, launchSource: "none" }
          : { currentApp: null, appParams: [] },
      );
      return;
    }

    if (!route) {
      if (currentApp !== null || isOverlay(mode)) get().goHome();
      return;
    }

    if (route.appId === currentApp && mode === "app") {
      if (!sameParams(appParams, route.params)) set({ appParams: route.params });
      return;
    }

    set({
      mode: "app",
      currentApp: route.appId,
      appParams: route.params,
      launchSource: "none",
      previousApp: currentApp,
      recentApps: [route.appId, ...recentApps.filter((a) => a !== route.appId)].slice(
        0,
        MAX_RECENT_APPS,
      ),
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
  setBrightness: (value) => set({ brightness: Math.min(1, Math.max(0.3, value)) }),

  dismissNotification: (id) =>
    set((s) => ({
      dismissedNotifications: s.dismissedNotifications.includes(id)
        ? s.dismissedNotifications
        : [...s.dismissedNotifications, id],
    })),
  clearNotifications: (ids) =>
    set((s) => ({
      dismissedNotifications: Array.from(new Set([...s.dismissedNotifications, ...ids])),
    })),

  removeRecentApp: (id) => set((s) => ({ recentApps: s.recentApps.filter((a) => a !== id) })),

  unlockTo: (id, params = []) => {
    const { mode, recentApps } = get();
    if (mode !== "lock") return;
    set({
      mode: "app",
      isLocked: false,
      currentApp: id,
      appParams: params,
      launchSource: "none",
      previousApp: null,
      recentApps: [id, ...recentApps.filter((a) => a !== id)].slice(0, MAX_RECENT_APPS),
      ...CLOSED_OVERLAY_FLAGS,
    });
  },
}));

/* Convenience selectors (stable references for React re-render control) */
export const selectMode = (s: OSStore) => s.mode;
export const selectIsUnlocked = (s: OSStore) => s.mode !== "boot" && s.mode !== "lock";
export const selectCurrentApp = (s: OSStore) => s.currentApp;
export const selectAppParams = (s: OSStore) => s.appParams;

/* Development aid: inspect the OS from the browser console / test drivers. */
declare global {
  interface Window {
    __SHUBHAM_OS__?: typeof useOSStore;
  }
}
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  window.__SHUBHAM_OS__ = useOSStore;
}
