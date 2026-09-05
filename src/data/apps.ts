import {
  Boxes,
  Briefcase,
  FileText,
  FlaskConical,
  FolderKanban,
  Layers,
  Mail,
  User,
  type LucideIcon,
} from "lucide-react";
import type { AppId } from "@/store/osStore";

/** Icon tint names map to `--os-tint-*` tokens in globals.css. */
export type AppTint =
  | "indigo"
  | "violet"
  | "cyan"
  | "emerald"
  | "amber"
  | "rose"
  | "sky"
  | "slate";

export interface AppDefinition {
  id: AppId;
  /** Short label shown under the Home icon. */
  label: string;
  /** Full name used in headers and accessible labels. */
  name: string;
  /** One-line description (Spotlight, App Switcher). */
  description: string;
  icon: LucideIcon;
  tint: AppTint;
  /** URL path for browser-history synchronisation (M4). */
  path: string;
}

/**
 * App registry — the single catalogue of OS applications.
 * Home grid order, dock membership and the M4 app engine all read from here.
 */
export const apps: readonly AppDefinition[] = [
  {
    id: "about",
    label: "About",
    name: "About",
    description: "Who I am and what I do",
    icon: User,
    tint: "indigo",
    path: "/about",
  },
  {
    id: "projects",
    label: "Projects",
    name: "Projects",
    description: "Mobile applications I have built",
    icon: FolderKanban,
    tint: "sky",
    path: "/projects",
  },
  {
    id: "case-studies",
    label: "Cases",
    name: "Case Studies",
    description: "Problem → architecture → outcome",
    icon: Layers,
    tint: "violet",
    path: "/case-studies",
  },
  {
    id: "developer-lab",
    label: "Lab",
    name: "Developer Lab",
    description: "Interactive engineering experiments",
    icon: FlaskConical,
    tint: "emerald",
    path: "/lab",
  },
  {
    id: "experience",
    label: "Career",
    name: "Experience",
    description: "Roles, responsibilities and impact",
    icon: Briefcase,
    tint: "amber",
    path: "/experience",
  },
  {
    id: "architecture",
    label: "System",
    name: "Architecture",
    description: "How I structure mobile systems",
    icon: Boxes,
    tint: "cyan",
    path: "/architecture",
  },
  {
    id: "contact",
    label: "Contact",
    name: "Contact",
    description: "Let's build something",
    icon: Mail,
    tint: "rose",
    path: "/contact",
  },
  {
    id: "resume",
    label: "Resume",
    name: "Resume",
    description: "Profile, experience and skills",
    icon: FileText,
    tint: "slate",
    path: "/resume",
  },
];

export const appsById = Object.fromEntries(apps.map((a) => [a.id, a])) as Record<
  AppId,
  AppDefinition
>;

export function getApp(id: AppId): AppDefinition {
  return appsById[id];
}

/** Home grid order. */
export const homeApps: readonly AppDefinition[] = apps;

/** Dock: the three primary destinations for a visitor. */
export const dockAppIds: readonly AppId[] = ["projects", "resume", "contact"];
export const dockApps: readonly AppDefinition[] = dockAppIds.map(getApp);
