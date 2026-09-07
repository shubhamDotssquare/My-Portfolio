"use client";

import { BellOff, X } from "lucide-react";
import { AnimatePresence, motion, type PanInfo, type Variants } from "motion/react";
import { useRef, useState } from "react";
import { useFocusScope } from "@/hooks/useFocusScope";
import { screenFade } from "@/animations/osTransitions";
import { pickTransition, springs } from "@/animations/spring";
import { notifications, type OSNotification } from "@/data/notifications";
import { useClock } from "@/hooks/useClock";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { useOSStore } from "@/store/osStore";
import { TintIcon } from "@/components/ui/TintIcon";
import { OverlayBackdrop } from "./OverlayBackdrop";

const sheetVariants: Variants = {
  initial: { y: "-100%", opacity: 0.6 },
  animate: { y: 0, opacity: 1 },
  exit: { y: "-100%", opacity: 0.6, transition: { duration: 0.25, ease: "easeIn" } },
};

/** Notification Center — sheet from the top. Items open their app; swipe or ✕ dismisses. */
export function NotificationCenter() {
  const reduced = useOSReducedMotion();
  const closeOverlay = useOSStore((s) => s.closeOverlay);
  const openApp = useOSStore((s) => s.openApp);
  const dismissed = useOSStore((s) => s.dismissedNotifications);
  const dismissNotification = useOSStore((s) => s.dismissNotification);
  const clearNotifications = useOSStore((s) => s.clearNotifications);
  const { weekday, monthDay, ready } = useClock();
  const [dir, setDir] = useState(1);
  const sheetRef = useRef<HTMLElement>(null);
  useFocusScope(sheetRef);

  const visible = notifications.filter((n) => !dismissed.includes(n.id));

  const dismiss = (id: string, d: number) => {
    setDir(d);
    dismissNotification(id);
  };

  const onSheetDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -60 || info.velocity.y < -500) closeOverlay();
  };

  return (
    <>
      <OverlayBackdrop onClose={closeOverlay} label="Close Notification Center" />
      <motion.section
        ref={sheetRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Notification Center"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.3, bottom: 0.03 }}
        dragMomentum={false}
        onDragEnd={onSheetDragEnd}
        variants={reduced ? screenFade : sheetVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pickTransition(reduced, "smooth")}
        className="absolute inset-x-0 top-0 z-[35] flex max-h-[82%] flex-col rounded-b-[2rem] os-glass-elevated px-4 pb-3 os-pt-safe shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] touch-none"
      >
        <div className="mx-auto flex w-full max-w-[560px] items-end justify-between px-1 pt-1 pb-3">
          <div>
            <h2 className="os-heading text-[1.5rem] leading-none text-os-text-primary">Notifications</h2>
            <p className="mt-1 text-[13px] text-os-text-secondary" suppressHydrationWarning>
              {ready ? `${weekday}, ${monthDay}` : " "}
            </p>
          </div>
          <button
            type="button"
            onClick={() => clearNotifications(visible.map((n) => n.id))}
            disabled={visible.length === 0}
            className="rounded-full bg-os-surface px-3.5 py-1.5 text-[13px] font-semibold text-os-text-primary outline-none transition-colors hover:bg-os-surface-elevated focus-visible:ring-2 focus-visible:ring-os-accent disabled:opacity-40"
          >
            Clear all
          </button>
        </div>

        <ul className="mx-auto flex w-full max-w-[560px] min-h-0 flex-col gap-2 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Notifications">
          <AnimatePresence custom={dir} initial={false}>
            {visible.map((n) => (
              <NotificationCard key={n.id} n={n} dir={dir} onOpen={() => openApp(n.appId, { params: n.params })} onDismiss={(d) => dismiss(n.id, d)} />
            ))}
          </AnimatePresence>
          {visible.length === 0 && (
            <li className="flex flex-col items-center gap-2 py-10 text-center text-os-text-tertiary">
              <BellOff className="h-6 w-6" aria-hidden />
              <span className="text-[14px]">No new notifications</span>
            </li>
          )}
        </ul>

        <span aria-hidden className="mx-auto mt-3 block h-1 w-10 rounded-full bg-os-border-strong" />
      </motion.section>
    </>
  );
}

function NotificationCard({
  n,
  dir,
  onOpen,
  onDismiss,
}: {
  n: OSNotification;
  dir: number;
  onOpen: () => void;
  onDismiss: (dir: number) => void;
}) {
  const reduced = useOSReducedMotion();
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 700)
      onDismiss(Math.sign(info.offset.x || info.velocity.x) || 1);
  };

  return (
    <motion.li
      layout
      custom={dir}
      drag={reduced ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      variants={{ exit: (d: number) => (reduced ? { opacity: 0 } : { x: d * 420, opacity: 0 }) }}
      exit="exit"
      transition={reduced ? { duration: 0.15 } : springs.smooth}
      className="relative flex items-start gap-3 rounded-[1.25rem] bg-os-surface p-3.5"
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-start gap-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-os-accent rounded-xl"
      >
        <TintIcon icon={n.icon} tint={n.tint} />
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className="text-[11px] font-semibold tracking-[0.1em] text-os-text-tertiary uppercase">{n.category}</span>
            <span className="text-[11px] text-os-text-tertiary">{n.when}</span>
          </span>
          <span className="mt-0.5 block text-[15px] font-semibold text-os-text-primary">{n.title}</span>
          <span className="block text-[13px] leading-snug text-os-text-secondary">{n.body}</span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => onDismiss(1)}
        aria-label={`Dismiss ${n.title}`}
        className="mt-5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-os-border text-os-text-secondary outline-none hover:text-os-text-primary focus-visible:ring-2 focus-visible:ring-os-accent"
      >
        <X className="h-3.5 w-3.5" aria-hidden />
      </button>
    </motion.li>
  );
}
