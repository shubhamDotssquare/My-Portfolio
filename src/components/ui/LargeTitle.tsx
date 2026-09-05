import { cn } from "@/lib/utils";

interface LargeTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

/** App-level heading block: eyebrow, large title, subtitle. */
export function LargeTitle({ eyebrow, title, subtitle, className }: LargeTitleProps) {
  return (
    <div className={cn("px-1", className)}>
      {eyebrow && (
        <p className="text-[13px] font-medium tracking-[0.02em] text-os-text-tertiary">{eyebrow}</p>
      )}
      <h1 className="os-heading text-[1.9rem] leading-[1.1] text-os-text-primary">{title}</h1>
      {subtitle && <p className="mt-2 text-[15px] leading-snug text-os-text-secondary">{subtitle}</p>}
    </div>
  );
}
