"use client";

import { WipWarning } from "@/ui/wip/wip-page";
import CenteredDivPage from "@/ui/global/centered-div-page";
import { PrimaryButtonChildren } from "@/ui/global/buttons";
import Card from "@/ui/global/card";
import { Checkbox } from "@/ui/global/input";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Page() {
  function AntiCloseCheckbox() {
    const [antiClose, setAntiClose] = useState(false);
    const supabase = createClient();

    useEffect(() => {
      const stored = localStorage.getItem("antiClose");
      if (stored !== null) setAntiClose(stored === "true");

      supabase.auth.getSession().then(async ({ data: { session } }) => {
        const user = session?.user;


        if (!user) return;

        const res = await fetch(
          `/api/private-profile?user_id=${session.user.id}`,
          {
            method: "POST",
            body: JSON.stringify({
              user_id: user.id,
            }),
          }
        );

        const json = await res.json();

        if ("antiClose" in json) {
          setAntiClose(json.antiClose);
          localStorage.setItem("antiClose", String(json.antiClose));
        }
      });
    }, [supabase.auth]);

    const handleChange = async () => {
      const newVal = !antiClose;

      setAntiClose(newVal);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (!user) return;

      fetch("/api/set-anti-close", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: user.id, anti_close_enabled: newVal }),
      });
      localStorage.setItem("antiClose", String(newVal));
    };

    return (
      <Checkbox
        checked={antiClose}
        onChange={handleChange}
        label="Anti-Close"
        className="mt-2!"
      />
    );
  }

  function openAboutBlank() {
    if (typeof window === "undefined") return;

    const popup = window.open("about:blank", "_blank");
    if (!popup || popup.closed) {
      alert("Please allow popups for this feature to work.");
      return;
    }

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
    popup.document.body.innerHTML = `
		<div id="loading" style="font-family: sans-serif; font-size: 1.2rem;">
			Loading...
		</div>
	`;

    const iframe = popup.document.createElement("iframe");
    iframe.src = "/home"; // Or any route in your Next.js app
    iframe.style.cssText = `
		position: absolute;
		top: 0; left: 0;
		width: 100vw;
		height: 100vh;
		border: none;
		display: none; /* hide until loaded */
	`;

    popup.document.body.appendChild(iframe);

    iframe.onload = () => {
      const loading = popup.document.getElementById("loading");
      if (loading) loading.remove();
      iframe.style.display = "block";
    };
  }

  return (
    <>
      <CenteredDivPage>
        <h1 className="text-3xl font-bold text-center sm:text-5xl md:text-6xl lg:text-7xl mb-4!">
          Settings
        </h1>
        <WipWarning estCompletionDate="by the beginning of the school year" />
        <Card className="mt-4! w-full">
          <h2 className="text-lg font-semibold sm:text-2xl md:text-3xl lg:text-4xl mb-2!">
            Cloaking
          </h2>
          <hr className="my-4!" />
          <p className="mb-2!">Control cloaking behavior to enhance privacy.</p>
          <PrimaryButtonChildren onClick={openAboutBlank}>
            Open in about:blank
          </PrimaryButtonChildren>
          <div>
            <AntiCloseCheckbox />
          </div>
        </Card>
      </CenteredDivPage>
    </>
  );
}
