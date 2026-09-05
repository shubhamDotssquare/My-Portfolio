import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  id?: string;
  children: ReactNode;
  className?: string;
}

/** Grouped content block with an uppercase eyebrow title. */
export function Section({ title, id, children, className }: SectionProps) {
  return (
    <section id={id} aria-label={title} className={cn("mt-7 scroll-mt-4", className)}>
      <h2 className="mb-2.5 px-1 text-[12px] font-semibold tracking-[0.12em] text-os-text-tertiary uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}
