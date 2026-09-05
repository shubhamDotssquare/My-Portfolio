"use client";

import { Bell, Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { fades, springs } from "@/animations/spring";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";

type Density = "compact" | "cozy" | "roomy";
const DENSITY = [
  { value: "compact", label: "Compact" },
  { value: "cozy", label: "Cozy" },
  { value: "roomy", label: "Roomy" },
] as const satisfies readonly { value: Density; label: string }[];

/** Small primitives with correct semantics and shared motion tokens. */
export function ComponentLab() {
  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-col gap-4">
        <Row label="Switch" hint="role=switch · layout-animated knob">
          <Switch />
        </Row>
        <Row label="Segmented" hint="radiogroup · arrow keys · shared indicator">
          <SegmentedDemo />
        </Row>
        <Row label="Stepper" hint="digits slide in the direction of change">
          <Stepper />
        </Row>
        <Row label="Toast" hint="live region · auto-dismiss · exit animates">
          <ToastDemo />
        </Row>
      </Card>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3 px-1">
        <span className="text-[13px] font-semibold text-os-text-primary">{label}</span>
        <span className="truncate text-[11px] text-os-text-tertiary">{hint}</span>
      </div>
      {children}
    </div>
  );
}

function Switch() {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-center justify-between rounded-2xl bg-os-surface px-4 py-3">
      <span id="switch-label" className="text-[14px] text-os-text-secondary">
        Haptic-style feedback
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby="switch-label"
        onClick={() => setOn((v) => !v)}
        className={cn(
          "flex h-8 w-14 items-center rounded-full p-1 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-os-accent focus-visible:ring-offset-2 focus-visible:ring-offset-os-background",
          on ? "justify-end bg-os-success" : "justify-start bg-os-border-strong",
        )}
      >
        <motion.span layout transition={springs.snappy} className="block h-6 w-6 rounded-full bg-os-on-tint shadow-[0_2px_6px_rgba(0,0,0,0.35)]" />
      </button>
    </div>
  );
}

function SegmentedDemo() {
  const [density, setDensity] = useState<Density>("cozy");
  const pad = { compact: "py-1.5", cozy: "py-2.5", roomy: "py-4" }[density];
  return (
    <div className="flex flex-col gap-2">
      <Segmented options={DENSITY} value={density} onChange={setDensity} ariaLabel="List density" />
      <motion.ul layout transition={springs.smooth} className="flex flex-col gap-1.5" aria-label="Preview list">
        {["Inbox", "Starred", "Archive"].map((t) => (
          <motion.li key={t} layout transition={springs.smooth} className={cn("rounded-xl bg-os-surface px-3 text-[13px] text-os-text-secondary", pad)}>
            {t}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

function Stepper() {
  const reduced = useOSReducedMotion();
  const [count, setCount] = useState(2);
  const [dir, setDir] = useState(1);
  const step = (d: number) => {
    setDir(d);
    setCount((c) => Math.min(9, Math.max(0, c + d)));
  };
  return (
    <div className="flex items-center justify-between rounded-2xl bg-os-surface px-4 py-3">
      <span className="text-[14px] text-os-text-secondary">Guests</span>
      <div className="flex items-center gap-3">
        <StepButton icon={Minus} label="Decrease" onClick={() => step(-1)} disabled={count === 0} />
        <span className="relative block h-7 w-6 overflow-hidden text-center" aria-live="polite" aria-atomic>
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.span
              key={count}
              custom={dir}
              variants={{
                enter: (d: number) => (reduced ? { opacity: 0 } : { y: d * 18, opacity: 0 }),
                center: { y: 0, opacity: 1 },
                exit: (d: number) => (reduced ? { opacity: 0 } : { y: -d * 18, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={reduced ? fades.quick : springs.snappy}
              className="absolute inset-0 text-[17px] font-semibold text-os-text-primary tabular-nums"
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </span>
        <StepButton icon={Plus} label="Increase" onClick={() => step(1)} disabled={count === 9} />
      </div>
    </div>
  );
}

function StepButton({ icon: Icon, label, onClick, disabled }: { icon: typeof Plus; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.9 }}
      transition={springs.snappy}
      className="flex h-8 w-8 items-center justify-center rounded-full os-glass-elevated text-os-text-primary outline-none focus-visible:ring-2 focus-visible:ring-os-accent disabled:opacity-40"
    >
      <Icon className="h-4 w-4" aria-hidden />
    </motion.button>
  );
}

function ToastDemo() {
  const reduced = useOSReducedMotion();
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ id: Date.now(), text: "Saved to your library" });
    timer.current = setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="relative h-24 overflow-hidden rounded-2xl bg-os-surface">
      <div className="absolute inset-x-0 bottom-3 flex justify-center">
        <Button variant="secondary" icon={Bell} onClick={show} className="px-4 py-2 text-[13px]">
          Show toast
        </Button>
      </div>
      <div role="status" aria-live="polite" className="absolute inset-x-0 top-3 flex justify-center">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
              transition={reduced ? fades.quick : springs.snappy}
              className="rounded-full os-glass-elevated px-4 py-2 text-[13px] font-medium text-os-text-primary"
            >
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
