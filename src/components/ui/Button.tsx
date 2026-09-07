"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { springs } from "@/animations/spring";
import { useOSReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "tint";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold outline-none select-none focus-visible:ring-2 focus-visible:ring-os-accent focus-visible:ring-offset-2 focus-visible:ring-offset-os-background disabled:cursor-not-allowed disabled:opacity-45";

const variants: Record<Variant, string> = {
  primary: "bg-os-accent-fill text-os-on-tint",
  secondary: "os-glass text-os-text-primary",
  /** Uses the surrounding `--tint` variable (see tintVar). */
  tint: "bg-[var(--tint)] text-os-on-tint",
};

interface ButtonProps extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  variant?: Variant;
  icon?: LucideIcon;
  children: ReactNode;
}

export function Button({ variant = "primary", icon: Icon, className, children, disabled, ...rest }: ButtonProps) {
  const reduced = useOSReducedMotion();
  return (
    <motion.button
      type="button"
      whileTap={disabled || reduced ? undefined : { scale: 0.97 }}
      transition={springs.snappy}
      disabled={disabled}
      className={cn(base, variants[variant], className)}
      {...(rest as object)}
    >
      {Icon && <Icon className="h-4 w-4" strokeWidth={2.25} aria-hidden />}
      {children}
    </motion.button>
  );
}

interface ButtonLinkProps extends Omit<ComponentPropsWithoutRef<"a">, "children"> {
  variant?: Variant;
  icon?: LucideIcon;
  children: ReactNode;
}

export function ButtonLink({ variant = "primary", icon: Icon, className, children, ...rest }: ButtonLinkProps) {
  return (
    <a className={cn(base, variants[variant], className)} {...rest}>
      {Icon && <Icon className="h-4 w-4" strokeWidth={2.25} aria-hidden />}
      {children}
    </a>
  );
}
