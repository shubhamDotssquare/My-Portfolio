"use client";

import { motion } from "motion/react";
import { homeRevealVariants, variantsFor } from "@/animations/osTransitions";
import { pickTransition } from "@/animations/spring";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { OWNER } from "@/lib/constants";
import { getGreeting } from "@/lib/utils";
import { useOSStore, type AppId, type LaunchSource } from "@/store/osStore";
import { AppGrid } from "./AppGrid";
import { Dock } from "./Dock";

/**
 * Home screen: greeting, application grid and dock. Tapping an icon
 * dispatches `openApp` to the OS store; AppHost renders the window.
 */
export function HomeScreen() {
  const openApp = useOSStore((s) => s.openApp);
  const reduced = useOSReducedMotion();
  const handleOpen = (id: AppId, source: LaunchSource) => openApp(id, { source });

  return (
    <motion.main
      aria-label="Home screen"
      className="absolute inset-0 z-10 flex flex-col os-wallpaper os-pt-safe os-pb-safe"
      variants={variantsFor(reduced, homeRevealVariants)}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pickTransition(reduced, "smooth")}
    >
      <div className="flex flex-1 flex-col px-5 pt-5">
        <header className="px-1">
          <p className="os-heading text-[1.9rem] leading-[1.15] text-os-text-primary">
            {getGreeting()},
            <br />
            Guest 👋
          </p>
          <p className="mt-3 text-[15px] text-os-text-secondary">Welcome to {OWNER.osName}.</p>
        </header>

        <AppGrid onOpen={handleOpen} className="mt-9" />

        <div className="flex-1" />

        {/* Page indicator — a single page for now. */}
        <div aria-hidden className="mb-4 flex justify-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-os-text-primary/80" />
        </div>

        <Dock onOpen={handleOpen} className="mb-1" />
      </div>
    </motion.main>
  );
}
