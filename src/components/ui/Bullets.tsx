import { cn } from "@/lib/utils";

/** Compact bulleted list with accent markers. */
export function Bullets({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-1.5", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-[14px] leading-relaxed text-os-text-secondary">
          <span aria-hidden className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-os-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
