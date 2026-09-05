import { apps, getApp } from "@/data/apps";
import type { AppId } from "@/store/osStore";

/** A resolved OS location: which app is open and its nested params. */
export interface OSRoute {
  appId: AppId;
  /** Path segments after the app's base path, e.g. ["rise-club"]. */
  params: string[];
}

/** "/projects/rise-club" → { appId: "projects", params: ["rise-club"] }; "/" → null. */
export function parsePath(pathname: string): OSRoute | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;
  const app = apps.find((a) => a.path === `/${segments[0]}`);
  if (!app) return null;
  return { appId: app.id, params: segments.slice(1).map(safeDecode) };
}

/** { appId, params } → "/projects/rise-club". */
export function buildPath(appId: AppId, params: readonly string[] = []): string {
  return [getApp(appId).path, ...params.map(encodeURIComponent)].join("/");
}

/** True for "/" and any path whose first segment is a registered app. */
export function isKnownPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length === 0 || parsePath(pathname) !== null;
}

function safeDecode(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}
