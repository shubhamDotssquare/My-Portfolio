import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  padded?: boolean;
  className?: string;
}

/** Glass surface used for grouped content. */
export function Card({ children, padded = true, className }: CardProps) {
  return (
    <div className={cn("os-glass rounded-[1.35rem]", padded && "px-4 py-3.5", className)}>
      {children}
    </div>
  );
}
