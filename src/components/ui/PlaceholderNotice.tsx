import { cn } from "@/lib/utils";

/** Tiny "Sample" tag for illustrative numbers. */
export function PlaceholderBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full border border-os-warning/40 bg-os-warning/10 bg-clip-padding px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-os-warning uppercase",
        className,
      )}
    >
      Sample
    </span>
  );
}

/** Footer note shown in apps whose content is still placeholder. */
export function PlaceholderNotice({ className }: { className?: string }) {
  return (
    <p role="note" className={cn("mt-8 px-4 text-center text-[12px] leading-relaxed text-os-text-tertiary", className)}>
      Placeholder content — real details will replace this before launch.
    </p>
  );
}
