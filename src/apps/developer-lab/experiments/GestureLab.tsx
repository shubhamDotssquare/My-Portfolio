"use client";

import { ArrowDown, ArrowLeft, ArrowRight, Check, Inbox, RefreshCw, Trash2 } from "lucide-react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { fades, springs } from "@/animations/spring";
import { gestures, type GestureId } from "@/data/lab";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import { Bullets } from "@/components/ui/Bullets";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Segmented } from "@/components/ui/Segmented";

const OPTIONS = gestures.map((g) => ({ value: g.id, label: g.label }));

export function GestureLab() {
  const [gesture, setGesture] = useState<GestureId>("swipe");
  const info = gestures.find((g) => g.id === gesture)!;

  return (
    <div className="flex flex-col gap-4">
      <Segmented options={OPTIONS} value={gesture} onChange={setGesture} ariaLabel="Gesture" />

      <div className="relative">
        {gesture === "swipe" && <SwipeDemo />}
        {gesture === "dismiss" && <DismissDemo />}
        {gesture === "long-press" && <LongPressDemo />}
        {gesture === "sheet" && <SheetDemo />}
        {gesture === "pull" && <PullDemo />}
      </div>

      <Card className="flex flex-col gap-3">
        <div>
          <p className="text-[12px] font-semibold tracking-[0.1em] text-os-text-tertiary uppercase">Gesture</p>
          <p className="mt-0.5 text-[15px] font-semibold text-os-text-primary">{info.title}</p>
        </div>
        <div>
          <p className="text-[12px] font-semibold tracking-[0.1em] text-os-text-tertiary uppercase">Technique</p>
          <p className="mt-0.5 text-[14px] leading-relaxed text-os-text-secondary">{info.technique}</p>
        </div>
        <div>
          <p className="mb-1 text-[12px] font-semibold tracking-[0.1em] text-os-text-tertiary uppercase">Use cases</p>
          <Bullets items={info.useCases} />
        </div>
        <p className="text-[12px] text-os-text-tertiary">Alternative: {info.alternative}</p>
      </Card>
    </div>
  );
}

const stageClass = "relative h-72 touch-none overflow-hidden rounded-[1.5rem] os-glass select-none";

/* ------------------------------- Swipe ------------------------------- */

