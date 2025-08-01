/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function WidgetBotCrate() {
  const pathname = usePathname();

  const shouldShow = pathname === "/play" || pathname === "/app";

  useEffect(() => {
    if (!shouldShow) return;

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@widgetbot/crate@3";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      //@ts-ignore
      const crate = new window.Crate({
        server: "1337108365591187640",
        channel: "1345454451904745673",
        css: "margin-bottom: 8px;",
      });

      //@ts-ignore
      window.__crateInstance = crate;
    };

    document.body.appendChild(script);

    return () => {
      const iframes = document.querySelectorAll('iframe[src*="widgetbot"]');
      iframes.forEach((iframe) => iframe.remove());

      const crateTags = document.querySelectorAll("crate");
      crateTags.forEach((el) => el.remove());

      const scriptTag = document.querySelector(
        'script[src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3"]'
      );
      scriptTag?.remove();

      //@ts-ignore
      delete window.__crateInstance;
    };
  }, [shouldShow]);

  return null;
}
