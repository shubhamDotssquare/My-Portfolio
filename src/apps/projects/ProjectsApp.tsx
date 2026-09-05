"use client";

import { getProject } from "@/data/projects";
import { InAppNotFound } from "@/components/ui/InAppNotFound";
import type { AppContentProps } from "../registry";
import { ProjectDetail } from "./ProjectDetail";
import { ProjectExperience } from "./ProjectExperience";
import { ProjectsList } from "./ProjectsList";

/**
 * /projects                → list
 * /projects/[slug]         → detail
 * /projects/[slug]/demo    → interactive experience (when the project has one)
 */
export function ProjectsApp({ params }: AppContentProps) {
  const [slug, sub] = params;
  if (!slug) return <ProjectsList />;

  const project = getProject(slug);
  if (!project) return <InAppNotFound appId="projects" noun="project" />;
  if (sub === "demo" && project.demo) return <ProjectExperience project={project} />;
  if (sub) return <InAppNotFound appId="projects" noun="page" />;
  return <ProjectDetail project={project} />;
}
