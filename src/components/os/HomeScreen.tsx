"use client";

import { Search } from "lucide-react";
import { motion, type PanInfo } from "motion/react";
import { homeRevealVariants, variantsFor } from "@/animations/osTransitions";
import { pickTransition } from "@/animations/spring";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { OWNER, SHORT_VIEWPORT_PX } from "@/lib/constants";
import { getGreeting } from "@/lib/utils";
import { useOSStore, type AppId, type LaunchSource } from "@/store/osStore";
import { AppGrid } from "./AppGrid";
import { Dock } from "./Dock";

/**
 * Home screen: greeting, application grid and dock. Tapping an icon
 * dispatches `openApp` to the OS store; AppHost renders the window.
 */
interface HomeScreenProps {
  /** True while an app or overlay covers Home: removes it from the tab order and a11y tree. */
  inert?: boolean;
}

export function HomeScreen({ inert = false }: HomeScreenProps) {
  const openApp = useOSStore((s) => s.openApp);
  const openOverlay = useOSStore((s) => s.openOverlay);
  const reduced = useOSReducedMotion();
  const handleOpen = (id: AppId, source: LaunchSource) => openApp(id, { source });

  // Swipe down anywhere on Home → Spotlight (the search pill is the visible path).
  const onPanEnd = (_: unknown, info: PanInfo) => {
    // Short viewports scroll instead (see `short:` classes below).
    if (window.innerHeight < SHORT_VIEWPORT_PX) return;
    if (info.offset.y > 80) openOverlay("spotlight");
  };

  return (
    <motion.main
      aria-label="Home screen"
      inert={inert}
      aria-hidden={inert || undefined}
      className="absolute inset-0 z-10 flex flex-col os-wallpaper os-pt-safe os-pb-safe touch-none short:touch-auto"
      onPanEnd={onPanEnd}
      variants={variantsFor(reduced, homeRevealVariants)}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pickTransition(reduced, "smooth")}
    >
      <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col px-5 pt-5 short:overflow-y-auto short:pt-2 short:[scrollbar-width:none]">
        <header className="px-1">
          <p className="os-heading text-[1.9rem] leading-[1.15] text-os-text-primary short:text-[1.5rem]">
            {getGreeting()},
            <br />
            Guest 👋
          </p>
          <p className="mt-3 text-[15px] text-os-text-secondary short:mt-1 short:text-[13px]">Welcome to {OWNER.osName}.</p>
        </header>

        <button
          type="button"
          onClick={() => openOverlay("spotlight")}
          aria-label="Open Spotlight search"
          className="mt-6 flex items-center gap-2.5 rounded-full os-glass px-4 py-2.5 short:mt-3 short:py-2 text-[14px] text-os-text-tertiary outline-none transition-colors hover:text-os-text-secondary focus-visible:ring-2 focus-visible:ring-os-accent"
        >
          <Search className="h-4 w-4" aria-hidden />
          Search {OWNER.osName}
          <kbd className="ml-auto hidden rounded-md border border-os-border px-1.5 py-0.5 font-sans text-[11px] desktop:inline">⌘K</kbd>
        </button>

        <AppGrid onOpen={handleOpen} className="mt-7 short:mt-4 short:gap-y-4" />

        <div className="flex-1" />

        {/* Page indicator — a single page for now. */}
        <div aria-hidden className="mb-4 flex justify-center gap-1.5 short:mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-os-text-primary/80" />
        </div>

        <Dock onOpen={handleOpen} className="mb-1" />
      </div>
    </motion.main>
  );
}