function SwipeDemo() {
  const reduced = useOSReducedMotion();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-10, 10]);
  const leftHint = useTransform(x, [-120, -24], [1, 0]);
  const rightHint = useTransform(x, [24, 120], [0, 1]);
  const [result, setResult] = useState<string>("Drag the card past the edge markers.");

  const commit = (dir: number) => setResult(dir > 0 ? "Swiped right" : "Swiped left");

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 600)
      commit(Math.sign(info.offset.x || info.velocity.x));
  };

  const swipe = (dir: number) => {
    animate(x, 150 * dir, reduced ? fades.quick : springs.snappy).then(() =>
      animate(x, 0, reduced ? fades.quick : springs.smooth),
    );
    commit(dir);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className={stageClass}>
        <motion.span aria-hidden style={{ opacity: leftHint }} className="absolute top-1/2 left-4 -translate-y-1/2 text-os-danger">
          <Trash2 className="h-6 w-6" />
        </motion.span>
        <motion.span aria-hidden style={{ opacity: rightHint }} className="absolute top-1/2 right-4 -translate-y-1/2 text-os-success">
          <Check className="h-6 w-6" />
        </motion.span>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          style={{ x, rotate }}
          whileDrag={{ scale: 1.02 }}
          role="img"
          aria-label="Swipeable card"
          className="absolute inset-x-12 top-1/2 flex h-36 -translate-y-1/2 cursor-grab flex-col justify-between rounded-2xl os-glass-elevated p-4 active:cursor-grabbing"
        >
          <span className="text-[12px] font-semibold tracking-[0.1em] text-os-text-tertiary uppercase">Message</span>
          <span className="text-[15px] font-medium text-os-text-primary">Swipe me left or right</span>
        </motion.div>

        <p role="status" aria-live="polite" className="absolute inset-x-0 bottom-3 text-center text-[12px] text-os-text-tertiary">
          {result}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" icon={ArrowLeft} onClick={() => swipe(-1)}>
          Swipe left
        </Button>
        <Button variant="secondary" icon={ArrowRight} onClick={() => swipe(1)}>
          Swipe right
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------ Dismiss ------------------------------ */

const DECK = ["Design review at 3pm", "Standup notes", "Release checklist", "Retro action items"];

function DismissDemo() {
  const [cards, setCards] = useState(DECK);
  const [dir, setDir] = useState(1);

  const dismiss = (d: number) => {
    setDir(d);
    setCards((c) => c.slice(1));
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100 || Math.abs(info.velocity.x) > 700)
      dismiss(Math.sign(info.offset.x || info.velocity.x) || 1);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className={stageClass}>
        <AnimatePresence custom={dir}>
          {cards
            .slice(0, 3)
            .map((c, depth) => ({ c, depth }))
            .reverse()
            .map(({ c, depth }) => (
              <motion.div
                key={c}
                layout
                custom={dir}
                drag={depth === 0 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                dragMomentum={false}
                onDragEnd={onDragEnd}
                initial={false}
                animate={{ scale: 1 - depth * 0.05, y: depth * 14, opacity: 1 - depth * 0.15 }}
                variants={{ exit: (d: number) => ({ x: d * 420, rotate: d * 10, opacity: 0 }) }}
                exit="exit"
                transition={springs.smooth}
                role={depth === 0 ? "img" : undefined}
                aria-label={depth === 0 ? `Top card: ${c}. Drag sideways to dismiss.` : undefined}
                aria-hidden={depth !== 0}
                className={cn(
                  "absolute inset-x-8 top-8 flex h-40 flex-col justify-between rounded-2xl os-glass-elevated p-4",
                  depth === 0 && "cursor-grab active:cursor-grabbing",
                )}
              >
                <span className={cn("text-[12px] font-semibold tracking-[0.1em] text-os-text-tertiary uppercase", depth > 0 && "invisible")}>
                  Card {DECK.indexOf(c) + 1} of {DECK.length}
                </span>
                <span className={cn("text-[16px] font-medium text-os-text-primary", depth > 0 && "invisible")}>{c}</span>
              </motion.div>
            ))}
        </AnimatePresence>
        {cards.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-[14px] text-os-text-tertiary">
            All caught up.
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" icon={Trash2} onClick={() => dismiss(-1)} disabled={cards.length === 0}>
          Dismiss
        </Button>
        <Button variant="secondary" icon={RefreshCw} onClick={() => setCards(DECK)}>
          Reset deck
        </Button>
      </div>
    </div>
  );
}

/* ----------------------------- Long press ---------------------------- */

const HOLD_MS = 600;

function LongPressDemo() {
  const reduced = useOSReducedMotion();
  const progress = useMotionValue(0);
  const [held, setHeld] = useState(false);
  const controls = useRef<ReturnType<typeof animate> | null>(null);
  // The pointer-up / key-up that ends a successful hold also fires a click;
  // swallow that one so it doesn't immediately reset.
  const swallowClick = useRef(false);

  const start = () => {
    if (held) return;
    controls.current?.stop();
    controls.current = animate(progress, 1, {
      duration: HOLD_MS / 1000,
      ease: "linear",
      onComplete: () => {
        swallowClick.current = true;
        setHeld(true);
      },
    });
  };
  const cancel = () => {
    if (held) return;
    controls.current?.stop();
    animate(progress, 0, fades.quick);
  };
  const reset = () => {
    setHeld(false);
    animate(progress, 0, fades.quick);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === " " || e.key === "Enter") && !e.repeat) {
      e.preventDefault();
      if (held) reset();
      else start();
    }
  };
  const onKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") cancel();
  };

  return (
    <div className={cn(stageClass, "flex flex-col items-center justify-center gap-4")}>
      <button
        type="button"
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onClick={() => {
          if (swallowClick.current) {
            swallowClick.current = false;
            return;
          }
          if (held) reset();
        }}
        aria-pressed={held}
        aria-label={held ? "Held. Press to reset." : "Press and hold for 600 milliseconds"}
        className="relative flex h-32 w-32 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-os-accent focus-visible:ring-offset-2 focus-visible:ring-offset-os-background"
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
          <circle cx="50" cy="50" r="44" fill="none" stroke="var(--os-border-strong)" strokeWidth="6" />
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={held ? "var(--os-success)" : "var(--os-accent)"}
            strokeWidth="6"
            strokeLinecap="round"
            style={{ pathLength: progress }}
          />
        </svg>
        <motion.span
          animate={held ? { scale: reduced ? 1 : [1, 1.12, 1] } : { scale: 1 }}
          transition={held ? { duration: 0.4, ease: "easeInOut" } : springs.snappy}
          className={cn(
            "flex h-24 w-24 items-center justify-center rounded-full text-[13px] font-semibold",
            held ? "bg-os-success text-os-on-tint" : "os-glass-elevated text-os-text-primary",
          )}
        >
          {held ? <Check className="h-8 w-8" aria-hidden /> : "Hold"}
        </motion.span>
      </button>
      <p role="status" aria-live="polite" className="text-[12px] text-os-text-tertiary">
        {held ? "Long press recognised — tap to reset." : "Press and hold · or hold Space when focused"}
      </p>
    </div>
  );
}

/* ------------------------------- Sheet ------------------------------- */

const SHEET_H = 288; // matches h-72 stage
const SNAPS = { collapsed: SHEET_H - 76, half: SHEET_H * 0.5, full: 14 } as const;
type Snap = keyof typeof SNAPS;

