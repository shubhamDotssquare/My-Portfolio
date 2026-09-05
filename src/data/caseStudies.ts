import type { AppTint } from "./apps";
import type { ProjectMetric } from "./projects";

/** PLACEHOLDER CONTENT — sample narratives; replace with real case studies. */
export const CASE_STUDIES_ARE_PLACEHOLDER = true;

export type CaseStudyStep =
  | "problem"
  | "constraints"
  | "design"
  | "architecture"
  | "implementation"
  | "challenges"
  | "optimization"
  | "outcome";

export const CASE_STUDY_FLOW: { id: CaseStudyStep; title: string }[] = [
  { id: "problem", title: "Problem" },
  { id: "constraints", title: "Constraints" },
  { id: "design", title: "Design" },
  { id: "architecture", title: "Architecture" },
  { id: "implementation", title: "Implementation" },
  { id: "challenges", title: "Challenges" },
  { id: "optimization", title: "Optimization" },
  { id: "outcome", title: "Outcome" },
];

export interface CaseStudy {
  /** URL slug: /case-studies/[id] */
  id: string;
  projectId: string;
  title: string;
  subtitle: string;
  role: string;
  timeline: string;
  tint: AppTint;
  /** One entry per step in CASE_STUDY_FLOW. */
  sections: Record<CaseStudyStep, { body: string; bullets?: string[] }>;
  outcomes: ProjectMetric[];
}

export const caseStudies: CaseStudy[] = [
  {
    id: "rise-club",
    projectId: "rise-club",
    title: "Rise Club",
    subtitle: "Building a fitness community that keeps people coming back",
    role: "Lead Mobile Developer",
    timeline: "[Placeholder] 6 months",
    tint: "emerald",
    sections: {
      problem: {
        body:
          "[Placeholder] Members dropped off after the first two weeks. Workouts were hard to follow and progress was invisible.",
      },
      constraints: {
        body: "[Placeholder] Small team, both platforms from day one, and a fixed launch window.",
        bullets: ["Two engineers", "iOS + Android parity", "Offline gyms with poor connectivity"],
      },
      design: {
        body:
          "[Placeholder] We centred the experience on a single daily goal and made group challenges the social loop.",
      },
      architecture: {
        body:
          "[Placeholder] Feature modules with a thin core: Zustand for UI state, a server cache for remote data, Firebase for auth and realtime scoring.",
        bullets: ["Feature-based modules", "Local write queue", "Cloud Functions for leaderboards"],
      },
      implementation: {
        body:
          "[Placeholder] The workout player was built first as the riskiest surface, then progress and challenges layered on top.",
      },
      challenges: {
        body:
          "[Placeholder] Background timers, offline logging and keeping leaderboards fair under retries.",
      },
      optimization: {
        body:
          "[Placeholder] Startup trimmed with lazy feature loading; long lists virtualised; images resized on upload.",
      },
      outcome: {
        body: "[Placeholder] Retention improved and the store rating stabilised at 4.8.",
      },
    },
    outcomes: [
      { label: "30-day retention", value: "+[x]%" },
      { label: "Store rating", value: "4.8" },
      { label: "Crash-free", value: "99.9%" },
    ],
  },
  {
    id: "taskflow",
    projectId: "taskflow",
    title: "TaskFlow",
    subtitle: "Offline-first sync without lost edits",
    role: "Lead Mobile Developer",
    timeline: "[Placeholder] 4 months",
    tint: "amber",
    sections: {
      problem: {
        body: "[Placeholder] Users lost edits when switching devices with spotty connectivity.",
      },
      constraints: {
        body: "[Placeholder] Existing backend, no realtime infrastructure, strict battery budget.",
      },
      design: {
        body: "[Placeholder] Every action succeeds instantly on-device; sync is invisible.",
      },
      architecture: {
        body:
          "[Placeholder] SQLite as the source of truth, an append-only change log, and a sync worker with backoff.",
        bullets: ["Per-field timestamps", "Deterministic merge", "Idempotent server writes"],
      },
      implementation: {
        body: "[Placeholder] Built the sync engine behind a feature flag and dog-fooded for a month.",
      },
      challenges: {
        body: "[Placeholder] Clock skew between devices and partial failures mid-batch.",
      },
      optimization: {
        body: "[Placeholder] Batched writes and coalesced rapid edits to cut network calls.",
      },
      outcome: {
        body: "[Placeholder] No data-loss reports after launch; sync traffic reduced.",
      },
    },
    outcomes: [
      { label: "Data-loss reports", value: "0" },
      { label: "Sync calls", value: "-[x]%" },
    ],
  },
];

export function getCaseStudy(id: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.id === id);
}
