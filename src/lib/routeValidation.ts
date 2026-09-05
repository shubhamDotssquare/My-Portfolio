import { apps, getApp } from "@/data/apps";
import { archNodes, getArchNode } from "@/data/architecture";
import { caseStudies, getCaseStudy } from "@/data/caseStudies";
import { experiments, getExperiment } from "@/data/lab";
import { getProject, projects } from "@/data/projects";
import { type OSRoute, parsePath } from "./routes";

/**
 * Server-side route knowledge (imports content data, so it stays out of the
 * client store bundle). Used by the catch-all page for 404s, static params
 * and metadata.
 */

export function isValidRoute(route: OSRoute): boolean {
  const { appId, params } = route;
  switch (appId) {
    case "projects": {
      const [slug, sub, ...rest] = params;
      if (!slug) return true;
      const project = getProject(slug);
      if (!project) return false;
      if (!sub) return true;
      return sub === "demo" && Boolean(project.demo) && rest.length === 0;
    }
    case "case-studies":
      return params.length === 0 || (params.length === 1 && Boolean(getCaseStudy(params[0])));
    case "architecture":
      return params.length === 0 || (params.length === 1 && Boolean(getArchNode(params[0])));
    case "developer-lab":
      return params.length === 0 || (params.length === 1 && Boolean(getExperiment(params[0])));
    default:
      return params.length === 0;
  }
}

export function isValidPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return true;
  const route = parsePath(pathname);
  return route !== null && isValidRoute(route);
}

/** Every prerenderable path as segment arrays (for generateStaticParams). */
export function allStaticSegments(): string[][] {
  const seg = (path: string) => path.split("/").filter(Boolean);
  return [
    [],
    ...apps.map((a) => seg(a.path)),
    ...projects.map((p) => [...seg(getApp("projects").path), p.id]),
    ...projects.filter((p) => p.demo).map((p) => [...seg(getApp("projects").path), p.id, "demo"]),
    ...caseStudies.map((c) => [...seg(getApp("case-studies").path), c.id]),
    ...archNodes.map((n) => [...seg(getApp("architecture").path), n.id]),
    ...experiments.map((e) => [...seg(getApp("developer-lab").path), e.id]),
  ];
}

/** Human title for a route, e.g. "Rise Club · Projects". */
export function routeTitle(route: OSRoute): string {
  const app = getApp(route.appId);
  const [first, second] = route.params;
  if (!first) return app.name;
  switch (route.appId) {
    case "projects": {
      const p = getProject(first);
      if (!p) return app.name;
      return second === "demo" ? `${p.name} Experience` : p.name;
    }
    case "case-studies":
      return getCaseStudy(first)?.title ?? app.name;
    case "architecture":
      return getArchNode(first)?.label ?? app.name;
    case "developer-lab":
      return getExperiment(first)?.title ?? app.name;
    default:
      return app.name;
  }
}
