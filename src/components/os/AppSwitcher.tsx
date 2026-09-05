"use client";

import { LayoutGrid, X } from "lucide-react";
import { AnimatePresence, motion, type PanInfo, type Variants } from "motion/react";
import { screenFade } from "@/animations/osTransitions";
import { pickTransition, springs } from "@/animations/spring";
import { getApp } from "@/data/apps";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { tintVar } from "@/lib/utils";
import { useOSStore, type AppId } from "@/store/osStore";
import { Button } from "@/components/ui/Button";
import { TintIcon } from "@/components/ui/TintIcon";
import { OverlayBackdrop } from "./OverlayBackdrop";

const stageVariants: Variants = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2, ease: "easeOut" } },
};

/** App Switcher — recent apps as cards. Tap to reopen, swipe up or ✕ to remove. */
export function AppSwitcher() {
  const reduced = useOSReducedMotion();
  const recentApps = useOSStore((s) => s.recentApps);
  const openApp = useOSStore((s) => s.openApp);
  const removeRecentApp = useOSStore((s) => s.removeRecentApp);
  const goHome = useOSStore((s) => s.goHome);
  const closeOverlay = useOSStore((s) => s.closeOverlay);

  return (
    <>
      <OverlayBackdrop onClose={closeOverlay} label="Close App Switcher" />
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label="App Switcher"
        variants={reduced ? screenFade : stageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pickTransition(reduced, "smooth")}
        className="absolute inset-0 z-[35] flex flex-col os-pt-safe os-pb-safe"
      >
        <header className="flex items-center justify-between px-6 pt-4">
          <h2 className="os-heading text-[1.35rem] text-os-text-primary">Recent</h2>
          <span className="text-[12px] text-os-text-tertiary">Swipe up a card to remove it</span>
        </header>

        <div className="flex min-h-0 flex-1 items-center">
          {recentApps.length === 0 ? (
            <div className="flex w-full flex-col items-center gap-2 text-os-text-tertiary">
              <LayoutGrid className="h-7 w-7" aria-hidden />
              <p className="text-[14px]">No recent apps</p>
            </div>
          ) : (
            <ul
              aria-label="Recent apps"
              className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto px-[16%] py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <AnimatePresence initial={false}>
                {recentApps.map((id) => (
                  <SwitcherCard key={id} id={id} onOpen={() => openApp(id)} onRemove={() => removeRecentApp(id)} />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        <div className="px-6 pb-3">
          <Button variant="secondary" onClick={goHome} className="w-full">
            Home
          </Button>
        </div>
      </motion.section>
    </>
  );
}

function SwitcherCard({ id, onOpen, onRemove }: { id: AppId; onOpen: () => void; onRemove: () => void }) {
  const reduced = useOSReducedMotion();
  const app = getApp(id);
  const Icon = app.icon;

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -90 || info.velocity.y < -700) onRemove();
  };

  return (
    <motion.li
      layout
      drag={reduced ? false : "y"}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.6, bottom: 0.05 }}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      exit={reduced ? { opacity: 0 } : { y: -320, opacity: 0 }}
      transition={reduced ? { duration: 0.15 } : springs.smooth}
      style={tintVar(app.tint)}
      className="relative w-[68%] shrink-0 snap-center"
    >
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="flex items-center gap-2 text-[13px] font-semibold text-os-text-primary">
          <TintIcon icon={Icon} tint={app.tint} className="h-6 w-6 rounded-lg [&>svg]:h-3.5 [&>svg]:w-3.5" />
          {app.name}
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${app.name} from recents`}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-os-surface-elevated text-os-text-secondary outline-none hover:text-os-text-primary focus-visible:ring-2 focus-visible:ring-os-accent"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>

      {/* Stylised preview of the app window */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Reopen ${app.name}`}
        className="block aspect-[390/620] w-full overflow-hidden rounded-[1.5rem] border border-os-border-strong bg-os-background text-left shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] outline-none focus-visible:ring-2 focus-visible:ring-os-accent"
      >
        <div className="os-app-icon flex h-[28%] items-end px-4 pb-3">
          <span className="text-[15px] font-semibold">{app.name}</span>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <span className="block h-2.5 w-3/4 rounded-full bg-os-border-strong" />
          <span className="block h-2.5 w-1/2 rounded-full bg-os-border" />
          <p className="mt-2 text-[12px] leading-snug text-os-text-secondary">{app.description}</p>
          <span className="mt-2 block h-16 rounded-xl bg-os-surface" />
          <span className="block h-16 rounded-xl bg-os-surface" />
        </div>
      </button>
    </motion.li>
  );
}
