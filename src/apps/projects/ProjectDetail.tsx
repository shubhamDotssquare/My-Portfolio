"use client";

import { BookOpen, Play } from "lucide-react";
import { PROJECTS_ARE_PLACEHOLDER, type Platform, type Project } from "@/data/projects";
import { useOSStore } from "@/store/osStore";
import { Artwork } from "@/components/ui/Artwork";
import { Bullets } from "@/components/ui/Bullets";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip, ChipRow } from "@/components/ui/Chip";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { StatRow } from "@/components/ui/Stat";

const PLATFORM_LABEL: Record<Platform, string> = { ios: "iOS", android: "Android", web: "Web" };

/** App Store–style product page for one project. */
export function ProjectDetail({ project: p }: { project: Project }) {
  const openApp = useOSStore((s) => s.openApp);

  return (
    <div className="flex flex-col pb-4">
      <Reveal>
        <Artwork tint={p.tint} label={p.name} className="aspect-[16/10] w-full rounded-[1.75rem] text-[4rem]" />
      </Reveal>

      <Reveal index={1} className="mt-5 px-1">
        <h1 className="os-heading text-[1.9rem] leading-[1.1] text-os-text-primary">{p.name}</h1>
        <p className="mt-1 text-[15px] text-os-text-secondary">{p.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.platforms.map((pl) => (
            <Chip key={pl} tone="accent">
              {PLATFORM_LABEL[pl]}
            </Chip>
          ))}
          <Chip>{p.year}</Chip>
          <Chip>{p.role}</Chip>
        </div>
      </Reveal>

      {p.metrics && (
        <Reveal index={2}>
          <StatRow stats={p.metrics} placeholder={PROJECTS_ARE_PLACEHOLDER} className="mt-5" />
        </Reveal>
      )}

      <Reveal index={3}>
        <ChipRow items={p.technologies} className="mt-5 px-1" />
      </Reveal>

      {(p.demo || p.caseStudyId) && (
        <Reveal index={4} className="mt-6 flex flex-col gap-3">
          {p.demo && (
            <Button icon={Play} onClick={() => openApp("projects", { params: [p.id, "demo"] })}>
              Try App Experience
            </Button>
          )}
          {p.caseStudyId && (
            <Button
              variant="secondary"
              icon={BookOpen}
              onClick={() => openApp("case-studies", { params: [p.caseStudyId as string] })}
            >
              Read Case Study
            </Button>
          )}
        </Reveal>
      )}

      <Reveal index={5}>
        <Section title="Overview">
          <Card className="flex flex-col gap-3">
            {p.overview.map((para) => (
              <p key={para} className="text-[14px] leading-relaxed text-os-text-secondary">
                {para}
              </p>
            ))}
          </Card>
        </Section>
      </Reveal>

      <Reveal index={6}>
        <Section title="Features">
          <Card>
            <Bullets items={p.features} />
          </Card>
        </Section>
      </Reveal>

      <Reveal index={7}>
        <Section title="My Contribution">
          <Card>
            <Bullets items={p.contribution} />
          </Card>
        </Section>
      </Reveal>

      <Reveal index={8}>
        <Section title="Engineering Challenges">
          <div className="flex flex-col gap-3">
            {p.challenges.map((c) => (
              <Card key={c.title}>
                <h3 className="text-[15px] font-semibold text-os-text-primary">{c.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-os-text-secondary">{c.detail}</p>
              </Card>
            ))}
          </div>
        </Section>
      </Reveal>

      <Reveal index={8}>
        <Section title="Architecture">
          <Card>
            <Bullets items={p.architecture} />
          </Card>
        </Section>
      </Reveal>

      <Reveal index={8}>
        <Section title="Performance">
          <Card>
            <Bullets items={p.performance} />
          </Card>
        </Section>
      </Reveal>

      <Reveal index={8}>
        <Section title="Results">
          <Card>
            <Bullets items={p.results} />
          </Card>
        </Section>
      </Reveal>

      {PROJECTS_ARE_PLACEHOLDER && <PlaceholderNotice />}
    </div>
  );
}
