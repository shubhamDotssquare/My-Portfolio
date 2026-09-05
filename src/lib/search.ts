import { Boxes, Briefcase, FolderKanban, Layers, Wrench, type LucideIcon } from "lucide-react";
import { apps } from "@/data/apps";
import { archNodes } from "@/data/architecture";
import { caseStudies } from "@/data/caseStudies";
import { roles } from "@/data/experience";
import { experiments } from "@/data/lab";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import type { AppId } from "@/store/osStore";

export type SearchGroup = "Apps" | "Projects" | "Case Studies" | "Lab" | "Experience" | "Skills" | "Architecture";

const GROUP_ORDER: SearchGroup[] = ["Apps", "Projects", "Case Studies", "Lab", "Experience", "Skills", "Architecture"];

export interface SearchResult {
  id: string;
  group: SearchGroup;
  title: string;
  subtitle: string;
  keywords: string[];
  icon: LucideIcon;
  tint: string;
  appId: AppId;
  params?: string[];
}

/** Everything Spotlight can open. Built once per session (client-side, lazy chunk). */
export function buildSearchIndex(): SearchResult[] {
  const out: SearchResult[] = [];

  for (const a of apps)
    out.push({ id: `app-${a.id}`, group: "Apps", title: a.name, subtitle: a.description, keywords: [a.label], icon: a.icon, tint: a.tint, appId: a.id });

  for (const p of projects)
    out.push({
      id: `project-${p.id}`,
      group: "Projects",
      title: p.name,
      subtitle: `${p.category} · ${p.year}`,
      keywords: [...p.technologies, p.tagline, p.role],
      icon: FolderKanban,
      tint: p.tint,
      appId: "projects",
      params: [p.id],
    });

  for (const c of caseStudies)
    out.push({ id: `case-${c.id}`, group: "Case Studies", title: c.title, subtitle: c.subtitle, keywords: [c.role], icon: Layers, tint: c.tint, appId: "case-studies", params: [c.id] });

  for (const e of experiments)
    out.push({ id: `lab-${e.id}`, group: "Lab", title: e.title, subtitle: e.summary, keywords: e.useCases, icon: e.icon, tint: e.tint, appId: "developer-lab", params: [e.id] });

  for (const r of roles)
    out.push({ id: `role-${r.id}`, group: "Experience", title: r.role, subtitle: `${r.company} · ${r.start} — ${r.end}`, keywords: r.technologies, icon: Briefcase, tint: "amber", appId: "experience" });

  for (const g of skillGroups)
    for (const skill of g.skills)
      out.push({ id: `skill-${g.id}-${skill}`, group: "Skills", title: skill, subtitle: `${g.title} stack`, keywords: [g.title], icon: Wrench, tint: "slate", appId: "architecture" });

  for (const n of archNodes)
    out.push({ id: `arch-${n.id}`, group: "Architecture", title: n.label, subtitle: n.technology, keywords: n.responsibilities, icon: Boxes, tint: n.tint, appId: "architecture", params: [n.id] });

  return out;
}

function score(r: SearchResult, q: string): number {
  const title = r.title.toLowerCase();
  if (title === q) return 6;
  if (title.startsWith(q)) return 5;
  if (title.split(/\s+/).some((w) => w.startsWith(q))) return 4;
  if (title.includes(q)) return 3;
  if (r.keywords.some((k) => k.toLowerCase().startsWith(q))) return 2;
  if (r.subtitle.toLowerCase().includes(q) || r.keywords.some((k) => k.toLowerCase().includes(q))) return 1;
  return 0;
}

/** Case-insensitive ranked search; ties resolve by group order. */
export function searchIndex(index: SearchResult[], query: string, limit = 10): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return index
    .map((r) => ({ r, s: score(r, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || GROUP_ORDER.indexOf(a.r.group) - GROUP_ORDER.indexOf(b.r.group))
    .slice(0, limit)
    .map((x) => x.r);
}

/** Default suggestions when the query is empty. */
export function searchSuggestions(index: SearchResult[]): SearchResult[] {
  return [
    ...index.filter((r) => r.group === "Apps").slice(0, 4),
    ...index.filter((r) => r.group === "Projects").slice(0, 2),
    ...index.filter((r) => r.group === "Lab").slice(0, 2),
  ];
}