function SheetDemo() {
  const reduced = useOSReducedMotion();
  const y = useMotionValue<number>(SNAPS.collapsed);
  const [snap, setSnap] = useState<Snap>("collapsed");
  const backdrop = useTransform(y, [SNAPS.full, SNAPS.collapsed], [0.45, 0]);

  const snapTo = (k: Snap) => {
    setSnap(k);
    animate(y, SNAPS[k], reduced ? fades.quick : springs.smooth);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const projected = y.get() + info.velocity.y * 0.12;
    const nearest = (Object.keys(SNAPS) as Snap[]).reduce((best, k) =>
      Math.abs(SNAPS[k] - projected) < Math.abs(SNAPS[best] - projected) ? k : best,
    );
    snapTo(nearest);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className={stageClass}>
        <div className="p-4">
          <p className="text-[12px] font-semibold tracking-[0.1em] text-os-text-tertiary uppercase">Map view</p>
          <p className="mt-1 text-[14px] text-os-text-secondary">Content behind the sheet dims as it rises.</p>
        </div>
        <motion.div aria-hidden style={{ opacity: backdrop }} className="pointer-events-none absolute inset-0 bg-black" />

        <motion.section
          aria-label="Bottom sheet"
          drag="y"
          dragConstraints={{ top: SNAPS.full, bottom: SNAPS.collapsed }}
          dragElastic={0.06}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          style={{ y }}
          className="absolute inset-x-0 top-0 h-full cursor-grab rounded-t-[1.5rem] os-glass-elevated px-4 pt-2 active:cursor-grabbing"
        >
          <span aria-hidden className="mx-auto mb-3 block h-1.5 w-12 rounded-full bg-os-border-strong" />
          <p className="text-[15px] font-semibold text-os-text-primary">Nearby places</p>
          <p className="mt-0.5 text-[13px] text-os-text-secondary">Drag the handle · snaps to {snap}</p>
          <ul className="mt-3 flex flex-col gap-2" aria-hidden>
            {["Coffee · 2 min", "Gym · 6 min", "Library · 9 min"].map((t) => (
              <li key={t} className="rounded-xl bg-os-surface px-3 py-2 text-[13px] text-os-text-secondary">
                {t}
              </li>
            ))}
          </ul>
        </motion.section>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {(["collapsed", "half", "full"] as Snap[]).map((k) => (
          <Button
            key={k}
            variant={snap === k ? "primary" : "secondary"}
            onClick={() => snapTo(k)}
            aria-pressed={snap === k}
            className="px-3 capitalize"
          >
            {k}
          </Button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Pull -------------------------------- */

const PULL_THRESHOLD = 72;
const INITIAL_ITEMS = ["Build passed on main", "New comment on PR #42", "Deploy preview ready", "Weekly digest"];

function PullDemo() {
  const reduced = useOSReducedMotion();
  const y = useMotionValue(0);
  const indicatorOpacity = useTransform(y, [8, PULL_THRESHOLD], [0, 1]);
  const indicatorRotate = useTransform(y, [0, PULL_THRESHOLD], [0, 180]);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [refreshing, setRefreshing] = useState(false);
  const [count, setCount] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    timer.current = setTimeout(() => {
      setCount((c) => c + 1);
      setItems((list) => [`Fresh item #${count + 1} · just now`, ...list].slice(0, 5));
      setRefreshing(false);
    }, 1100);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > PULL_THRESHOLD) refresh();
    animate(y, 0, reduced ? fades.quick : springs.smooth);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className={stageClass}>
        <motion.div
          aria-hidden
          style={{ opacity: refreshing ? 1 : indicatorOpacity }}
          className="absolute inset-x-0 top-3 flex justify-center text-os-accent"
        >
          <motion.span
            style={{ rotate: refreshing ? undefined : indicatorRotate }}
            animate={refreshing && !reduced ? { rotate: 360 } : undefined}
            transition={refreshing ? { duration: 0.8, repeat: Infinity, ease: "linear" } : undefined}
            className="inline-flex"
          >
            {refreshing ? <RefreshCw className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
          </motion.span>
        </motion.div>

        <motion.ul
          aria-label="Inbox"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0.55, bottom: 0 }}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          style={{ y }}
          className="absolute inset-x-3 top-3 flex cursor-grab flex-col gap-2 active:cursor-grabbing"
        >
          <AnimatePresence initial={false}>
            {items.map((t) => (
              <motion.li
                key={t}
                layout
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={reduced ? fades.quick : springs.smooth}
                className="flex items-center gap-3 rounded-xl os-glass-elevated px-3 py-2.5 text-[13px] text-os-text-primary"
              >
                <Inbox className="h-4 w-4 shrink-0 text-os-text-tertiary" aria-hidden />
                <span className="truncate">{t}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <p role="status" aria-live="polite" className="absolute inset-x-0 bottom-3 text-center text-[12px] text-os-text-tertiary">
          {refreshing ? "Refreshing…" : "Pull the list down to refresh"}
        </p>
      </div>
      <Button variant="secondary" icon={RefreshCw} onClick={refresh} disabled={refreshing}>
        Refresh
      </Button>
    </div>
  );
}
