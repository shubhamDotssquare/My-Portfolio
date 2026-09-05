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
    <div role="status" aria-live="polite" className="flex flex-1 items-center justify-center pt-24">
      <span className="h-1.5 w-10 animate-pulse rounded-full bg-os-border-strong" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

/** Each app is code-split; Home loads first, app code loads on demand. */
const lazy = (loader: () => Promise<ComponentType<AppContentProps>>) =>
  dynamic(loader, { loading: AppLoading });

/** AppId → content component. */
export const appComponents: Record<AppId, ComponentType<AppContentProps>> = {
  about: lazy(() => import("./about/AboutApp").then((m) => m.AboutApp)),
  projects: lazy(() => import("./projects/ProjectsApp").then((m) => m.ProjectsApp)),
  "case-studies": lazy(() => import("./case-studies/CaseStudiesApp").then((m) => m.CaseStudiesApp)),
  "developer-lab": lazy(() => import("./developer-lab/DeveloperLabApp").then((m) => m.DeveloperLabApp)),
  experience: lazy(() => import("./experience/ExperienceApp").then((m) => m.ExperienceApp)),
  architecture: lazy(() => import("./architecture/ArchitectureApp").then((m) => m.ArchitectureApp)),
  contact: lazy(() => import("./contact/ContactApp").then((m) => m.ContactApp)),
  resume: lazy(() => import("./resume/ResumeApp").then((m) => m.ResumeApp)),
};
