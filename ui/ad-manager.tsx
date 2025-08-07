"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AdManager() {

  const supabase = createClient();

  useEffect(() => {
    const scriptId = "adsbygoogle-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6640595376330309";
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    async function fetchData() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (!user) {
        return;
      }

      const res = await fetch(`/api/is-booster?user_id=${user.id}`, {
        method: "POST",
        body: JSON.stringify({ user_id: user.id }),
      });

      const json = await res.json();

      if (res.ok) {
        if (json.isBooster) {
          const existingScript = document.getElementById(scriptId);
          if (existingScript) {
            existingScript.remove();
          }
        }
      }
    }

    fetchData();
  }, [supabase.auth]);

  return null;
}
