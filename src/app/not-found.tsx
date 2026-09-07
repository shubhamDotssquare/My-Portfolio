import { SearchX } from "lucide-react";
import Link from "next/link";
import { OWNER } from "@/lib/constants";

/** 404 for URLs outside the OS route space — styled as a system screen. */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 os-wallpaper px-6 text-center">
      <SearchX className="h-9 w-9 text-os-text-tertiary" aria-hidden />
      <div>
        <p className="text-[12px] font-semibold tracking-[0.18em] text-os-text-tertiary uppercase">{OWNER.osName}</p>
        <h1 className="os-heading mt-2 text-[1.9rem] text-os-text-primary">That screen doesn&apos;t exist</h1>
        <p className="mt-2 max-w-sm text-[15px] text-os-text-secondary">
          The address may have moved, or it was never part of the system.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-full bg-os-accent-fill px-5 py-3 text-[15px] font-semibold text-os-on-tint outline-none focus-visible:ring-2 focus-visible:ring-os-accent focus-visible:ring-offset-2 focus-visible:ring-offset-os-background"
      >
        Back to Home Screen
      </Link>
    </main>
  );
}
