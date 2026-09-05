"use client";

import { ChevronRight } from "lucide-react";
import type { CSSProperties } from "react";
import { getApp } from "@/data/apps";
import { useOSStore } from "@/store/osStore";
import type { AppContentProps } from "./registry";

/**
 * Stand-in content while the portfolio apps are built (M5). Also exercises
 * the app engine: nested params ("/about/sample") round-trip through the URL.
 */
export function PlaceholderApp({ appId, params }: AppContentProps) {
  const app = getApp(appId);
  const openApp = useOSStore((s) => s.openApp);
  const Icon = app.icon;

  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="flex items-center gap-4">
        <span
          className="os-app-icon flex h-16 w-16 shrink-0 items-center justify-center rounded-os-icon"
          style={{ "--tint": `var(--os-tint-${app.tint})` } as CSSProperties}
        >
          <Icon className="h-7 w-7" strokeWidth={1.9} aria-hidden />
        </span>
        <div>
          <h1 className="os-heading text-[1.75rem] leading-tight text-os-text-primary">
            {params.length ? params[params.length - 1] : app.name}
          </h1>
          <p className="mt-1 text-[14px] text-os-text-secondary">{app.description}</p>
        </div>
      </div>

      <p className="rounded-2xl os-glass px-4 py-3 text-[13px] leading-relaxed text-os-text-tertiary">
        Placeholder content. This app arrives in M5 — Portfolio Apps.
      </p>

      {params.length === 0 && (
        <button
          type="button"
          onClick={() => openApp(appId, { params: ["sample"] })}
          className="flex items-center justify-between rounded-2xl os-glass px-4 py-3.5 text-left text-[15px] font-medium text-os-text-primary outline-none transition-transform active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-os-accent"
        >
          Open a nested route
          <ChevronRight className="h-4 w-4 text-os-text-tertiary" aria-hidden />
        </button>
      )}
    </div>
  );
}
