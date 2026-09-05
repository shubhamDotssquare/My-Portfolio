import { Atom, Hand, SlidersHorizontal, Sparkles, type LucideIcon } from "lucide-react";
import type { AppTint } from "./apps";

/** Developer Lab experiments. Each is addressable at /lab/[id]. */
export interface Experiment {
  id: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  tint: AppTint;
  technique: string;
  useCases: string[];
}

export const experiments: Experiment[] = [
  {
    id: "physics",
    title: "Physics Playground",
    summary: "Tune stiffness, damping and mass, then throw the card.",
    icon: Atom,
    tint: "indigo",
    technique:
      "Motion values driven by a real spring solver. Release velocity from the drag feeds the spring so the card carries momentum, and the damping ratio tells you how it will settle before you let go.",
    useCases: ["Sheet and card snap-back", "Rubber-band overscroll", "Toggle and switch feel"],
  },
  {
    id: "gestures",
    title: "Gesture Lab",
    summary: "Swipe, dismiss, long-press, bottom sheet and pull-to-refresh.",
    icon: Hand,
    tint: "cyan",
    technique:
      "Pointer events unified across touch, mouse and pen. Every gesture reads distance and velocity, has a threshold, and ships with a visible or keyboard alternative so it is never the only path.",
    useCases: ["Card interactions", "Navigation", "Dismiss actions", "Sheets and lists"],
  },
  {
    id: "animation",
    title: "Animation Lab",
    summary: "Spring vs timing, fade, scale, slide, layout and shared element.",
    icon: Sparkles,
    tint: "violet",
    technique:
      "One live component, seven techniques. Each demo shows the exact transition object so the choice between a spring and a bezier curve, or a layout animation and a shared element, is explicit.",
    useCases: ["Hierarchy and spatial continuity", "State-change feedback", "Screen transitions"],
  },
  {
    id: "components",
    title: "UI Component Lab",
    summary: "Switch, segmented control, stepper and toast with motion baked in.",
    icon: SlidersHorizontal,
    tint: "emerald",
    technique:
      "Small primitives with correct semantics (switch, radiogroup, live regions) whose motion comes from shared tokens rather than per-component values.",
    useCases: ["Design system primitives", "Settings screens", "Transient feedback"],
  },
];

export function getExperiment(id: string): Experiment | undefined {
  return experiments.find((e) => e.id === id);
}

/* ---------------------------- Gesture Lab ---------------------------- */

export type GestureId = "swipe" | "dismiss" | "long-press" | "sheet" | "pull";

export interface GestureInfo {
  id: GestureId;
  label: string;
  title: string;
  technique: string;
  useCases: string[];
  alternative: string;
}

export const gestures: GestureInfo[] = [
  {
    id: "swipe",
    label: "Swipe",
    title: "Horizontal Drag",
    technique: "Pointer events + Motion drag. Distance or velocity past a threshold commits the swipe.",
    useCases: ["Card interactions", "Navigation", "Quick actions"],
    alternative: "Buttons trigger the same swipe programmatically.",
  },
  {
    id: "dismiss",
    label: "Dismiss",
    title: "Dismissible Card",
    technique: "Drag on the top card only; on commit it exits in the drag direction and the stack re-lays out.",
    useCases: ["Notifications", "Onboarding decks", "Triage flows"],
    alternative: "A Dismiss button removes the top card.",
  },
  {
    id: "long-press",
    label: "Long press",
    title: "Long Press",
    technique: "Pointer down starts a 600 ms progress animation; lifting early cancels it. Keyboard hold works the same.",
    useCases: ["Context menus", "Reordering", "Confirm-destructive"],
    alternative: "Hold Space or Enter while focused.",
  },
  {
    id: "sheet",
    label: "Sheet",
    title: "Bottom Sheet",
    technique: "Drag between snap points; projected position (offset + velocity) chooses the nearest snap.",
    useCases: ["Detail panels", "Filters", "Map overlays"],
    alternative: "Snap buttons move the sheet.",
  },
  {
    id: "pull",
    label: "Pull",
    title: "Pull to Refresh",
    technique: "Elastic vertical drag at the top of a list; passing the threshold triggers a refresh and the list springs back.",
    useCases: ["Feeds", "Inbox", "Dashboards"],
    alternative: "A Refresh button performs the same action.",
  },
];

/* --------------------------- Animation Lab --------------------------- */

export type AnimationKind = "spring" | "timing" | "fade" | "scale" | "slide" | "layout" | "shared";

export interface AnimationInfo {
  id: AnimationKind;
  label: string;
  when: string;
  code: string;
}

export const animations: AnimationInfo[] = [
  {
    id: "spring",
    label: "Spring",
    when: "Interruptible, physical movement. Preserves velocity when the target changes mid-flight.",
    code: `transition={{ type: "spring", stiffness: 300, damping: 30 }}`,
  },
  {
    id: "timing",
    label: "Timing",
    when: "Predictable, fixed-duration motion — good for choreographed sequences.",
    code: `transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}`,
  },
  {
    id: "fade",
    label: "Fade",
    when: "Lowest-risk transition; also the reduced-motion fallback for everything else.",
    code: `animate={{ opacity: visible ? 1 : 0 }}\ntransition={{ duration: 0.25, ease: "easeOut" }}`,
  },
  {
    id: "scale",
    label: "Scale",
    when: "Emphasis and press feedback. Keep it small to avoid raster blur.",
    code: `whileTap={{ scale: 0.94 }}\nanimate={{ scale: active ? 1.4 : 1 }}`,
  },
  {
    id: "slide",
    label: "Slide",
    when: "Entering and leaving content with AnimatePresence so exits animate too.",
    code: `<AnimatePresence>\n  {open && <motion.div initial={{ x: 120, opacity: 0 }}\n    animate={{ x: 0, opacity: 1 }} exit={{ x: 120, opacity: 0 }} />}\n</AnimatePresence>`,
  },
  {
    id: "layout",
    label: "Layout",
    when: "Reordering or resizing without measuring — the browser lays out, Motion animates the delta.",
    code: `<motion.li layout transition={springs.smooth} />`,
  },
  {
    id: "shared",
    label: "Shared Element",
    when: "Spatial continuity between two views of the same thing, like the OS app-icon → window morph.",
    code: `<motion.div layoutId="card-1" />  // thumbnail\n<motion.div layoutId="card-1" />  // expanded`,
  },
];
