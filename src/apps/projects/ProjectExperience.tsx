"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { fades, springs } from "@/animations/spring";
import type { Project } from "@/data/projects";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { cn, tintVar } from "@/lib/utils";
import { Bullets } from "@/components/ui/Bullets";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LargeTitle } from "@/components/ui/LargeTitle";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/**
 * A curated, data-driven mini experience (2–5 screens) — not a fake full app.
 * Screen state is local to the demo; OS navigation stays in the store.
 */
export function ProjectExperience({ project }: { project: Project }) {
  const demo = project.demo;
  const reduced = useOSReducedMotion();
  const [index, setIndex] = useState(0);
  if (!demo) return null;

  const screen = demo.screens[index];
  const next = () => setIndex((i) => (i + 1) % demo.screens.length);

  const slide = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: 40 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -40 },
      };

  return (
    <div className="flex flex-col pb-4">
      <Reveal>
        <LargeTitle
          eyebrow="Interactive experience"
          title={project.name}
          subtitle={`A curated ${demo.screens.length}-screen slice of the product.`}
        />
      </Reveal>

      <Reveal index={1} className="mt-5">
        <section
          aria-label={`${demo.brand} experience`}
          style={tintVar(demo.tint)}
          className="overflow-hidden rounded-[1.75rem] border border-os-border shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)]"
        >
          {/* Tinted header */}
          <div className="os-app-icon rounded-none px-5 pt-5 pb-9">
            <p className="text-[11px] font-bold tracking-[0.22em] opacity-85">{demo.brand}</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={screen.id} {...slide} transition={reduced ? fades.quick : springs.smooth} className="mt-4">
                <h2 className="os-heading text-[1.5rem] leading-tight">{screen.title}</h2>
                {screen.subtitle && <p className="mt-1 text-[14px] opacity-85">{screen.subtitle}</p>}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Content sheet */}
          <div className="-mt-5 rounded-t-[1.5rem] bg-os-surface-elevated px-4 pt-4 pb-4 backdrop-blur-xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.ul key={screen.id} {...slide} transition={reduced ? fades.quick : springs.smooth} className="flex flex-col gap-2.5">
                {screen.cards.map((c) => (
                  <li key={c.title} className="rounded-2xl border border-os-border bg-os-surface px-4 py-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[13px] font-medium text-os-text-secondary">{c.title}</span>
                      {c.value && (
                        <span className="text-[15px] font-semibold text-os-text-primary tabular-nums">{c.value}</span>
                      )}
                    </div>
                    {typeof c.progress === "number" && (
                      <ProgressBar value={c.progress} label={c.title} tinted className="mt-2.5" />
                    )}
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>

            <Button variant="tint" onClick={next} className="mt-4 w-full">
              {screen.primaryAction}
            </Button>

            <ol className="mt-3 flex justify-center gap-1.5" aria-label="Screens">
              {demo.screens.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Screen ${i + 1}: ${s.title}`}
                    aria-current={i === index ? "step" : undefined}
                    className={cn(
                      "block h-1.5 rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-os-accent",
                      i === index ? "w-5 bg-os-text-primary" : "w-1.5 bg-os-border-strong",
                    )}
                  />
                </li>
              ))}
            </ol>
          </div>
        </section>
      </Reveal>

      <Reveal index={2}>
        <Section title="How it's built">
          <Card>
            <Bullets
              items={[
                "Screens are data — content lives in src/data/projects.ts, not in components.",
                "Transitions use the OS spring tokens and fall back to fades under reduced motion.",
                "Screen state is local to the demo; OS navigation and history stay in the store.",
              ]}
            />
          </Card>
        </Section>
      </Reveal>
    </div>
  );
}
