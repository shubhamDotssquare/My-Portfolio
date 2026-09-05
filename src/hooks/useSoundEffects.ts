"use client";

import { useEffect } from "react";
import { playTick } from "@/lib/sound";
import { isOverlay, useOSStore } from "@/store/osStore";

/** Plays tiny ticks on navigation — only while sound is enabled (off by default). */
export function useSoundEffects() {
  useEffect(
    () =>
      useOSStore.subscribe((state, prev) => {
        if (state.soundEnabled && !prev.soundEnabled) {
          playTick("toggle"); // confirm the toggle itself
          return;
        }
        if (!state.soundEnabled) return;
        if (state.currentApp !== prev.currentApp) playTick(state.currentApp ? "open" : "close");
        else if (isOverlay(state.mode) && !isOverlay(prev.mode)) playTick("toggle");
      }),
    [],
  );
}
