"use client";

import { ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { useFocusScope } from "@/hooks/useFocusScope";
import { appWindowVariants, screenFade } from "@/animations/osTransitions";
import { pickTransition, springs } from "@/animations/spring";
import type { AppDefinition } from "@/data/apps";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import type { LaunchSource } from "@/store/osStore";

interface AppWindowProps {
  app: AppDefinition;
  params: string[];
  /** Frozen at mount: which icon the window morphs from / back to. */
  launchSource: LaunchSource;
  /** Back: one level up inside the app, or Home at the app root. */
  onBack: () => void;
  /** Optional right-side header controls. */
  actions?: ReactNode;
  /** True while a system overlay covers the window. */
  inert?: boolean;
  children: ReactNode;
}

/** Shared layoutId between an AppIcon and its window. */
export function appLayoutId(appId: string, source: LaunchSource): string | undefined {
  return source === "none" ? undefined : `app-${appId}-${source}`;
}

/**
 * The app engine's shared chrome: a surface that expands from the tapped icon
 * (Motion shared-layout morph) and returns to it on close, a header with a
 * real Back button, and a scrollable content area that clears the safe areas.
 */
export function AppWindow({
  app,
  params,
  launchSource,
  onBack,
  actions,
  inert = false,
  children,
}: AppWindowProps) {
  const reduced = useOSReducedMotion();
  const windowRef = useRef<HTMLElement>(null);
  // Focus moves to the window on open (screen readers announce its name) and
  // returns to the launching icon on close. Not a trap: Home is inert meanwhile.
  useFocusScope(windowRef, { trap: false });
  const layoutId = reduced ? undefined : appLayoutId(app.id, launchSource);
  const scrollRef = useRef<HTMLDivElement>(null);
  const nested = params.length > 0;

  // New nested location → start at the top of the content.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [params]);
  const backLabel = nested ? app.name : "Home";

  return (
    <motion.section
      ref={windowRef}
      tabIndex={-1}
      inert={inert}
      aria-hidden={inert || undefined}
      aria-label={app.name}
      layoutId={layoutId}
      variants={layoutId ? undefined : reduced ? screenFade : appWindowVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={layoutId ? { layout: springs.smooth } : pickTransition(reduced, "smooth")}
      style={{ borderRadius: layoutId ? 0 : undefined }}
      className="absolute inset-0 z-20 flex flex-col overflow-hidden bg-os-background outline-none"
    >
      {/* Content fades in slightly after the surface morph so text never scales. */}
      <motion.div
        className="mx-auto flex min-h-0 w-full max-w-[560px] flex-1 flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.2, delay: layoutId ? 0.12 : 0 } }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
      >
        <header className="flex items-center justify-between px-2 pb-1 os-pt-safe">
          <button
            type="button"
            onClick={onBack}
            aria-label={`Back to ${nested ? app.name : "Home Screen"}`}
            className="flex min-w-[4.5rem] items-center gap-0.5 rounded-full py-2 pr-3 pl-1 text-[16px] font-medium text-os-accent outline-none focus-visible:ring-2 focus-visible:ring-os-accent"
          >
            <ChevronLeft className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden />
            <span className="truncate">{backLabel}</span>
          </button>

          <h2 className="truncate text-[16px] font-semibold text-os-text-primary">{app.name}</h2>

          <div className="flex min-w-[4.5rem] items-center justify-end gap-1 pr-2">{actions}</div>
        </header>

        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-y-auto px-5 pt-2 os-pb-safe [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
      </motion.div>
    </motion.section>
  );
}
