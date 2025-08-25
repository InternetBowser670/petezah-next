"use client";

import { WipWarning } from "@/ui/wip/wip-page";
import CenteredDivPage from "@/ui/global/centered-div-page";
import { PrimaryButtonChildren } from "@/ui/global/buttons";
import Card from "@/ui/global/card";
import { Checkbox } from "@/ui/global/input";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { setLocalStorage } from "@/ui/settings-manager";

export default function Page() {
  const supabase = createClient();

  function AntiCloseCheckbox() {
    const [antiClose, setAntiClose] = useState(false);

    async function updateAntiClose(newVal: boolean) {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { error } = await supabase
        .from("profiles_private")
        .update({ anti_close_enabled: newVal })
        .eq("id", user.id);

      if (error) console.error(error);
    }

    useEffect(() => {
      const stored = localStorage.getItem("antiClose");
      if (stored !== null) setAntiClose(stored === "true");

      supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (!user) return;
        const { data, error } = await supabase
          .from("profiles_private")
          .select("anti_close_enabled")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error(error);
          return;
        }

        if (data?.anti_close_enabled !== undefined) {
          setAntiClose(data.anti_close_enabled);
          setLocalStorage("antiClose", String(data.anti_close_enabled));
        }
      });
    }, []);

    const handleChange = async () => {
      const newVal = !antiClose;
      setAntiClose(newVal);
      setLocalStorage("antiClose", String(newVal));
      await updateAntiClose(newVal);
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

  function AutoAboutBlankCheckbox() {
    const [autoAboutBlank, setAutoAboutBlank] = useState(false);

    async function updateAutoAboutBlank(newVal: boolean) {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      const { error } = await supabase
        .from("profiles_private")
        .update({ auto_about_blank: newVal })
        .eq("id", user.id);

      if (error) console.error(error);
    }

    useEffect(() => {
      const stored = localStorage.getItem("autoAboutBlank");
      if (stored !== null) setAutoAboutBlank(stored === "true");

      supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (!user) return;
        const { data, error } = await supabase
          .from("profiles_private")
          .select("auto_about_blank")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error(error);
          return;
        }

        if (data?.auto_about_blank !== undefined) {
          setAutoAboutBlank(data.auto_about_blank);
          setLocalStorage("autoAboutBlank", String(data.auto_about_blank));
        }
      });
    }, []);

    const handleChange = async () => {
      const newVal = !autoAboutBlank;
      setAutoAboutBlank(newVal);
      setLocalStorage("autoAboutBlank", String(newVal));
      await updateAutoAboutBlank(newVal);
    };

    return (
      <Checkbox
        checked={autoAboutBlank}
        onChange={handleChange}
        label="Auto about:blank (WIP)"
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
    iframe.src = "/home";
    iframe.style.cssText = `
      position: absolute;
      top: 0; left: 0;
      width: 100vw;
      height: 100vh;
      border: none;
      display: none;
    `;

    popup.document.body.appendChild(iframe);

    iframe.onload = () => {
      const loading = popup.document.getElementById("loading");
      if (loading) loading.remove();
      iframe.style.display = "block";
    };
  }

  return (
    <CenteredDivPage className="p-[50px]!">
      <h1 className="text-3xl font-bold text-center sm:text-5xl md:text-6xl lg:text-7xl mb-4!">
        Settings
      </h1>
      <WipWarning />
      <Card className="mt-4! w-full">
        <h2 className="text-lg font-semibold sm:text-2xl md:text-3xl lg:text-4xl mb-2!">
          Cloaking
        </h2>
        <hr className="my-4!" />
        <p className="mb-2!">Control cloaking behavior to enhance privacy.</p>
        <PrimaryButtonChildren onClick={openAboutBlank}>
          Open in about:blank
        </PrimaryButtonChildren>
        <div className="flex gap-2 mt-2! justify-around">
          <AntiCloseCheckbox />
          <AutoAboutBlankCheckbox />
        </div>
      </Card>
    </CenteredDivPage>
  );
}
