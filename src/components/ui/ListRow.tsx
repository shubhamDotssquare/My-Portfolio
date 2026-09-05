"use client";

import { ChevronRight, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";

interface ListRowProps {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  href?: string;
  external?: boolean;
  ariaLabel?: string;
}

const rowClass =
  "flex w-full items-center gap-3 px-4 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-os-accent";
const interactiveClass = "hover:bg-os-surface-elevated active:bg-os-surface-elevated";

/** A grouped-list row. Renders a button, an anchor, or a static row. */
export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  onClick,
  href,
  external,
  ariaLabel,
}: ListRowProps) {
  const interactive = Boolean(onClick || href);
  const content = (
    <>
      {leading}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium text-os-text-primary">{title}</span>
        {subtitle && (
          <span className="mt-0.5 block truncate text-[13px] text-os-text-secondary">{subtitle}</span>
        )}
      </span>
      {trailing ??
        (interactive &&
          (external ? (
            <ExternalLink className="h-4 w-4 shrink-0 text-os-text-tertiary" aria-hidden />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-os-text-tertiary" aria-hidden />
          )))}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel}
        className={cn(rowClass, interactiveClass)}
      >
        {content}
      </a>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-label={ariaLabel} className={cn(rowClass, interactiveClass)}>
        {content}
      </button>
    );
  }
  return <div className={rowClass}>{content}</div>;
}

export function ListGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Card padded={false} className={cn("divide-y divide-os-border overflow-hidden", className)}>
      {children}
    </Card>
  );
}
