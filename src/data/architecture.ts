import type { AppTint } from "./apps";

/** Node in the mobile-architecture diagram (spec §24). Each is clickable. */
export interface ArchNode {
  /** URL slug: /architecture/[id] */
  id: string;
  label: string;
  technology: string;
  responsibilities: string[];
  tint: AppTint;
}

/** Rows of the diagram, top → bottom. Each row holds node ids. */
export const archRows: string[][] = [
  ["mobile-app"],
  ["ui", "interaction"],
  ["components", "gestures"],
  ["state", "motion"],
  ["api"],
  ["database", "services", "analytics"],
];

export const archNodes: ArchNode[] = [
  {
    id: "mobile-app",
    label: "Mobile App",
    technology: "React Native · TypeScript",
    responsibilities: ["Entry point and navigation shell", "Feature module composition", "Platform adapters"],
    tint: "indigo",
  },
  {
    id: "ui",
    label: "UI Layer",
    technology: "Design tokens · Layout primitives",
    responsibilities: ["Semantic tokens and theming", "Responsive layout", "Accessibility"],
    tint: "sky",
  },
  {
    id: "interaction",
    label: "Interaction",
    technology: "Gesture Handler · Pointer events",
    responsibilities: ["Touch and pointer handling", "Feedback and affordances", "Keyboard alternatives"],
    tint: "cyan",
  },
  {
    id: "components",
    label: "Components",
    technology: "Composable, tested UI",
    responsibilities: ["Reusable building blocks", "Variants and states", "Storybook-style isolation"],
    tint: "sky",
  },
  {
    id: "gestures",
    label: "Gestures",
    technology: "Reanimated worklets",
    responsibilities: ["UI-thread gestures", "Thresholds and velocity", "Dismiss / sheet / swipe patterns"],
    tint: "cyan",
  },
  {
    id: "state",
    label: "State",
    technology: "Zustand / Redux",
    responsibilities: ["UI state", "Cached data", "App state", "Navigation coordination"],
    tint: "violet",
  },
  {
    id: "motion",
    label: "Motion",
    technology: "Spring-based animation",
    responsibilities: ["Spatial continuity", "Hierarchy and feedback", "Reduced-motion fallbacks"],
    tint: "violet",
  },
  {
    id: "api",
    label: "API Layer",
    technology: "REST · typed clients",
    responsibilities: ["Request/response typing", "Caching and retries", "Auth and error mapping"],
    tint: "amber",
  },
  {
    id: "database",
    label: "Database",
    technology: "SQLite · Firestore",
    responsibilities: ["Local source of truth", "Sync and conflict handling"],
    tint: "emerald",
  },
  {
    id: "services",
    label: "Services",
    technology: "Firebase · Stripe",
    responsibilities: ["Auth", "Payments", "Push notifications"],
    tint: "rose",
  },
  {
    id: "analytics",
    label: "Analytics",
    technology: "Events · crash reporting",
    responsibilities: ["Product analytics", "Performance monitoring", "Crash triage"],
    tint: "slate",
  },
];

export function getArchNode(id: string): ArchNode | undefined {
  return archNodes.find((n) => n.id === id);
}
