import type { ReactNode } from "react";
import { OWNER } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * Desktop: a centered virtual phone (390×844 reference, scaled to viewport).
 * Mobile:  the viewport itself becomes the OS — no external frame.
 *
 * Layout is purely CSS (Tailwind `md:` breakpoint) so there is no
 * hydration flicker between device modes.
 */
export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div className="os-stage relative flex min-h-dvh w-full flex-col items-center justify-center bg-os-background md:gap-5 md:p-6">
      {/* Ambient glow behind the device (desktop only) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            "radial-gradient(38% 55% at 50% 50%, color-mix(in srgb, var(--os-accent) 14%, transparent), transparent 70%)",
        }}
      />

      {/* Bezel (desktop only) */}
      <div
        className={cn(
          "relative",
          "md:rounded-os-bezel md:bg-os-bezel md:p-2.5",
          "md:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)]",
        )}
      >
        {/* Side buttons (desktop decoration) */}
        <span
          aria-hidden
          className="absolute -left-[3px] top-[18%] hidden h-8 w-[3px] rounded-l-sm bg-os-bezel md:block"
        />
        <span
          aria-hidden
          className="absolute -left-[3px] top-[26%] hidden h-14 w-[3px] rounded-l-sm bg-os-bezel md:block"
        />
        <span
          aria-hidden
          className="absolute -left-[3px] top-[35%] hidden h-14 w-[3px] rounded-l-sm bg-os-bezel md:block"
        />
        <span
          aria-hidden
          className="absolute -right-[3px] top-[28%] hidden h-20 w-[3px] rounded-r-sm bg-os-bezel md:block"
        />

        {/* Screen */}
        <div
          className={cn(
            "os-device relative isolate overflow-hidden bg-os-background text-os-text-primary",
            // Mobile: full viewport
            "h-dvh w-full",
            // Desktop: reference aspect, scaled to viewport height
            "md:aspect-[390/844] md:h-[min(844px,calc(100dvh-4.5rem))] md:w-auto",
            "md:max-w-[calc(100vw-3rem)] md:rounded-os-screen",
            "md:[--os-safe-top:0px] md:[--os-safe-bottom:0px]",
            "[--os-safe-top:env(safe-area-inset-top,0px)] [--os-safe-bottom:env(safe-area-inset-bottom,0px)]",
            className,
          )}
        >
          {children}
        </div>
      </div>

      {/* Subtle stage caption (desktop only) */}
      <p className="hidden select-none text-xs font-medium tracking-[0.18em] text-os-text-tertiary uppercase md:block">
        {OWNER.osName}
        <span className="mx-2 text-os-border-strong">·</span>
        {OWNER.title} Portfolio
      </p>
    </div>
  );
}
