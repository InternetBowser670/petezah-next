"use client";

import { useEffect } from "react";
import Head from "next/head";

export function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value);
  applyGlobalSettings();
}

function isTopLevelWindow() {
  if (typeof window === "undefined") return false;
  try {
    return window.self === window.top;
  } catch {
    return true;
  }
}

function isTopAboutBlank() {
  if (typeof window === "undefined") return false;
  try {
    return window.top?.location?.href === "about:blank";
  } catch {
    return false;
  }
}

export function openAboutBlank() {
  if (typeof window === "undefined") return;

  const popup = window.open("about:blank", "_blank");
  if (!popup || popup.closed) {
    alert("Please allow popups for this feature to work.");
    return;
  }

  console.log(window.location.href);

  popup.document.title = localStorage.getItem("siteTitle") || "Home";

  const favicon = popup.document.createElement("link");
  favicon.rel = "icon";
  favicon.href = localStorage.getItem("siteLogo") || "/favicon.ico";
  popup.document.head.appendChild(favicon);

  popup.document.body.style.margin = "0";
  popup.document.body.style.display = "flex";
  popup.document.body.style.justifyContent = "center";
  popup.document.body.style.alignItems = "center";
  popup.document.body.style.height = "100vh";
  popup.document.body.style.background = "#fff";
  popup.document.body.style.zIndex = "1000";

  const loadingDiv = popup.document.createElement("div");
  loadingDiv.id = "loading";
  loadingDiv.textContent = "Loading...";
  loadingDiv.style.fontFamily = "sans-serif";
  loadingDiv.style.fontSize = "1.2rem";
  popup.document.body.appendChild(loadingDiv);

  const iframe = popup.document.createElement("iframe");
  iframe.src = "/home";
  iframe.style.cssText = `
  position: absolute;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
  border: none;
`;

  popup.document.body.appendChild(iframe);

  iframe.onload = () => {
    const loading = popup.document.getElementById("loading");
    if (loading) loading.remove();
    iframe.style.visibility = "visible";
  };
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

  if (localStorage.getItem("autoAboutBlank") === "true") {
    const isTop = isTopLevelWindow();
    const topIsAboutBlank = isTopAboutBlank();

    if (isTop && !topIsAboutBlank) {
      openAboutBlank();
      const panicUrl =
        localStorage.getItem("panicUrl") || "https://www.google.com";
      window.location.replace(panicUrl);
    }
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
