"use client";

import { Gauge, LayoutGrid, Lock, Moon, Sun, Volume2, VolumeX, Wind, type LucideIcon } from "lucide-react";
import { motion, type PanInfo, type Variants } from "motion/react";
import { useEffect, useRef } from "react";
import { screenFade } from "@/animations/osTransitions";
import { pickTransition } from "@/animations/spring";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { useOSStore } from "@/store/osStore";
import { Slider } from "@/components/ui/Slider";
import { OverlayBackdrop } from "./OverlayBackdrop";

const panelVariants: Variants = {
  initial: { opacity: 0, scale: 0.9, y: -16 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.92, y: -12, transition: { duration: 0.2, ease: "easeOut" } },
};

/**
 * Control Center — anchored top-right. Every control is a real button/slider;
 * the panel also dismisses on swipe-up, backdrop tap or Escape.
 */
export function ControlCenter() {
  const reduced = useOSReducedMotion();
  const closeOverlay = useOSStore((s) => s.closeOverlay);
  const openOverlay = useOSStore((s) => s.openOverlay);
  const lock = useOSStore((s) => s.lock);
  const motionEnabled = useOSStore((s) => s.motionEnabled);
  const toggleMotion = useOSStore((s) => s.toggleMotion);
  const isDarkMode = useOSStore((s) => s.isDarkMode);
  const toggleDarkMode = useOSStore((s) => s.toggleDarkMode);
  const performanceMode = useOSStore((s) => s.performanceMode);
  const setPerformanceMode = useOSStore((s) => s.setPerformanceMode);
  const soundEnabled = useOSStore((s) => s.soundEnabled);
  const toggleSound = useOSStore((s) => s.toggleSound);
  const brightness = useOSStore((s) => s.brightness);
  const setBrightness = useOSStore((s) => s.setBrightness);
  const firstTile = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    firstTile.current?.focus({ preventScroll: true });
  }, []);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -50 || info.velocity.y < -500) closeOverlay();
  };

  return (
    <>
      <OverlayBackdrop onClose={closeOverlay} label="Close Control Center" />
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label="Control Center"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.35, bottom: 0.04 }}
        dragMomentum={false}
        onDragEnd={onDragEnd}
        variants={reduced ? screenFade : panelVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pickTransition(reduced, "smooth")}
        style={{ originX: 1, originY: 0 }}
        className="absolute top-[calc(var(--os-safe-top)+var(--os-status-height))] right-3 z-[35] w-[86%] max-w-[21rem] rounded-[1.75rem] os-glass-elevated p-3.5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] touch-none select-none"
      >
        <div className="grid grid-cols-2 gap-2.5">
          <Tile
            ref={firstTile}
            icon={Wind}
            label="Motion"
            value={motionEnabled ? "On" : "Reduced"}
            active={motionEnabled}
            onClick={toggleMotion}
          />
          <Tile
            icon={isDarkMode ? Moon : Sun}
            label={isDarkMode ? "Dark Mode" : "Light Mode"}
            value={isDarkMode ? "On" : "Off"}
            active={isDarkMode}
            onClick={toggleDarkMode}
          />
          <Tile
            icon={Gauge}
            label="Performance"
            value={performanceMode === "high" ? "High" : "Balanced"}
            active={performanceMode === "high"}
            onClick={() => setPerformanceMode(performanceMode === "high" ? "balanced" : "high")}
          />
          <Tile
            icon={soundEnabled ? Volume2 : VolumeX}
            label="Sound"
            value={soundEnabled ? "On" : "Off"}
            active={soundEnabled}
            onClick={toggleSound}
          />
        </div>

        <div className="mt-3 rounded-[1.25rem] bg-os-surface px-4 py-3">
          <Slider
            label="Brightness"
            value={Math.round(brightness * 100)}
            min={30}
            max={100}
            onChange={(v) => setBrightness(v / 100)}
            format={(v) => `${v}%`}
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <SmallAction icon={LayoutGrid} label="Recents" onClick={() => openOverlay("app-switcher")} />
          <SmallAction icon={Lock} label="Lock" onClick={lock} />
        </div>

        <span aria-hidden className="mx-auto mt-3 block h-1 w-10 rounded-full bg-os-border-strong" />
      </motion.section>
    </>
  );
}

interface TileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
  ref?: React.Ref<HTMLButtonElement>;
}

function Tile({ icon: Icon, label, value, active, onClick, ref }: TileProps) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${label}: ${value}`}
      className={cn(
        "flex flex-col items-start gap-3 rounded-[1.25rem] p-3.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-os-accent",
        active ? "bg-os-accent text-os-on-tint" : "bg-os-surface text-os-text-primary",
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden />
      <span className="flex flex-col">
        <span className="text-[13px] font-semibold leading-tight">{label}</span>
        <span className={cn("text-[12px]", active ? "opacity-80" : "text-os-text-tertiary")}>{value}</span>
      </span>
    </button>
  );
}

function SmallAction({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-full bg-os-surface px-4 py-2.5 text-[13px] font-semibold text-os-text-primary outline-none transition-colors hover:bg-os-surface-elevated focus-visible:ring-2 focus-visible:ring-os-accent"
    >
      <Icon className="h-4 w-4" strokeWidth={2.2} aria-hidden />
      {label}
    </button>
  );
}
