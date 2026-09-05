"use client";

import { SearchX } from "lucide-react";
import { getApp } from "@/data/apps";
import { useOSStore, type AppId } from "@/store/osStore";
import { Button } from "./Button";

interface InAppNotFoundProps {
  appId: AppId;
  /** What was being looked for, e.g. "project". */
  noun: string;
}

/** Shown when a nested URL inside an app doesn't resolve. */
export function InAppNotFound({ appId, noun }: InAppNotFoundProps) {
  const openApp = useOSStore((s) => s.openApp);
  const app = getApp(appId);
  return (
    <div className="flex flex-col items-center gap-4 pt-16 text-center">
      <SearchX className="h-8 w-8 text-os-text-tertiary" aria-hidden />
      <div>
        <h1 className="os-heading text-[1.4rem] text-os-text-primary">{`That ${noun} isn't here`}</h1>
        <p className="mt-1 text-[14px] text-os-text-secondary">It may have moved or never existed.</p>
      </div>
      <Button variant="secondary" onClick={() => openApp(appId)}>
        Back to {app.name}
      </Button>
    </div>
  );
}
