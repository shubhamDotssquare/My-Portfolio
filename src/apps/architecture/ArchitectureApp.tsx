"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { fades, springs } from "@/animations/spring";
import { archNodes, archRows, getArchNode, type ArchNode } from "@/data/architecture";
import { skillGroups } from "@/data/skills";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { cn, tintVar } from "@/lib/utils";
import { useOSStore } from "@/store/osStore";
import { Bullets } from "@/components/ui/Bullets";
import { Card } from "@/components/ui/Card";
import { ChipRow } from "@/components/ui/Chip";
import { InAppNotFound } from "@/components/ui/InAppNotFound";
import { LargeTitle } from "@/components/ui/LargeTitle";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import type { AppContentProps } from "../registry";

/**
 * /architecture           → diagram
 * /architecture/[node]    → diagram with that node selected + detail panel
 */
export function ArchitectureApp({ params }: AppContentProps) {
  const openApp = useOSStore((s) => s.openApp);
  const [selectedId] = params;
  const selected = selectedId ? getArchNode(selectedId) : undefined;
  const reduced = useOSReducedMotion();
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) detailRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
  }, [selected, reduced]);

  if (selectedId && !selected) return <InAppNotFound appId="architecture" noun="layer" />;

  const select = (id: string) =>
    openApp("architecture", { params: id === selectedId ? [] : [id] });

  return (
    <div className="flex flex-col pb-4">
      <Reveal>
        <LargeTitle title="Architecture" subtitle="How I structure a mobile system. Tap a layer to explore it." />
      </Reveal>

      <Reveal index={1}>
        <Diagram selectedId={selectedId} onSelect={select} />
      </Reveal>

      {selected && (
        <div ref={detailRef} className="scroll-mt-2">
          <NodeDetail key={selected.id} node={selected} />
        </div>
      )}

      <Reveal index={selected ? 0 : 2}>
        <Section title="Technology stack">
          <Card className="flex flex-col gap-3.5">
            {skillGroups.map((g) => (
              <div key={g.id} className="flex items-baseline gap-3">
                <h3 className="w-[4.5rem] shrink-0 text-[12px] font-semibold tracking-[0.1em] text-os-text-tertiary uppercase">
                  {g.title}
                </h3>
                <ChipRow items={g.skills} />
              </div>
            ))}
          </Card>
        </Section>
      </Reveal>
    </div>
  );
}

function Diagram({ selectedId, onSelect }: { selectedId?: string; onSelect: (id: string) => void }) {
  return (
    <div role="group" aria-label="Mobile architecture diagram" className="mt-6 flex flex-col items-center">
      {archRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex w-full flex-col items-center">
          {rowIndex > 0 && <Connector branches={row.length} />}
          <div className="flex w-full justify-center gap-2.5">
            {row.map((id) => {
              const node = archNodes.find((n) => n.id === id);
              if (!node) return null;
              const active = node.id === selectedId;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => onSelect(node.id)}
                  aria-pressed={active}
                  style={tintVar(node.tint)}
                  className={cn(
                    "flex min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-[13px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-os-accent",
                    row.length === 1 && "max-w-[70%]",
                    active
                      ? "border-os-accent bg-os-surface-elevated text-os-text-primary"
                      : "border-os-border bg-os-surface text-os-text-secondary hover:text-os-text-primary",
                  )}
                >
                  <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-[var(--tint)]" />
                  <span className="truncate">{node.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Decorative connector between rows; branches into `branches` columns. */
function Connector({ branches }: { branches: number }) {
  return (
    <div aria-hidden className="flex w-full flex-col items-center">
      <span className="h-3.5 w-px bg-os-border-strong" />
      {branches > 1 && (
        <>
          <span className="h-px bg-os-border-strong" style={{ width: `${Math.round(((branches - 1) / branches) * 100)}%` }} />
          <div className="flex w-full justify-around">
            {Array.from({ length: branches }).map((_, i) => (
              <span key={i} className="h-3.5 w-px bg-os-border-strong" />
            ))}
          </div>
        </>
      )}
      {branches === 1 && <span className="h-3.5 w-px bg-os-border-strong" />}
    </div>
  );
}

function NodeDetail({ node }: { node: ArchNode }) {
  const reduced = useOSReducedMotion();
  return (
    <motion.section
      aria-label={`${node.label} details`}
      style={tintVar(node.tint)}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? fades.quick : springs.smooth}
      className="mt-6"
    >
      <Card className="border-l-4 border-l-[var(--tint)]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-os-text-tertiary uppercase">
          {node.label}
        </p>
        <h2 className="mt-1 text-[16px] font-semibold text-os-text-primary">{node.technology}</h2>
        <h3 className="mt-4 mb-1.5 text-[12px] font-semibold tracking-[0.1em] text-os-text-tertiary uppercase">
          Responsibilities
        </h3>
        <Bullets items={node.responsibilities} />
      </Card>
    </motion.section>
  );
}
