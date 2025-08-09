"use client";

import { useEffect } from "react";
import Head from "next/head";

export function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value);
  applyGlobalSettings();
}

export function applyGlobalSettings() {
  const storedTitle = localStorage.getItem("siteTitle");
  if (storedTitle) {
    document.title = storedTitle;
  } else {
    document.title = "PeteZah-Next";
  }
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

  const storedTitle =
    typeof window !== "undefined" ? localStorage.getItem("siteTitle") : null;

  return (
    <>
      {storedTitle && (
        <Head>
          <title key="title">{storedTitle}</title>
        </Head>
      )}
      {children}
    </>
  );
}
