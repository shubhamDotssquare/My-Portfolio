"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import { useEffect } from "react";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { SESSION_BOOTED_KEY } from "@/lib/constants";
import { session } from "@/lib/utils";
import { selectIsUnlocked, selectMode, useOSStore } from "@/store/osStore";
import { BootScreen } from "./BootScreen";
import { DynamicIsland } from "./DynamicIsland";
import { HomeIndicator } from "./HomeIndicator";
import { HomeScreen } from "./HomeScreen";
import { LockScreen } from "./LockScreen";
import { PhoneFrame } from "./PhoneFrame";
import { StatusBar } from "./StatusBar";

/**
 * OS orchestrator. Renders the device shell and switches screens based on
 * the single Zustand store. Screens are layered (Home beneath Lock beneath
 * Boot) so transitions can overlap naturally.
 */
export function OS() {
  const mode = useOSStore(selectMode);
  const isUnlocked = useOSStore(selectIsUnlocked);
  const isDarkMode = useOSStore((s) => s.isDarkMode);
  const completeBoot = useOSStore((s) => s.completeBoot);
  const reduced = useOSReducedMotion();

  // Skip the boot sequence if it already played this session.
  useEffect(() => {
    if (session.get(SESSION_BOOTED_KEY)) completeBoot();
  }, [completeBoot]);

  // Theme → document attribute (tokens live in globals.css).
  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  return (
    <MotionConfig reducedMotion={reduced ? "always" : "user"}>
      <PhoneFrame>
        {mode !== "boot" && <StatusBar hideTime={mode === "lock"} />}
        {mode !== "boot" && <DynamicIsland />}

        {/* Home lives beneath the lock screen so unlock reveals it. */}
        <AnimatePresence initial={false}>
          {isUnlocked && <HomeScreen key="home" />}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {mode === "lock" && <LockScreen key="lock" />}
        </AnimatePresence>

        <AnimatePresence>{mode === "boot" && <BootScreen key="boot" />}</AnimatePresence>

        {mode !== "boot" && <HomeIndicator />}
      </PhoneFrame>
    </MotionConfig>
  );
}
