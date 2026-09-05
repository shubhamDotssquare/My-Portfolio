"use client";

import type { ReactNode } from "react";
import type { Experiment } from "@/data/lab";
import { Bullets } from "@/components/ui/Bullets";
import { Card } from "@/components/ui/Card";
import { LargeTitle } from "@/components/ui/LargeTitle";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/** Shared chrome for an experiment: title, the live stage, then the technical notes. */
export function ExperimentFrame({ experiment, children }: { experiment: Experiment; children: ReactNode }) {
  return (
    <div className="flex flex-col pb-4">
      <Reveal>
        <LargeTitle eyebrow="Developer Lab" title={experiment.title} subtitle={experiment.summary} />
      </Reveal>

      <Reveal index={1} className="mt-5">
        {children}
      </Reveal>

      <Reveal index={2}>
        <Section title="Technique">
          <Card className="flex flex-col gap-3">
            <p className="text-[14px] leading-relaxed text-os-text-secondary">{experiment.technique}</p>
            <div>
              <h3 className="mb-1.5 text-[12px] font-semibold tracking-[0.1em] text-os-text-tertiary uppercase">
                Use cases
              </h3>
              <Bullets items={experiment.useCases} />
            </div>
          </Card>
        </Section>
      </Reveal>
    </div>
  );
}
