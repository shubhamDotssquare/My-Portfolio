"use client";

import { ArrowRight } from "lucide-react";
import { experiments, getExperiment } from "@/data/lab";
import { useOSStore } from "@/store/osStore";
import { InAppNotFound } from "@/components/ui/InAppNotFound";
import { LargeTitle } from "@/components/ui/LargeTitle";
import { Reveal } from "@/components/ui/Reveal";
import { TintIcon } from "@/components/ui/TintIcon";
import type { AppContentProps } from "../registry";
import { ExperimentFrame } from "./ExperimentFrame";
import { AnimationLab } from "./experiments/AnimationLab";
import { ComponentLab } from "./experiments/ComponentLab";
import { GestureLab } from "./experiments/GestureLab";
import { PhysicsPlayground } from "./experiments/PhysicsPlayground";

/**
 * /lab              → experiment list
 * /lab/[experiment] → one experiment inside the shared frame
 */
export function DeveloperLabApp({ params }: AppContentProps) {
  const [id] = params;
  if (!id) return <LabList />;
  const experiment = getExperiment(id);
  if (!experiment || params.length > 1) return <InAppNotFound appId="developer-lab" noun="experiment" />;

  return (
    <ExperimentFrame experiment={experiment}>
      {id === "physics" && <PhysicsPlayground />}
      {id === "gestures" && <GestureLab />}
      {id === "animation" && <AnimationLab />}
      {id === "components" && <ComponentLab />}
    </ExperimentFrame>
  );
}

function LabList() {
  const openApp = useOSStore((s) => s.openApp);
  return (
    <div className="flex flex-col pb-4">
      <Reveal>
        <LargeTitle
          title="Developer Lab"
          subtitle="Interactive experiments — every one responds to touch, mouse and keyboard."
        />
      </Reveal>
      <ul className="mt-6 flex flex-col gap-3">
        {experiments.map((e, i) => (
          <Reveal key={e.id} index={i + 1}>
            <li>
              <button
                type="button"
                onClick={() => openApp("developer-lab", { params: [e.id] })}
                className="os-glass flex w-full items-center gap-4 rounded-[1.35rem] p-4 text-left outline-none transition-colors hover:bg-os-surface-elevated focus-visible:ring-2 focus-visible:ring-os-accent"
              >
                <TintIcon icon={e.icon} tint={e.tint} size="md" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-semibold text-os-text-primary">{e.title}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-os-text-secondary">{e.summary}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-os-text-tertiary" aria-hidden />
              </button>
            </li>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
