"use client";

import { useState } from "react";
import { appComponents } from "@/apps/registry";
import { getApp } from "@/data/apps";
import { selectAppParams, useOSStore, type AppId } from "@/store/osStore";
import { AppWindow } from "./AppWindow";

/**
 * Mounts the current app inside an AppWindow. Keyed by app id in OS.tsx so
 * switching apps remounts, while nested navigation (params) keeps the window.
 */
export function AppHost({ id }: { id: AppId }) {
  const params = useOSStore(selectAppParams);
  const openApp = useOSStore((s) => s.openApp);
  const closeApp = useOSStore((s) => s.closeApp);
  // Frozen at mount so the exit morph still targets the launching icon
  // after the store has already reset launchSource.
  const [launchSource] = useState(() => useOSStore.getState().launchSource);

  const app = getApp(id);
  const Content = appComponents[id];

  const handleBack = () => {
    if (params.length > 0) openApp(id, { params: params.slice(0, -1) });
    else closeApp();
  };

  return (
    <AppWindow app={app} params={params} launchSource={launchSource} onBack={handleBack}>
      <Content appId={id} params={params} />
    </AppWindow>
  );
}
