"use client";

import { Play, Shuffle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { fades, springs } from "@/animations/spring";
import { animations, type AnimationKind } from "@/data/lab";
import { cn, tintVar } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Segmented } from "@/components/ui/Segmented";

const OPTIONS = animations.map((a) => ({ value: a.id, label: a.label }));
const TIMING = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };
const TRACK = 168; // px travel inside the stage
const TILES = ["indigo", "violet", "cyan", "emerald", "amber", "rose"] as const;

/** One live component; the selected technique changes what a "Play" does. */
export function AnimationLab() {
  const [kind, setKind] = useState<AnimationKind>("spring");
  const [on, setOn] = useState(false);
  const [order, setOrder] = useState<readonly (typeof TILES)[number][]>(TILES);
  const [expanded, setExpanded] = useState<string | null>(null);
  const info = animations.find((a) => a.id === kind)!;

  const play = () => {
    if (kind === "layout") setOrder((o) => [...o].sort(() => Math.random() - 0.5));
    else if (kind === "shared") setExpanded((e) => (e ? null : TILES[0]));
    else setOn((v) => !v);
  };

  return (
    <div className="flex flex-col gap-4">
      <Segmented options={OPTIONS} value={kind} onChange={(k) => { setKind(k); setOn(false); setExpanded(null); }} ariaLabel="Animation technique" />

      <div className="relative flex h-60 items-center justify-center overflow-hidden rounded-[1.5rem] os-glass">
        {(kind === "spring" || kind === "timing") && (
          <div className="relative h-16" style={{ width: TRACK + 64 }}>
            <span aria-hidden className="absolute inset-y-1/2 inset-x-8 h-px bg-os-border-strong" />
            <motion.div
              aria-hidden
              animate={{ x: on ? TRACK : 0 }}
              transition={kind === "spring" ? springs.smooth : TIMING}
              style={tintVar(kind === "spring" ? "indigo" : "amber")}
              className="os-app-icon absolute top-0 left-0 h-16 w-16 rounded-[1.25rem]"
            />
          </div>
        )}

        {kind === "fade" && (
          <motion.div
            aria-hidden
            animate={{ opacity: on ? 0.08 : 1 }}
            transition={fades.standard}
            style={tintVar("sky")}
            className="os-app-icon h-24 w-24 rounded-[1.6rem]"
          />
        )}

        {kind === "scale" && (
          <motion.button
            type="button"
            onClick={() => setOn((v) => !v)}
            aria-label="Scale demo — press to toggle"
            whileTap={{ scale: 0.94 }}
            animate={{ scale: on ? 1.4 : 1 }}
            transition={springs.snappy}
            style={tintVar("rose")}
            className="os-app-icon h-20 w-20 rounded-[1.4rem] outline-none focus-visible:ring-2 focus-visible:ring-os-accent"
          />
        )}

        {kind === "slide" && (
          <div className="relative h-full w-full">
            <p className="absolute top-1/2 left-6 -translate-y-1/2 text-[14px] text-os-text-tertiary">
              {on ? "Panel in" : "Panel out"}
            </p>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  aria-hidden
                  initial={{ x: 140, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 140, opacity: 0 }}
                  transition={springs.smooth}
                  className="absolute inset-y-4 right-4 w-40 rounded-2xl os-glass-elevated p-4"
                >
                  <span className="block h-2 w-16 rounded-full bg-os-border-strong" />
                  <span className="mt-2 block h-2 w-24 rounded-full bg-os-border" />
                  <span className="mt-2 block h-2 w-20 rounded-full bg-os-border" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {kind === "layout" && (
          <ul aria-label="Reorderable tiles" className="grid grid-cols-3 gap-3">
            {order.map((t) => (
              <motion.li
                key={t}
                layout
                transition={springs.smooth}
                style={tintVar(t)}
                className="os-app-icon flex h-14 w-14 items-center justify-center rounded-2xl text-[11px] font-bold tracking-[0.1em] uppercase"
              >
                {t.slice(0, 3)}
              </motion.li>
            ))}
          </ul>
        )}

        {kind === "shared" && (
          <div className="relative h-full w-full p-4">
            <div className="flex gap-3">
              {TILES.slice(0, 3).map((t) => (
                <motion.button
                  key={t}
                  type="button"
                  layoutId={`shared-${t}`}
                  onClick={() => setExpanded(t)}
                  aria-label={`Expand ${t} tile`}
                  transition={springs.smooth}
                  style={{ ...tintVar(t), borderRadius: 16 }}
                  className={cn("os-app-icon h-14 w-14 outline-none focus-visible:ring-2 focus-visible:ring-os-accent", expanded === t && "invisible")}
                />
              ))}
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.button
                  type="button"
                  layoutId={`shared-${expanded}`}
                  onClick={() => setExpanded(null)}
                  aria-label={`Collapse ${expanded} tile`}
                  transition={springs.smooth}
                  style={{ ...tintVar(expanded), borderRadius: 24 }}
                  className="os-app-icon absolute inset-x-4 top-4 bottom-4 flex items-end p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-os-accent"
                >
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.15 } }} exit={{ opacity: 0 }} className="text-[13px] font-semibold capitalize">
                    {expanded} · shared element
                  </motion.span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Button icon={kind === "layout" ? Shuffle : Play} onClick={play}>
        {kind === "layout" ? "Shuffle" : kind === "shared" ? (expanded ? "Collapse" : "Expand") : on ? "Reverse" : "Play"}
      </Button>

      <Card>
        <p className="text-[12px] font-semibold tracking-[0.1em] text-os-text-tertiary uppercase">When to use</p>
        <p className="mt-1 text-[14px] leading-relaxed text-os-text-secondary">{info.when}</p>
      </Card>
      <CodeBlock code={info.code} />
    </div>
  );
}
