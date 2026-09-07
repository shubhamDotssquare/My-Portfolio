"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { OWNER } from "@/lib/constants";

/** Route-level error boundary (a crash outside any app window). */
export default function ErrorScreen({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 os-wallpaper px-6 text-center">
      <AlertTriangle className="h-9 w-9 text-os-warning" aria-hidden />
      <div>
        <p className="text-[12px] font-semibold tracking-[0.18em] text-os-text-tertiary uppercase">{OWNER.osName}</p>
        <h1 className="os-heading mt-2 text-[1.9rem] text-os-text-primary">System error</h1>
        <p className="mt-2 max-w-sm text-[15px] text-os-text-secondary">
          Something went wrong while starting up. You can try again or reload the page.
        </p>
        {error.digest && <p className="mt-2 font-mono text-[11px] text-os-text-tertiary">Ref {error.digest}</p>}
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-os-accent-fill px-5 py-3 text-[15px] font-semibold text-os-on-tint outline-none focus-visible:ring-2 focus-visible:ring-os-accent focus-visible:ring-offset-2 focus-visible:ring-offset-os-background"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full os-glass px-5 py-3 text-[15px] font-semibold text-os-text-primary outline-none focus-visible:ring-2 focus-visible:ring-os-accent"
        >
          Home Screen
        </Link>
      </div>
    </main>
  );
}
