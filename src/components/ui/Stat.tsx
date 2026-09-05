import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { PlaceholderBadge } from "./PlaceholderNotice";

export interface StatItem {
  value: string;
  label: string;
}

interface StatRowProps {
  stats: readonly StatItem[];
  /** Marks the numbers as sample values. */
  placeholder?: boolean;
  className?: string;
}

export function StatRow({ stats, placeholder = false, className }: StatRowProps) {
  return (
    <Card padded={false} className={cn("relative", placeholder && "mt-2", className)}>
      {placeholder && <PlaceholderBadge className="absolute -top-2.5 right-4 bg-os-background" />}
      <dl
        className="grid divide-x divide-os-border"
        style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
      >
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center px-2 py-4 text-center">
            <dd className="os-heading text-[1.45rem] leading-none text-os-text-primary tabular-nums">
              {s.value}
            </dd>
            <dt className="mt-1.5 text-[12px] text-os-text-tertiary">{s.label}</dt>
          </div>
        ))}
      </dl>
    </Card>
  );
}
