"use client";

import { ChevronUp } from "lucide-react";
import { motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { useEffect, useRef } from "react";
import { lockScreenVariants, variantsFor } from "@/animations/osTransitions";
import { pickTransition } from "@/animations/spring";
import { useClock } from "@/hooks/useClock";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { notifications } from "@/data/notifications";
import { OWNER, UNLOCK_DISTANCE_PX, UNLOCK_VELOCITY } from "@/lib/constants";
import { useOSStore } from "@/store/osStore";
import { TintIcon } from "@/components/ui/TintIcon";

/**
 * Lock screen: live clock/date, ambient background, swipe-up to unlock.
 * The swipe is real pointer tracking via Motion's drag; the hint is also a
 * button so keyboard and assistive-tech users can unlock without a gesture.
 */
export function LockScreen() {
  const unlock = useOSStore((s) => s.unlock);
  const unlockTo = useOSStore((s) => s.unlockTo);
  const dismissed = useOSStore((s) => s.dismissedNotifications);
  const reduced = useOSReducedMotion();
  const previews = notifications.filter((n) => !dismissed.includes(n.id)).slice(0, 2);
  const { time, weekday, monthDay, ready } = useClock();
  const hintRef = useRef<HTMLButtonElement>(null);

  const y = useMotionValue(0);
  const contentOpacity = useTransform(y, [-180, 0], [0.2, 1]);
  const contentScale = useTransform(y, [-180, 0], [0.96, 1]);

  useEffect(() => {
    hintRef.current?.focus({ preventScroll: true });
  }, []);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const passedDistance = info.offset.y < -UNLOCK_DISTANCE_PX;
    const passedVelocity = info.velocity.y < -UNLOCK_VELOCITY;
    if (passedDistance || passedVelocity) unlock();
  };

  return (
    <motion.section
      aria-label="Lock screen"
      className="absolute inset-0 z-30 flex flex-col overflow-hidden os-wallpaper touch-none select-none"
      variants={variantsFor(reduced, lockScreenVariants)}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pickTransition(reduced, "smooth")}
    >
      <AmbientBackground reduced={reduced} />

      {/* Draggable content layer */}
      <motion.div
        className="relative flex flex-1 flex-col items-center os-pt-safe os-pb-safe"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.55, bottom: 0 }}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ y, opacity: contentOpacity, scale: contentScale }}
      >
        {/* Clock */}
        <div className="mt-10 flex flex-col items-center text-os-text-primary">
          <time
            className="os-heading text-[5.25rem] leading-none tracking-[-0.045em] tabular-nums"
            dateTime={ready ? time : undefined}
            suppressHydrationWarning
          >
            {ready ? time : " "}
          </time>
          <p
            className="mt-3 text-center text-[17px] font-medium leading-tight text-os-text-secondary"
            suppressHydrationWarning
          >
            {ready ? (
              <>
                {weekday}
                <br />
                {monthDay}
              </>
            ) : (
              <>
                {" "}
                <br />
                {" "}
              </>
            )}
          </p>
        </div>

        {/* Notification previews — tapping unlocks straight into the related app */}
        {previews.length > 0 && (
          <ul aria-label="Notifications" className="mt-9 flex w-full flex-col gap-2 px-5">
            {previews.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => unlockTo(n.appId, n.params)}
                  aria-label={`${n.category}: ${n.title}. Unlock and open.`}
                  className="flex w-full items-center gap-3 rounded-[1.25rem] os-glass px-3.5 py-3 text-left outline-none transition-colors hover:bg-os-surface-elevated focus-visible:ring-2 focus-visible:ring-os-accent"
                >
                  <TintIcon icon={n.icon} tint={n.tint} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[11px] font-semibold tracking-[0.1em] text-os-text-tertiary uppercase">{n.category}</span>
                      <span className="text-[11px] text-os-text-tertiary">{n.when}</span>
                    </span>
                    <span className="block truncate text-[14px] font-semibold text-os-text-primary">{n.title}</span>
                    <span className="block truncate text-[12px] text-os-text-secondary">{n.body}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex-1" />

        {/* Identity */}
        <div className="mb-10 flex flex-col items-center gap-1 text-center">
          <p className="os-heading text-[15px] tracking-[0.24em] text-os-text-primary">
            {OWNER.osName}
          </p>
          <p className="text-[13px] text-os-text-tertiary">{OWNER.title}</p>
        </div>

        {/* Unlock hint — also the accessible (non-gesture) unlock control */}
        <button
          ref={hintRef}
          type="button"
          onClick={unlock}
          className="group mb-3 flex flex-col items-center gap-1 rounded-2xl px-6 py-2 text-os-text-secondary outline-none transition-colors hover:text-os-text-primary focus-visible:ring-2 focus-visible:ring-os-accent"
          aria-label="Unlock and open Home Screen"
        >
          <motion.span
            aria-hidden
            className="text-os-text-primary/80"
            animate={reduced ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronUp className="h-5 w-5" strokeWidth={2.5} />
          </motion.span>
          <span className="text-[13px] font-medium tracking-[0.02em]">Swipe to explore</span>
        </button>
      </motion.div>
    </motion.section>
  );
}

/** Slow-drifting light blobs. Static when motion is reduced. */
function AmbientBackground({ reduced }: { reduced: boolean }) {
  const blobs = [
    {
      className: "left-[-20%] top-[-10%] h-[60%] w-[80%] bg-os-accent/25",
      animate: { x: [0, 30, 0], y: [0, 20, 0] },
      duration: 18,
    },
    {
      className: "right-[-25%] top-[30%] h-[55%] w-[75%] bg-os-accent-secondary/20",
      animate: { x: [0, -25, 0], y: [0, 30, 0] },
      duration: 22,
    },
    {
      className: "bottom-[-20%] left-[10%] h-[50%] w-[70%] bg-os-accent/15",
      animate: { x: [0, 20, 0], y: [0, -20, 0] },
      duration: 26,
    },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-3xl ${b.className}`}
          animate={reduced ? undefined : b.animate}
          transition={{ duration: b.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
