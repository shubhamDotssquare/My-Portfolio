import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OS } from "@/components/os/OS";
import { apps, getApp } from "@/data/apps";
import { isKnownPath, parsePath } from "@/lib/routes";

/**
 * Every OS location is a real URL ("/", "/projects", "/projects/rise-club").
 * The OS shell is one persistent client tree; client-side navigation uses the
 * native History API (see useHistorySync), so this page only renders the shell,
 * validates unknown top-level paths (404) and provides per-app metadata.
 */

type Props = { params: Promise<{ segments?: string[] }> };

export function generateStaticParams() {
  return [
    { segments: [] },
    ...apps.map((app) => ({ segments: app.path.split("/").filter(Boolean) })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments = [] } = await params;
  const route = parsePath(`/${segments.join("/")}`);
  if (!route) return {};
  const app = getApp(route.appId);
  return { title: app.name, description: app.description };
}

export default async function OSPage({ params }: Props) {
  const { segments = [] } = await params;
  if (!isKnownPath(`/${segments.join("/")}`)) notFound();
  return <OS />;
}
