"use client";

import { ArrowRight, FolderKanban } from "lucide-react";
import {
  CASE_STUDIES_ARE_PLACEHOLDER,
  CASE_STUDY_FLOW,
  caseStudies,
  getCaseStudy,
  type CaseStudy,
} from "@/data/caseStudies";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { useOSStore } from "@/store/osStore";
import { Artwork } from "@/components/ui/Artwork";
import { Bullets } from "@/components/ui/Bullets";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { InAppNotFound } from "@/components/ui/InAppNotFound";
import { LargeTitle } from "@/components/ui/LargeTitle";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { StatRow } from "@/components/ui/Stat";
import type { AppContentProps } from "../registry";

export function CaseStudiesApp({ params }: AppContentProps) {
  const [slug] = params;
  if (!slug) return <CaseStudyList />;
  const study = getCaseStudy(slug);
  if (!study || params.length > 1) return <InAppNotFound appId="case-studies" noun="case study" />;
  return <CaseStudyDetail study={study} />;
}

function CaseStudyList() {
  const openApp = useOSStore((s) => s.openApp);
  return (
    <div className="flex flex-col pb-4">
      <Reveal>
        <LargeTitle title="Case Studies" subtitle="Problem → Constraints → Architecture → Outcome." />
      </Reveal>
      <ul className="mt-6 flex flex-col gap-3">
        {caseStudies.map((c, i) => (
          <Reveal key={c.id} index={i + 1}>
            <li>
              <button
                type="button"
                onClick={() => openApp("case-studies", { params: [c.id] })}
                className="os-glass flex w-full items-center gap-4 rounded-[1.35rem] p-4 text-left outline-none transition-colors hover:bg-os-surface-elevated focus-visible:ring-2 focus-visible:ring-os-accent"
              >
                <Artwork tint={c.tint} label={c.title} className="h-14 w-14 shrink-0 rounded-2xl text-[1.1rem]" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-semibold text-os-text-primary">{c.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-os-text-secondary">{c.subtitle}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-os-text-tertiary" aria-hidden />
              </button>
            </li>
          </Reveal>
        ))}
      </ul>
      {CASE_STUDIES_ARE_PLACEHOLDER && <PlaceholderNotice />}
    </div>
  );
}

function CaseStudyDetail({ study }: { study: CaseStudy }) {
  const openApp = useOSStore((s) => s.openApp);
  const reduced = useOSReducedMotion();

  const jump = (id: string) => {
    document
      .getElementById(`step-${study.id}-${id}`)
      ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col pb-4">
      <Reveal>
        <div className="flex items-start gap-4 px-1">
          <Artwork tint={study.tint} label={study.title} className="h-16 w-16 shrink-0 rounded-[1.25rem] text-[1.3rem]" />
          <div className="min-w-0">
            <h1 className="os-heading text-[1.7rem] leading-[1.1] text-os-text-primary">{study.title}</h1>
            <p className="mt-1 text-[14px] leading-snug text-os-text-secondary">{study.subtitle}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5 px-1">
          <Chip tone="accent">{study.role}</Chip>
          <Chip>{study.timeline}</Chip>
        </div>
      </Reveal>

      {/* Flow rail — jump links for the eight steps */}
      <Reveal index={1}>
        <nav aria-label="Case study steps" className="-mx-5 mt-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <ol className="flex gap-2">
            {CASE_STUDY_FLOW.map((step, i) => (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => jump(step.id)}
                  className="flex items-center gap-1.5 rounded-full border border-os-border bg-os-surface px-3 py-1.5 text-[12px] font-medium whitespace-nowrap text-os-text-secondary outline-none hover:text-os-text-primary focus-visible:ring-2 focus-visible:ring-os-accent"
                >
                  <span className="text-os-text-tertiary tabular-nums">{i + 1}</span>
                  {step.title}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </Reveal>

      {CASE_STUDY_FLOW.map((step, i) => {
        const s = study.sections[step.id];
        return (
          <Reveal key={step.id} index={Math.min(i + 2, 8)}>
            <Section id={`step-${study.id}-${step.id}`} title={`${i + 1} · ${step.title}`}>
              <Card className="flex flex-col gap-3">
                <p className="text-[14px] leading-relaxed text-os-text-secondary">{s.body}</p>
                {s.bullets && <Bullets items={s.bullets} />}
              </Card>
            </Section>
          </Reveal>
        );
      })}

      <Reveal index={8}>
        <Section title="Measured outcome">
          <StatRow stats={study.outcomes} placeholder={CASE_STUDIES_ARE_PLACEHOLDER} />
        </Section>
      </Reveal>

      <Reveal index={8} className="mt-7">
        <Button
          variant="secondary"
          icon={FolderKanban}
          onClick={() => openApp("projects", { params: [study.projectId] })}
          className="w-full"
        >
          View Project
        </Button>
      </Reveal>

      {CASE_STUDIES_ARE_PLACEHOLDER && <PlaceholderNotice />}
    </div>
  );
}
