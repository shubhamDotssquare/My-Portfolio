"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useHistorySync } from "@/hooks/useHistorySync";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { SESSION_BOOTED_KEY } from "@/lib/constants";
import { session } from "@/lib/utils";
import { isOverlay, selectIsUnlocked, selectMode, useOSStore } from "@/store/osStore";
import { AppHost } from "./AppHost";
import { BootScreen } from "./BootScreen";
import { DynamicIsland } from "./DynamicIsland";
import { HomeIndicator } from "./HomeIndicator";
import { HomeScreen } from "./HomeScreen";
import { LockScreen } from "./LockScreen";
import { PhoneFrame } from "./PhoneFrame";
import { StatusBar } from "./StatusBar";

/* System overlays are code-split: Home loads first, overlays load on first use. */
const ControlCenter = dynamic(() => import("./ControlCenter").then((m) => m.ControlCenter), { ssr: false });
const NotificationCenter = dynamic(() => import("./NotificationCenter").then((m) => m.NotificationCenter), { ssr: false });
const Spotlight = dynamic(() => import("./Spotlight").then((m) => m.Spotlight), { ssr: false });
const AppSwitcher = dynamic(() => import("./AppSwitcher").then((m) => m.AppSwitcher), { ssr: false });

/**
 * OS orchestrator. Renders the device shell and switches screens based on
 * the single Zustand store. Layers (bottom → top): Home 10 · App 20 ·
 * Lock 30 · overlays 34/35 · StatusBar + HomeIndicator 40 · Island 50 ·
 * Boot 60 · brightness scrim 70.
 */
export function OS() {
  const mode = useOSStore(selectMode);
  const isUnlocked = useOSStore(selectIsUnlocked);
  const currentApp = useOSStore((s) => s.currentApp);
  const isDarkMode = useOSStore((s) => s.isDarkMode);
  const performanceMode = useOSStore((s) => s.performanceMode);
  const brightness = useOSStore((s) => s.brightness);
  const completeBoot = useOSStore((s) => s.completeBoot);
  const goHome = useOSStore((s) => s.goHome);
  const toggleOverlay = useOSStore((s) => s.toggleOverlay);
  const openOverlay = useOSStore((s) => s.openOverlay);
  const reduced = useOSReducedMotion();

  // URL ⇄ store (hydrates from the initial URL first, so deep links work).
  useHistorySync();
  useKeyboardShortcuts();
  useSoundEffects();

  // Skip the boot sequence if it already played this session.
  useEffect(() => {
    if (session.get(SESSION_BOOTED_KEY)) completeBoot();
  }, [completeBoot]);

  // Preferences → document attributes (tokens live in globals.css).
  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);
  useEffect(() => {
    document.documentElement.dataset.performance = performanceMode;
  }, [performanceMode]);

  // An app stays mounted beneath any overlay.
  const appOpen = currentApp !== null && (mode === "app" || isOverlay(mode));

  return (
    <MotionConfig reducedMotion={reduced ? "always" : "user"}>
      <PhoneFrame>
        {mode !== "boot" && (
          <StatusBar
            hideTime={mode === "lock"}
            onOpenNotifications={isUnlocked ? () => toggleOverlay("notifications") : undefined}
            onOpenControlCenter={isUnlocked ? () => toggleOverlay("control-center") : undefined}
          />
        )}
        {mode !== "boot" && <DynamicIsland />}

        {/* Home lives beneath the lock screen so unlock reveals it. */}
        <AnimatePresence initial={false}>
          {isUnlocked && <HomeScreen key="home" />}
        </AnimatePresence>

        {/* App layer: keyed by app so switching apps remounts the window. */}
        <AnimatePresence initial={false}>
          {appOpen && <AppHost key={currentApp} id={currentApp} />}
        </AnimatePresence>

        {/* System overlays */}
        <AnimatePresence>
          {mode === "control-center" && <ControlCenter key="control-center" />}
          {mode === "notifications" && <NotificationCenter key="notifications" />}
          {mode === "spotlight" && <Spotlight key="spotlight" />}
          {mode === "app-switcher" && <AppSwitcher key="app-switcher" />}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {mode === "lock" && <LockScreen key="lock" />}
        </AnimatePresence>

        <AnimatePresence>{mode === "boot" && <BootScreen key="boot" />}</AnimatePresence>

        {mode !== "boot" && (
          <HomeIndicator
            onActivate={isUnlocked ? goHome : undefined}
            onHold={isUnlocked ? () => openOverlay("app-switcher") : undefined}
          />
        )}

        {/* Brightness scrim (Control Center slider) */}
        {brightness < 1 && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[70] bg-black"
            style={{ opacity: 1 - brightness }}
          />
        )}
      </PhoneFrame>
    </MotionConfig>
  );
}
