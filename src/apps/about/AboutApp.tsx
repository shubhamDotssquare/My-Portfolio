"use client";

import { FolderKanban, Mail, MapPin, Sparkles } from "lucide-react";
import { profile, PROFILE_IS_PLACEHOLDER } from "@/data/profile";
import { useOSStore } from "@/store/osStore";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LargeTitle } from "@/components/ui/LargeTitle";
import { ListGroup, ListRow } from "@/components/ui/ListRow";
import { PlaceholderNotice } from "@/components/ui/PlaceholderNotice";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { StatRow } from "@/components/ui/Stat";
import { TintIcon } from "@/components/ui/TintIcon";

export function AboutApp() {
  const openApp = useOSStore((s) => s.openApp);

  return (
    <div className="flex flex-col pb-4">
      <Reveal>
        <LargeTitle eyebrow="Hey, I'm" title={`${profile.firstName} 👋`} subtitle={profile.headline} />
      </Reveal>

      <Reveal index={1}>
        <p className="mt-4 px-1 text-[15px] leading-relaxed text-os-text-secondary">{profile.intro}</p>
      </Reveal>

      <Reveal index={2}>
        <StatRow stats={profile.stats} placeholder={PROFILE_IS_PLACEHOLDER} className="mt-6" />
      </Reveal>

      <Reveal index={3}>
        <Section title="What I Do">
          <ListGroup>
            {profile.disciplines.map((d) => (
              <ListRow
                key={d.title}
                title={d.title}
                subtitle={d.detail}
                leading={<TintIcon icon={d.icon} tint="indigo" />}
              />
            ))}
          </ListGroup>
        </Section>
      </Reveal>

      <Reveal index={4}>
        <Section title="A little more">
          <Card className="flex flex-col gap-3">
            {profile.bio.map((p) => (
              <p key={p} className="text-[14px] leading-relaxed text-os-text-secondary">
                {p}
              </p>
            ))}
          </Card>
        </Section>
      </Reveal>

      <Reveal index={5}>
        <Section title="Currently">
          <ListGroup>
            <ListRow title={profile.availability} leading={<TintIcon icon={Sparkles} tint="emerald" />} />
            <ListRow title={profile.location} leading={<TintIcon icon={MapPin} tint="slate" />} />
          </ListGroup>
        </Section>
      </Reveal>

      <Reveal index={6} className="mt-7 grid grid-cols-2 gap-3">
        <Button icon={FolderKanban} onClick={() => openApp("projects")}>
          Projects
        </Button>
        <Button variant="secondary" icon={Mail} onClick={() => openApp("contact")}>
          Contact
        </Button>
      </Reveal>

      {PROFILE_IS_PLACEHOLDER && <PlaceholderNotice />}
    </div>
  );
}
