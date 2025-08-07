"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function AdManager() {
  const [isBooster, setIsBooster] = useState<boolean | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      await supabase.auth.getSession().then(async ({ data: { session } }) => {
        const user = session?.user;

        if (!user) {
          setIsBooster(false);
          return;
        }

        const res = await fetch(`/api/is-booster?user_id=${user.id}`, {
          method: "POST",
          body: JSON.stringify({
            user_id: user.id,
          }),
        });

        const json = await res.json();

        if (res.ok) {
          setIsBooster(json.isBooster);
        }
      });
    }
    fetchData();
  }, [supabase.auth]);

  return (
    <>
      {!(isBooster == true || isBooster == null) && (
        <>
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6640595376330309"
            crossOrigin="anonymous"
          />
        </>
      )}
    </>
  );
}
