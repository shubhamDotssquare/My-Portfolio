"use client";

import type { CSSProperties, ReactNode } from "react";
import { useDeviceScale } from "@/hooks/useDeviceMode";
import { OWNER } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * Desktop: a centered virtual phone at its 390×844 reference size, scaled
 * with a transform to fit the viewport (see useDeviceScale) so the layout
 * never reflows. Mobile / short viewports: the viewport itself is the OS.
 *
 * Mode switching is pure CSS (`desktop:` variant) so there is no hydration
 * flicker; only the scale factor is computed on the client.
 */
export function PhoneFrame({ children, className }: PhoneFrameProps) {
  const scale = useDeviceScale();

  return (
    <div
      className="os-stage relative flex min-h-dvh w-full flex-col items-center justify-center bg-os-background desktop:gap-4 desktop:p-6"
      style={{ "--os-scale": scale } as CSSProperties}
    >
      {/* Ambient glow behind the device (desktop only) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden desktop:block"
        style={{
          background:
            "radial-gradient(38% 55% at 50% 50%, color-mix(in srgb, var(--os-accent) 14%, transparent), transparent 70%)",
        }}
      />

      {/* Scaled box: reserves the visual size so the stage stays centered. */}
      <div className="relative flex w-full items-center justify-center desktop:h-[calc(864px*var(--os-scale))] desktop:w-[calc(410px*var(--os-scale))]">
        {/* Bezel (desktop only) */}
        <div
          className={cn(
            "relative w-full desktop:w-auto desktop:shrink-0",
            "desktop:rounded-os-bezel desktop:bg-os-bezel desktop:p-2.5",
            "desktop:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)]",
            "desktop:origin-center desktop:[transform:scale(var(--os-scale))]",
          )}
        >
          {/* Side buttons (desktop decoration) */}
          <span aria-hidden className="absolute top-[18%] -left-[3px] hidden h-8 w-[3px] rounded-l-sm bg-os-bezel desktop:block" />
          <span aria-hidden className="absolute top-[26%] -left-[3px] hidden h-14 w-[3px] rounded-l-sm bg-os-bezel desktop:block" />
          <span aria-hidden className="absolute top-[35%] -left-[3px] hidden h-14 w-[3px] rounded-l-sm bg-os-bezel desktop:block" />
          <span aria-hidden className="absolute top-[28%] -right-[3px] hidden h-20 w-[3px] rounded-r-sm bg-os-bezel desktop:block" />

          {/* Screen */}
          <div
            className={cn(
              "os-device relative isolate overflow-hidden bg-os-background text-os-text-primary",
              // Mobile: full viewport
              "h-dvh w-full",
              // Desktop: fixed reference size (scaled by the bezel transform)
              "desktop:h-[844px] desktop:w-[390px] desktop:rounded-os-screen",
              "desktop:[--os-safe-top:0px] desktop:[--os-safe-bottom:0px]",
              "[--os-safe-top:env(safe-area-inset-top,0px)] [--os-safe-bottom:env(safe-area-inset-bottom,0px)]",
              className,
            )}
          >
            {children}
          </div>
        </div>
      </div>

      {/* Subtle stage caption + keyboard hints (desktop only) */}
      <div className="hidden flex-col items-center gap-2 select-none desktop:flex">
        <p className="text-xs font-medium tracking-[0.18em] text-os-text-tertiary uppercase">
          {OWNER.osName}
          <span className="mx-2 text-os-border-strong">·</span>
          {OWNER.title} Portfolio
        </p>
      </div>
    </div>
  );
}

function Hint({ keys, label }: { keys: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <kbd className="rounded-md border border-os-border bg-os-surface px-1.5 py-0.5 font-sans text-[10px] text-os-text-secondary">
        {keys}
      </kbd>
      {label}
    </span>
  );
}
