import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChipProps {
  children: ReactNode;
  tone?: "neutral" | "accent";
  className?: string;
}

export function Chip({ children, tone = "neutral", className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] font-medium whitespace-nowrap",
        tone === "accent"
          ? "border-os-accent/40 bg-os-accent/15 text-os-text-primary"
          : "border-os-border bg-os-surface text-os-text-secondary",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ChipRow({ items, tone, className }: { items: readonly string[]; tone?: ChipProps["tone"]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <li key={item}>
          <Chip tone={tone}>{item}</Chip>
        </li>
      ))}
    </ul>
  );
}
