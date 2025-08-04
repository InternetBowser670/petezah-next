"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Card from "@/ui/global/card";

export default function BoosterData() {
  const [isBooster, setIsBooster] = useState<boolean | null>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user;

      if (!user) return;

      const res = await fetch(
        `/api/is-booster?user_id=${session.user.id}`,
        {
          method: "POST",
          body: JSON.stringify({
            user_id: user.id,
          }),
        }
      );

      const json = await res.json();

      if (res.ok) {
        setIsBooster(json.isBooster);
      }
      
    });
  }, [supabase.auth]);


  return (
    <Card className="flex flex-col items-center justify-center h-full">
      <h1 className="mb-4 text-2xl font-bold">Booster Data</h1>
      {isBooster !== null ? (
        <>
          <p>{isBooster ? "You are a booster! We have tons of perks coming your way." : <span>You are not a booster. Boost our Discord server at <a className="text-blue-500" target="_blank" rel="noopener noreferrer" href="https://discord.gg/GqshrYNn62">https://discord.gg/GqshrYNn62</a>.</span>}</p>
        </>
      ) : (
        <p className="text-lg">No booster data available at the moment.</p>
      )}
    </Card>
  );
}
