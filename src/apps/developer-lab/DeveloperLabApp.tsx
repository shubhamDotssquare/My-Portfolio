"use client";

import { FlaskConical } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LargeTitle } from "@/components/ui/LargeTitle";
import { Reveal } from "@/components/ui/Reveal";

/** Shell only — experiments land in M6 (OS-022 … OS-025). */
export function DeveloperLabApp() {
  return (
    <div className="flex flex-col pb-4">
      <Reveal>
        <LargeTitle title="Developer Lab" subtitle="Interactive engineering experiments." />
      </Reveal>
      <Reveal index={1}>
        <Card className="mt-6 flex items-center gap-4">
          <FlaskConical className="h-6 w-6 shrink-0 text-os-text-tertiary" aria-hidden />
          <p className="text-[14px] leading-relaxed text-os-text-secondary">
            Physics, gesture and animation experiments arrive in the next milestone.
          </p>
        </Card>
      </Reveal>
    </div>
  );
}
