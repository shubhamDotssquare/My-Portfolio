"use client";

import { GraduationCap } from "lucide-react";
import { education, EXPERIENCE_IS_PLACEHOLDER, roles } from "@/data/experience";
import { Bullets } from "@/components/ui/Bullets";
import { Card } from "@/components/ui/Card";
import { ChipRow } from "@/components/ui/Chip";
import { LargeTitle } from "@/components/ui/LargeTitle";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { TintIcon } from "@/components/ui/TintIcon";

export function ExperienceApp() {
  return (
    <div className="flex flex-col pb-4">
      <Reveal>
        <LargeTitle title="Experience" subtitle="Roles, responsibilities and impact." />
      </Reveal>

      <ol className="relative mt-7 ml-3 flex flex-col gap-7 border-l border-os-border-strong pl-6">
        {roles.map((r, i) => (
          <Reveal key={r.id} index={i + 1}>
            <li className="relative">
              <span
                aria-hidden
                className="absolute top-1.5 -left-[1.95rem] h-3 w-3 rounded-full bg-os-accent ring-4 ring-os-background"
              />
              <p className="text-[12px] font-semibold tracking-[0.08em] text-os-text-tertiary uppercase tabular-nums">
                {r.start} — {r.end}
              </p>
              <h2 className="os-heading mt-1 text-[1.25rem] leading-tight text-os-text-primary">{r.role}</h2>
              <p className="mt-0.5 text-[14px] text-os-text-secondary">
                {r.company}
                {r.location ? ` · ${r.location}` : ""}
              </p>

              <Card className="mt-3 flex flex-col gap-4">
                <p className="text-[14px] leading-relaxed text-os-text-secondary">{r.summary}</p>
                <div>
                  <h3 className="mb-1.5 text-[12px] font-semibold tracking-[0.1em] text-os-text-tertiary uppercase">
                    Responsibilities
                  </h3>
                  <Bullets items={r.responsibilities} />
                </div>
                <div>
                  <h3 className="mb-1.5 text-[12px] font-semibold tracking-[0.1em] text-os-text-tertiary uppercase">
                    Impact
                  </h3>
                  <Bullets items={r.impact} />
                </div>
                <ChipRow items={r.technologies} />
              </Card>
            </li>
          </Reveal>
        ))}
      </ol>

      <Reveal index={roles.length + 1}>
        <Section title="Education">
          <ListGroup>
            {education.map((e) => (
              <ListRow
                key={e.id}
                title={e.qualification}
                subtitle={`${e.institution} · ${e.start} — ${e.end}`}
                leading={<TintIcon icon={GraduationCap} tint="violet" />}
              />
            ))}
          </ListGroup>
        </Section>
      </Reveal>

      {EXPERIENCE_IS_PLACEHOLDER && <PlaceholderNotice />}
    </div>
  );
}
