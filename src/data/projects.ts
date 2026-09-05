import type { AppTint } from "./apps";

/**
 * PLACEHOLDER CONTENT — sample projects and sample metrics.
 * Replace every value with real, verifiable information before launch.
 */
export const PROJECTS_ARE_PLACEHOLDER = true;

export type Platform = "ios" | "android" | "web";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectChallenge {
  title: string;
  detail: string;
}

export interface DemoCard {
  title: string;
  value?: string;
  /** 0–100 renders a progress bar */
  progress?: number;
}

export interface DemoScreen {
  id: string;
  title: string;
  subtitle?: string;
  cards: DemoCard[];
  primaryAction: string;
}

/** A curated 2–5 screen interactive experience (spec §17). */
export interface ProjectDemo {
  brand: string;
  tint: AppTint;
  screens: DemoScreen[];
}

export interface Project {
  /** URL slug: /projects/[id] */
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  /** Path under /public/images/projects/<id>/; gradient artwork is used when absent. */
  image?: string;
  technologies: string[];
  platforms: Platform[];
  role: string;
  year: string;
  featured: boolean;
  tint: AppTint;
  metrics?: ProjectMetric[];
  overview: string[];
  features: string[];
  contribution: string[];
  challenges: ProjectChallenge[];
  architecture: string[];
  performance: string[];
  results: string[];
  caseStudyId?: string;
  demo?: ProjectDemo;
}

