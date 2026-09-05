"use client";

import { useEffect } from "react";
import { isOverlay, useOSStore, type AppId } from "@/store/osStore";

/** Single-key app shortcuts (spec §41). Only when not typing in a field. */
const APP_KEYS: Record<string, AppId> = {
  p: "projects",
  a: "about",
  l: "developer-lab",
  e: "experience",
  c: "contact",
  r: "resume",
};

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

/**
 * Global keyboard layer: ⌘/Ctrl+K Spotlight, Esc closes overlay → app,
 * H Home, S App Switcher, N Notifications, letters open apps.
 * Gestures are never the only path; this is one of the alternatives.
 */
export function useKeyboardShortcuts() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const store = useOSStore.getState();
      const unlocked = store.mode !== "boot" && store.mode !== "lock";
      const key = e.key.toLowerCase();

      if ((e.metaKey || e.ctrlKey) && key === "k") {
        e.preventDefault();
        if (unlocked) store.toggleOverlay("spotlight");
        return;
      }

      if (e.key === "Escape") {
        if (isOverlay(store.mode)) store.closeOverlay();
        else if (store.mode === "app") store.closeApp();
        return;
      }

      if (!unlocked || isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;

      if (key === "h") store.goHome();
      else if (key === "s") store.toggleOverlay("app-switcher");
      else if (key === "n") store.toggleOverlay("notifications");
      else if (key in APP_KEYS) store.openApp(APP_KEYS[key]);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
