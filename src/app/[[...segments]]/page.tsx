import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OS } from "@/components/os/OS";
import { getApp } from "@/data/apps";
import { allStaticSegments, isValidPath, routeTitle } from "@/lib/routeValidation";
import { parsePath } from "@/lib/routes";

/**
 * Every OS location is a real URL ("/", "/projects", "/projects/rise-club").
 * The OS shell is one persistent client tree; client-side navigation uses the
 * native History API (see useHistorySync), so this page only renders the shell,
 * validates paths (404) and provides per-route metadata.
 */

type Props = { params: Promise<{ segments?: string[] }> };

export function generateStaticParams() {
  return allStaticSegments().map((segments) => ({ segments }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments = [] } = await params;
  const route = parsePath(`/${segments.join("/")}`);
  if (!route) return {};
  return { title: routeTitle(route), description: getApp(route.appId).description };
}

export default async function OSPage({ params }: Props) {
  const { segments = [] } = await params;
  if (!isValidPath(`/${segments.join("/")}`)) notFound();
  return <OS />;
}
