"use client";

import { dockApps } from "@/data/apps";
import { cn } from "@/lib/utils";
import type { AppId, LaunchSource } from "@/store/osStore";
import { AppIcon } from "./AppIcon";

interface DockProps {
  onOpen: (id: AppId, source: LaunchSource) => void;
  className?: string;
}

/** Persistent glass dock with the primary destinations. */
export function Dock({ onOpen, className }: DockProps) {
  return (
    <nav
      aria-label="Dock"
      className={cn(
        "os-glass flex items-center justify-around rounded-[2rem] px-3 py-3.5",
        className,
      )}
    >
      {dockApps.map((app) => (
        <AppIcon
          key={app.id}
          app={app}
          source="dock"
          onOpen={onOpen}
          showLabel={false}
          className="w-auto"
        />
      ))}
    </nav>
  );
}
