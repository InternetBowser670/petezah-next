"use client";

import { useEffect } from "react";

export function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value);
  applyGlobalSettings();
}

export function applyGlobalSettings() {
  localStorage.setItem("settingsUpdated", Date.now().toString());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const beforeUnloadHandler = (e: any) => {
    e.preventDefault();
    e.returnValue = "";
  };

  if (localStorage.getItem("antiClose") === "true") {
    window.addEventListener("beforeunload", beforeUnloadHandler);
  } else {
    window.removeEventListener("beforeunload", beforeUnloadHandler);
  }
}

export default function SettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    applyGlobalSettings();
  }, []);

  return <>{children}</>;
}
