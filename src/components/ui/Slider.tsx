"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  className?: string;
}

/** Labelled range input using the accent token. */
export function Slider({ label, value, min, max, step = 1, onChange, format, className }: SliderProps) {
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between px-1">
        <label htmlFor={id} className="text-[13px] font-medium text-os-text-secondary">
          {label}
        </label>
        <output htmlFor={id} className="text-[13px] font-semibold text-os-text-primary tabular-nums">
          {format ? format(value) : value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-os-border accent-os-accent outline-none focus-visible:ring-2 focus-visible:ring-os-accent focus-visible:ring-offset-2 focus-visible:ring-offset-os-background"
      />
    </div>
  );
}
