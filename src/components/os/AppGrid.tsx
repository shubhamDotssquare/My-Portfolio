"use client";

import { homeApps } from "@/data/apps";
import { cn } from "@/lib/utils";
import type { AppId, LaunchSource } from "@/store/osStore";
import { AppIcon } from "./AppIcon";

interface AppGridProps {
  onOpen: (id: AppId, source: LaunchSource) => void;
  className?: string;
}

/** Home application grid. Order and content come from the app registry. */
export function AppGrid({ onOpen, className }: AppGridProps) {
  return (
    <nav aria-label="Applications" className={cn("grid grid-cols-4 gap-x-2 gap-y-6", className)}>
      {homeApps.map((app) => (
        <AppIcon key={app.id} app={app} source="grid" onOpen={onOpen} />
      ))}
    </nav>
  );
}
