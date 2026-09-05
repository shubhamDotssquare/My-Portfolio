"use client";

import { ChevronLeft } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, type CSSProperties } from "react";
import { screenFade } from "@/animations/osTransitions";
import { pickTransition } from "@/animations/spring";
import { getApp } from "@/data/apps";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { SESSION_BOOTED_KEY } from "@/lib/constants";
import { session } from "@/lib/utils";
import { selectIsUnlocked, selectMode, useOSStore, type AppId } from "@/store/osStore";
import { BootScreen } from "./BootScreen";
import { DynamicIsland } from "./DynamicIsland";
import { HomeIndicator } from "./HomeIndicator";
import { HomeScreen } from "./HomeScreen";
import { LockScreen } from "./LockScreen";
import { PhoneFrame } from "./PhoneFrame";
import { StatusBar } from "./StatusBar";

/**
 * OS orchestrator. Renders the device shell and switches screens based on
 * the single Zustand store. Screens are layered (Home beneath App beneath
 * Lock beneath Boot) so transitions can overlap naturally.
 */
export function OS() {
  const mode = useOSStore(selectMode);
  const isUnlocked = useOSStore(selectIsUnlocked);
  const currentApp = useOSStore((s) => s.currentApp);
  const isDarkMode = useOSStore((s) => s.isDarkMode);
  const completeBoot = useOSStore((s) => s.completeBoot);
  const closeApp = useOSStore((s) => s.closeApp);
  const reduced = useOSReducedMotion();

  // Skip the boot sequence if it already played this session.
  useEffect(() => {
    if (session.get(SESSION_BOOTED_KEY)) completeBoot();
  }, [completeBoot]);

  // Theme → document attribute (tokens live in globals.css).
  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  // Escape closes the current app (keyboard path; gestures are never the only route).
  useEffect(() => {
    if (mode !== "app") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeApp();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, closeApp]);

  const appOpen = mode === "app" && currentApp !== null;

  return (
    <MotionConfig reducedMotion={reduced ? "always" : "user"}>
      <PhoneFrame>
        {mode !== "boot" && <StatusBar hideTime={mode === "lock"} />}
        {mode !== "boot" && <DynamicIsland />}

        {/* Home lives beneath the lock screen so unlock reveals it. */}
        <AnimatePresence initial={false}>
          {isUnlocked && <HomeScreen key="home" />}
        </AnimatePresence>

        {/* App layer — placeholder until OS-014 AppWindow lands. */}
        <AnimatePresence initial={false}>
          {appOpen && <AppPlaceholder key={currentApp} id={currentApp} onClose={closeApp} />}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {mode === "lock" && <LockScreen key="lock" />}
        </AnimatePresence>

        <AnimatePresence>{mode === "boot" && <BootScreen key="boot" />}</AnimatePresence>

        {mode !== "boot" && <HomeIndicator onActivate={appOpen ? closeApp : undefined} />}
      </PhoneFrame>
    </MotionConfig>
  );
}

/**
 * Temporary app surface (M3). Proves the Home → App → Home round-trip via
 * the store; replaced by the real AppWindow engine in M4 (OS-014).
 */
function AppPlaceholder({ id, onClose }: { id: AppId; onClose: () => void }) {
  const app = getApp(id);
  const reduced = useOSReducedMotion();
  const Icon = app.icon;

  return (
    <motion.section
      aria-label={app.name}
      className="absolute inset-0 z-20 flex flex-col bg-os-background os-pt-safe os-pb-safe"
      variants={screenFade}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pickTransition(reduced, "smooth")}
    >
      <header className="flex items-center px-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-0.5 rounded-full py-2 pr-3 pl-1 text-[16px] font-medium text-os-accent outline-none focus-visible:ring-2 focus-visible:ring-os-accent"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden />
          Home
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
        <span
          className="os-app-icon flex h-20 w-20 items-center justify-center rounded-[1.5rem]"
          style={{ "--tint": `var(--os-tint-${app.tint})` } as CSSProperties}
        >
          <Icon className="h-9 w-9" strokeWidth={1.9} aria-hidden />
        </span>
        <h1 className="os-heading text-[1.6rem] text-os-text-primary">{app.name}</h1>
        <p className="text-[15px] text-os-text-secondary">{app.description}</p>
        <p className="mt-6 text-[12px] text-os-text-tertiary">App engine arrives in M4.</p>
      </div>
    </motion.section>
  );
}
