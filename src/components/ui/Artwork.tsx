import type { LucideIcon } from "lucide-react";
import { cn, tintVar } from "@/lib/utils";

interface ArtworkProps {
  tint: string;
  /** Text used to derive the monogram, e.g. a project name. */
  label: string;
  icon?: LucideIcon;
  className?: string;
}

/**
 * Original placeholder artwork for a project: tinted gradient with a monogram.
 * Swap for a real image via `Project.image` without touching components.
 */
export function Artwork({ tint, label, icon: Icon, className }: ArtworkProps) {
  const monogram = label
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      aria-hidden
      style={tintVar(tint)}
      className={cn("os-app-icon relative flex items-center justify-center overflow-hidden", className)}
    >
      <span className="pointer-events-none absolute -right-[10%] -bottom-[25%] h-[80%] w-[60%] rounded-full bg-white/10 blur-2xl" />
      <span className="pointer-events-none absolute -top-[30%] -left-[10%] h-[70%] w-[50%] rounded-full bg-black/10 blur-2xl" />
      {Icon ? (
        <Icon className="relative h-[38%] w-[38%]" strokeWidth={1.6} />
      ) : (
        <span className="os-heading relative text-[2.2em] tracking-[-0.05em] opacity-95">{monogram}</span>
      )}
    </div>
  );
}
