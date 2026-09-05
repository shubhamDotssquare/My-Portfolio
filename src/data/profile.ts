import { Gauge, Network, Palette, Smartphone, type LucideIcon } from "lucide-react";

/**
 * PLACEHOLDER CONTENT — replace with the owner's real details.
 * Every value below is illustrative until real information is supplied.
 */
export const PROFILE_IS_PLACEHOLDER = true;

export interface ProfileStat {
  value: string;
  label: string;
}

export interface Discipline {
  title: string;
  detail: string;
  icon: LucideIcon;
}

export interface ProfileLink {
  id: "email" | "linkedin" | "github";
  label: string;
  value: string;
  href: string;
}

export const profile = {
  firstName: "Shubham",
  headline: "Mobile Developer who builds thoughtful, performant and impactful apps.",
  intro:
    "I design and ship mobile products end-to-end — from interaction details and animation to state architecture and release engineering.",
  bio: [
    "[Placeholder] Over the last few years I have worked across consumer and B2B mobile apps, owning features from concept to store release.",
    "[Placeholder] I care about the details users feel but rarely notice: 60 FPS gestures, resilient offline behaviour, and code that a team can grow with.",
  ],
  location: "[Placeholder City, Country]",
  availability: "Open to interesting mobile and product-engineering work.",
  stats: [
    { value: "4+", label: "Years" },
    { value: "15+", label: "Projects" },
    { value: "10+", label: "Happy Clients" },
  ] satisfies ProfileStat[],
  disciplines: [
    {
      title: "Mobile Development",
      detail: "React Native and native-adjacent tooling, shipped to both stores.",
      icon: Smartphone,
    },
    {
      title: "UI/UX Implementation",
      detail: "Design systems, motion and gesture-driven interfaces.",
      icon: Palette,
    },
    {
      title: "System Architecture",
      detail: "State, data flow and modular app structure that scales.",
      icon: Network,
    },
    {
      title: "Performance Engineering",
      detail: "Startup time, render budgets and smooth interactions.",
      icon: Gauge,
    },
  ] satisfies Discipline[],
  links: [
    { id: "email", label: "Email", value: "hello@example.com", href: "mailto:hello@example.com" },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: "linkedin.com/in/placeholder",
      href: "https://www.linkedin.com/in/placeholder",
    },
    {
      id: "github",
      label: "GitHub",
      value: "github.com/placeholder",
      href: "https://github.com/placeholder",
    },
  ] satisfies ProfileLink[],
  resume: {
    /** Set to a real path under /public (e.g. "/resume/shubham-resume.pdf") when supplied. */
    pdfUrl: null as string | null,
    lastUpdated: "[Month Year]",
  },
} as const;
