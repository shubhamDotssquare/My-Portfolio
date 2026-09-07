"use client";

import { useEffect, useState } from "react";
import { getApp } from "@/data/apps";
import { useOSStore, type OSMode } from "@/store/osStore";

const OVERLAY_NAMES: Partial<Record<OSMode, string>> = {
  "control-center": "Control Center",
  notifications: "Notification Center",
  spotlight: "Spotlight search",
  "app-switcher": "App Switcher",
};

/** Screen-reader announcements for OS navigation (visually hidden live region). */
export function Announcer() {
  const [message, setMessage] = useState("");

  useEffect(
    () =>
      useOSStore.subscribe((state, prev) => {
        if (state.mode === prev.mode && state.currentApp === prev.currentApp) return;
        const overlay = OVERLAY_NAMES[state.mode];
        if (overlay) setMessage(`${overlay} opened`);
        else if (state.mode === "lock") setMessage("Locked");
        else if (state.mode === "app" && state.currentApp) setMessage(`${getApp(state.currentApp).name} opened`);
        else if (state.mode === "home") setMessage("Home Screen");
      }),
    [],
  );

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
