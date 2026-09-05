"use client";

import { RotateCcw, Zap } from "lucide-react";
import { animate, motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { useState, type KeyboardEvent } from "react";
import { fades } from "@/animations/spring";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { tintVar } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Slider } from "@/components/ui/Slider";

const KEY_NUDGE = 60;

/**
 * Drag the card and release: a real spring (stiffness / damping / mass) returns
 * it to rest, seeded with the release velocity. Arrow keys nudge it for a
 * non-pointer path; the damping ratio explains the motion before you feel it.
 */
export function PhysicsPlayground() {
  const reduced = useOSReducedMotion();
  const [stiffness, setStiffness] = useState(320);
  const [damping, setDamping] = useState(18);
  const [mass, setMass] = useState(1);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const readX = useTransform(x, (v) => `${Math.round(v)}`);
  const readY = useTransform(y, (v) => `${Math.round(v)}`);

  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const regime =
    zeta < 0.85
      ? { label: "Underdamped", detail: "Overshoots and oscillates — bouncy." }
      : zeta <= 1.15
        ? { label: "Critically damped", detail: "Fastest settle with no overshoot." }
        : { label: "Overdamped", detail: "Slow, sluggish approach — no bounce." };

  const settle = (vx = 0, vy = 0) => {
    if (reduced) {
      animate(x, 0, fades.quick);
      animate(y, 0, fades.quick);
      return;
    }
    const spring = { type: "spring" as const, stiffness, damping, mass };
    animate(x, 0, { ...spring, velocity: vx });
    animate(y, 0, { ...spring, velocity: vy });
  };

  const onDragEnd = (_: unknown, info: PanInfo) => settle(info.velocity.x, info.velocity.y);

  const nudge = () => {
    const dir = Math.random() > 0.5 ? 1 : -1;
    x.set(120 * dir);
    y.set(-36);
    settle();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const map: Record<string, [number, number]> = {
      ArrowLeft: [-KEY_NUDGE, 0],
      ArrowRight: [KEY_NUDGE, 0],
      ArrowUp: [0, -KEY_NUDGE],
      ArrowDown: [0, KEY_NUDGE],
    };
    const d = map[e.key];
    if (!d) return;
    e.preventDefault();
    x.set(x.get() + d[0]);
    y.set(y.get() + d[1]);
    settle();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Stage */}
      <div
        className="relative h-64 touch-none overflow-hidden rounded-[1.5rem] os-glass select-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, var(--os-border-strong) 1px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
      >
        {/* Rest position marker */}
        <span aria-hidden className="absolute top-1/2 left-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-[1.6rem] border border-dashed border-os-border-strong" />

        <motion.div
          role="img"
          aria-label="Draggable card. Drag and release, or use arrow keys to nudge it."
          tabIndex={0}
          drag
          dragMomentum={false}
          onDragEnd={onDragEnd}
          onKeyDown={onKeyDown}
          whileDrag={{ scale: 1.05 }}
          style={{ x, y, rotate, ...tintVar("indigo") }}
          className="os-app-icon absolute top-1/2 left-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-[1.4rem] outline-none focus-visible:ring-2 focus-visible:ring-os-accent focus-visible:ring-offset-2 focus-visible:ring-offset-os-background active:cursor-grabbing"
        >
          <span className="text-[11px] font-bold tracking-[0.18em] opacity-90">DRAG</span>
        </motion.div>

        {/* Live readout — motion values render without React re-renders */}
        <p aria-hidden className="absolute bottom-3 left-4 font-mono text-[11px] text-os-text-tertiary tabular-nums">
          x <motion.span className="text-os-text-secondary">{readX}</motion.span>
          {"  "}y <motion.span className="text-os-text-secondary">{readY}</motion.span>
        </p>
        <p aria-hidden className="absolute right-4 bottom-3 font-mono text-[11px] text-os-text-tertiary tabular-nums">
          ζ <span className="text-os-text-secondary">{zeta.toFixed(2)}</span>
        </p>
      </div>

      {/* Controls */}
      <Card className="flex flex-col gap-4">
        <Slider label="Spring (stiffness)" value={stiffness} min={40} max={1000} step={10} onChange={setStiffness} />
        <Slider label="Damping" value={damping} min={1} max={80} onChange={setDamping} />
        <Slider label="Mass" value={mass} min={0.3} max={5} step={0.1} onChange={setMass} format={(v) => v.toFixed(1)} />
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button icon={Zap} onClick={nudge}>
          Nudge
        </Button>
        <Button
          variant="secondary"
          icon={RotateCcw}
          onClick={() => {
            setStiffness(320);
            setDamping(18);
            setMass(1);
            settle();
          }}
        >
          Reset
        </Button>
      </div>

      <Card>
        <p className="text-[12px] font-semibold tracking-[0.1em] text-os-text-tertiary uppercase">
          Damping ratio ζ = {zeta.toFixed(2)}
        </p>
        <p className="mt-1 text-[15px] font-semibold text-os-text-primary">{regime.label}</p>
        <p className="mt-0.5 text-[14px] text-os-text-secondary">{regime.detail}</p>
      </Card>

      <CodeBlock
        code={`animate(x, 0, {\n  type: "spring",\n  stiffness: ${stiffness},\n  damping: ${damping},\n  mass: ${mass.toFixed(1)},\n  velocity: releaseVelocity,\n})`}
      />
    </div>
  );
}
