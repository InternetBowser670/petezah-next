"use client";

import { useEffect } from "react";

export default function AntiScreenshotOverlay() {
  useEffect(() => {
    if (navigator.webdriver) {
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.backgroundColor = "black";
      overlay.style.zIndex = "999999";
      document.body.appendChild(overlay);
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        document.body.style.backgroundColor = "black";
        document.body.style.color = "black";
      } else {
        document.body.style.backgroundColor = "";
        document.body.style.color = "";
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}