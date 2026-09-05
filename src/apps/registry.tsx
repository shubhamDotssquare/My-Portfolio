"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { AppId } from "@/store/osStore";

export interface AppContentProps {
  appId: AppId;
  /** Nested route segments, e.g. ["rise-club"] for /projects/rise-club. */
  params: string[];
}

function AppLoading() {
  return (
    <div role="status" aria-live="polite" className="flex flex-1 items-center justify-center">
      <span className="h-1.5 w-10 animate-pulse rounded-full bg-os-border-strong" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

/** Each app is code-split; Home loads first, app code loads on demand. */
const lazy = (loader: () => Promise<ComponentType<AppContentProps>>) =>
  dynamic(loader, { loading: AppLoading });

const Placeholder = lazy(() => import("./PlaceholderApp").then((m) => m.PlaceholderApp));

/** AppId → content component. M5 replaces each entry with the real app. */
export const appComponents: Record<AppId, ComponentType<AppContentProps>> = {
  about: Placeholder,
  projects: Placeholder,
  "case-studies": Placeholder,
  "developer-lab": Placeholder,
  experience: Placeholder,
  architecture: Placeholder,
  contact: Placeholder,
  resume: Placeholder,
};
