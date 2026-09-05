import { FlaskConical, MessageCircle, Rocket, Zap, type LucideIcon } from "lucide-react";
import type { AppId } from "@/store/osStore";
import type { AppTint } from "./apps";

/** Contextual storytelling — a handful of items, never spam (spec §27). */
export interface OSNotification {
  id: string;
  category: string;
  title: string;
  body: string;
  /** Relative label kept static on purpose; these are narrative, not live. */
  when: string;
  icon: LucideIcon;
  tint: AppTint;
  appId: AppId;
  params?: string[];
}

export const notifications: OSNotification[] = [
  {
    id: "shipped-rise-club",
    category: "Project shipped",
    title: "Rise Club",
    body: "Production release completed.",
    when: "2m ago",
    icon: Rocket,
    tint: "emerald",
    appId: "projects",
    params: ["rise-club"],
  },
  {
    id: "perf-startup",
    category: "Performance",
    title: "Startup performance improved",
    body: "Cold start trimmed with lazy feature loading.",
    when: "Yesterday",
    icon: Zap,
    tint: "amber",
    appId: "case-studies",
    params: ["rise-club"],
  },
  {
    id: "lab-physics",
    category: "Developer Lab",
    title: "New experiment",
    body: "Physics Playground is live — tune a spring and throw the card.",
    when: "2d ago",
    icon: FlaskConical,
    tint: "indigo",
    appId: "developer-lab",
    params: ["physics"],
  },
  {
    id: "contact-hello",
    category: "Contact",
    title: "Say hello",
    body: "Have a project or an interesting idea? Let's talk.",
    when: "3d ago",
    icon: MessageCircle,
    tint: "rose",
    appId: "contact",
  },
];
