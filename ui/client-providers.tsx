'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export function SupabaseAuthListener() {
  useEffect(() => {
    const supabase = createClient();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user && localStorage.getItem("antiClose")) {
          const userId = session.user.id;

          fetch("/api/set-anti-close", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              anti_close_enabled: localStorage.getItem("antiClose") == "true" ? true : false,
            }),
          });
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return null;
}
