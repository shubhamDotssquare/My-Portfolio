"use client";

import { useEffect } from "react";
import { getApp } from "@/data/apps";
import { OWNER } from "@/lib/constants";
import { buildPath } from "@/lib/routes";
import { useOSStore } from "@/store/osStore";

/**
 * Two-way sync between OS navigation state and the browser URL.
 *
 * store → URL : whenever the open app / params change, `pushState` a real URL
 *               (native history integrates with the Next.js router).
 * URL → store : `popstate` (Back / Forward) and the initial load feed
 *               `syncFromPath`, so the OS is never an SPA trap.
 *
 * Loops are prevented by never pushing when the URL already matches.
 */
export function useHistorySync() {
  const syncFromPath = useOSStore((s) => s.syncFromPath);

  useEffect(() => {
    // 1. Hydrate from the initial URL before subscribing (no push on hydration).
    syncFromPath(window.location.pathname);

    // 2. Store → URL
    const unsubscribe = useOSStore.subscribe((state, prev) => {
      if (state.currentApp === prev.currentApp && state.appParams === prev.appParams) return;
      if (state.mode === "boot") return; // deep-link hydration; URL is already right

      const path = state.currentApp ? buildPath(state.currentApp, state.appParams) : "/";
      if (window.location.pathname !== path) window.history.pushState(null, "", path);

      document.title = state.currentApp
        ? `${getApp(state.currentApp).name} · ${OWNER.osName}`
        : OWNER.osName;
    });

    // 3. URL → store
    const onPopState = () => syncFromPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);

    return () => {
      unsubscribe();
      window.removeEventListener("popstate", onPopState);
    };
  }, [syncFromPath]);
}
