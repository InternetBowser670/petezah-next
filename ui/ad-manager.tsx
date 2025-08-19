"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AdManager() {
  const supabase = createClient();
  const scriptId = "adsbygoogle-script";
  const scriptSrc =
    "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6640595376330309";

  function appendAdScript() {
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.src = scriptSrc;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }
  }

  function removeAdScript() {
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }
  }

  useEffect(() => {
    async function checkUserBooster(userId: string) {
      const res = await fetch(`/api/is-booster?user_id=${userId}`, {
        method: "POST",
        body: JSON.stringify({ user_id: userId }),
      });

      if (!res.ok) return;

      const json = await res.json();
      if (json.isBooster) {
        removeAdScript();
      } else {
        appendAdScript();
      }
    }

    appendAdScript();

    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user;
      if (user) {
        checkUserBooster(user.id);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user;

        if (!user) {
          appendAdScript();
        } else {
          checkUserBooster(user.id);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return null;
}