export const projects: Project[] = [
  {
    id: "rise-club",
    name: "Rise Club",
    category: "Fitness & Community",
    tagline: "Fitness Community",
    description:
      "[Placeholder] A community fitness app with guided workouts, progress tracking and group challenges.",
    technologies: ["React Native", "TypeScript", "Firebase", "Stripe"],
    platforms: ["ios", "android"],
    role: "Lead Mobile Developer",
    year: "2024",
    featured: true,
    tint: "emerald",
    metrics: [
      { label: "Users", value: "10K+" },
      { label: "Sessions", value: "120K+" },
      { label: "Rating", value: "4.8" },
    ],
    overview: [
      "[Placeholder] Rise Club helps people build a training habit together. Members follow guided programmes, log sessions and compete in weekly group challenges.",
    ],
    features: [
      "Guided workout player with rest timers and haptic-style feedback",
      "Progress dashboard with streaks and weekly goals",
      "Group challenges with live leaderboards",
      "Subscription plans via Stripe",
    ],
    contribution: [
      "Owned the mobile architecture and release pipeline",
      "Built the workout player, progress dashboard and challenge flows",
      "Set up analytics, crash reporting and CI",
    ],
    challenges: [
      {
        title: "Smooth workout timers in the background",
        detail:
          "[Placeholder] Kept timers accurate across app suspension by anchoring to wall-clock timestamps and reconciling on resume.",
      },
      {
        title: "Offline session logging",
        detail:
          "[Placeholder] Queued writes locally and replayed them with conflict-safe merges once connectivity returned.",
      },
    ],
    architecture: [
      "Feature-based module structure",
      "Zustand for UI state, React Query for server cache",
      "Firebase Auth + Firestore, Cloud Functions for challenge scoring",
    ],
    performance: [
      "Cold start trimmed with lazy feature loading",
      "List virtualisation for long history views",
      "Image pipeline with resized, cached assets",
    ],
    results: [
      "[Placeholder] Strong retention in the first 30 days",
      "[Placeholder] Consistent 4.8 store rating",
    ],
    caseStudyId: "rise-club",
    demo: {
      brand: "RISE CLUB",
      tint: "emerald",
      screens: [
        {
          id: "today",
          title: "Good morning, Alex",
          subtitle: "Today's Progress",
          cards: [
            { title: "Daily goal", value: "86%", progress: 86 },
            { title: "Streak", value: "12 days" },
          ],
          primaryAction: "Start Workout",
        },
        {
          id: "workout",
          title: "Upper Body · 24 min",
          subtitle: "Set 2 of 4",
          cards: [
            { title: "Push-ups", value: "12 reps", progress: 50 },
            { title: "Rest", value: "00:45" },
          ],
          primaryAction: "Finish Workout",
        },
        {
          id: "summary",
          title: "Session complete",
          subtitle: "Nice work",
          cards: [
            { title: "Daily goal", value: "100%", progress: 100 },
            { title: "Calories", value: "310 kcal" },
          ],
          primaryAction: "Back to Today",
        },
      ],
    },
  },
  {
    id: "shopease",
    name: "ShopEase",
    category: "E-commerce",
    tagline: "E-commerce",
    description:
      "[Placeholder] A mobile storefront with fast browsing, saved carts and one-tap checkout.",
    technologies: ["React Native", "TypeScript", "Node.js", "Stripe"],
    platforms: ["ios", "android"],
    role: "Mobile Developer",
    year: "2023",
    featured: true,
    tint: "sky",
    metrics: [
      { label: "Products", value: "5K+" },
      { label: "Checkout", value: "1-tap" },
      { label: "Crash-free", value: "99.8%" },
    ],
    overview: [
      "[Placeholder] ShopEase turns a catalogue of thousands of products into a fast, calm shopping experience.",
    ],
    features: [
      "Instant search with faceted filters",
      "Persistent cart across devices",
      "Saved payment methods and one-tap checkout",
    ],
    contribution: [
      "Implemented product browsing, search and cart",
      "Integrated Stripe payment sheet",
    ],
    challenges: [
      {
        title: "Search that feels instant",
        detail:
          "[Placeholder] Debounced queries with optimistic local filtering while results streamed in.",
      },
    ],
    architecture: ["Modular feature folders", "Normalised catalogue cache", "REST API with ETag caching"],
    performance: ["Prefetching of next-page results", "Memoised product cells"],
    results: ["[Placeholder] Faster browse-to-checkout time"],
  },
  {
    id: "filmbox",
    name: "FilmBox",
    category: "Media",
    tagline: "Media",
    description:
      "[Placeholder] A film discovery app with rich media, watchlists and offline trailers.",
    technologies: ["React Native", "TypeScript", "REST APIs"],
    platforms: ["ios", "android", "web"],
    role: "Mobile Developer",
    year: "2022",
    featured: true,
    tint: "violet",
    overview: ["[Placeholder] FilmBox makes finding the next film to watch a pleasure."],
    features: ["Media-rich detail pages", "Watchlists", "Offline trailer caching"],
    contribution: ["Built the media playback and caching layers"],
    challenges: [
      {
        title: "Video memory pressure",
        detail: "[Placeholder] Recycled players and capped concurrent decoders on low-end devices.",
      },
    ],
    architecture: ["Feature modules", "Media cache with LRU eviction"],
    performance: ["Progressive image loading", "Prewarmed players for the visible row"],
    results: ["[Placeholder] Smooth playback on entry-level Android devices"],
  },
  {
    id: "taskflow",
    name: "TaskFlow",
    category: "Productivity",
    tagline: "Productivity",
    description:
      "[Placeholder] An offline-first task manager with gesture-driven lists and sync.",
    technologies: ["React Native", "TypeScript", "SQLite", "Node.js"],
    platforms: ["ios", "android"],
    role: "Lead Mobile Developer",
    year: "2023",
    featured: false,
    tint: "amber",
    overview: ["[Placeholder] TaskFlow keeps work moving even when the network does not."],
    features: ["Swipe to complete and snooze", "Offline-first with background sync", "Widgets"],
    contribution: ["Designed the sync engine and gesture system"],
    challenges: [
      {
        title: "Conflict-free sync",
        detail: "[Placeholder] Used per-field timestamps and a deterministic merge to avoid lost edits.",
      },
    ],
    architecture: ["Local SQLite as source of truth", "Sync queue with retry and backoff"],
    performance: ["Batched writes", "Gesture handlers on the UI thread"],
    results: ["[Placeholder] Zero data-loss reports after launch"],
    caseStudyId: "taskflow",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
