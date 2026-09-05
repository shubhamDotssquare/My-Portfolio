"use client";

import { Briefcase, Download, Eye, FolderKanban, GraduationCap, User } from "lucide-react";
import { education, roles } from "@/data/experience";
import { profile, PROFILE_IS_PLACEHOLDER } from "@/data/profile";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { useOSStore } from "@/store/osStore";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChipRow } from "@/components/ui/Chip";
import { LargeTitle } from "@/components/ui/LargeTitle";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { TintIcon } from "@/components/ui/TintIcon";

export function ResumeApp() {
  const openApp = useOSStore((s) => s.openApp);
  const pdf = profile.resume.pdfUrl;

  return (
    <div className="flex flex-col pb-4">
      <Reveal>
        <LargeTitle title="Resume" subtitle={`Last updated ${profile.resume.lastUpdated}`} />
      </Reveal>

      <Reveal index={1}>
        <ListGroup className="mt-6">
          <ListRow
            title="Profile"
            subtitle={profile.headline}
            leading={<TintIcon icon={User} tint="indigo" />}
            onClick={() => openApp("about")}
          />
          <ListRow
            title="Experience"
            subtitle={`${roles.length} roles · ${roles[roles.length - 1]?.start} — Present`}
            leading={<TintIcon icon={Briefcase} tint="amber" />}
            onClick={() => openApp("experience")}
          />
          <ListRow
            title="Projects"
            subtitle={`${projects.length} applications`}
            leading={<TintIcon icon={FolderKanban} tint="sky" />}
            onClick={() => openApp("projects")}
          />
        </ListGroup>
      </Reveal>

      <Reveal index={2}>
        <Section title="Skills">
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

      <Reveal index={3}>
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

      <Reveal index={4} className="mt-7 flex flex-col gap-3">
        {pdf ? (
          <>
            <ButtonLink href={pdf} target="_blank" rel="noopener noreferrer" icon={Eye}>
              View PDF
            </ButtonLink>
            <ButtonLink href={pdf} download variant="secondary" icon={Download}>
              Download Resume
            </ButtonLink>
          </>
        ) : (
          <>
            <Button icon={Eye} disabled aria-describedby="resume-pdf-note">
              View PDF
            </Button>
            <Button variant="secondary" icon={Download} disabled aria-describedby="resume-pdf-note">
              Download Resume
            </Button>
            <p id="resume-pdf-note" className="px-2 text-center text-[12px] text-os-text-tertiary">
              PDF pending — the real resume will be attached here.
            </p>
          </>
        )}
      </Reveal>

      {PROFILE_IS_PLACEHOLDER && <PlaceholderNotice />}
    </div>
  );
}
