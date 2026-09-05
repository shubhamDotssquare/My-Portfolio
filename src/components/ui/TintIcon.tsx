import type { LucideIcon } from "lucide-react";
import { cn, tintVar } from "@/lib/utils";

interface TintIconProps {
  icon: LucideIcon;
  tint: string;
  size?: "sm" | "md";
  className?: string;
}

/** Small tinted glyph tile, matching the app-icon treatment. */
export function TintIcon({ icon: Icon, tint, size = "sm", className }: TintIconProps) {
  return (
    <span
      aria-hidden
      style={tintVar(tint)}
      className={cn(
        "os-app-icon flex shrink-0 items-center justify-center",
        size === "sm" ? "h-9 w-9 rounded-xl" : "h-12 w-12 rounded-2xl",
        className,
      )}
    >
      <Icon className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} strokeWidth={2} />
    </span>
  );
}
