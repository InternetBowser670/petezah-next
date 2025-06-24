"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User, UserIdentity } from "@supabase/supabase-js";
import { FaGithub, FaGoogle, FaDiscord } from "react-icons/fa";
import MarqueeBg from "@/ui/backgrounds/marquee-bg";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [identities, setIdentities] = useState<UserIdentity[]>([]);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);

      const { data: identityData } = await supabase.auth.getUserIdentities();
      if (identityData?.identities) {
        setIdentities(identityData.identities);
      }
    }
    fetchData();
  }, []);

  async function linkIdentity(provider: "google" | "github" | "discord") {
    const supabase = createClient();
    const { error } = await supabase.auth.linkIdentity({ provider });
    if (
      error?.status === 400 &&
      error?.message.includes("identity_already_exists")
    ) {
      alert(
        "This account is already linked to another user, sorry. You may want to delete the linked account first."
      );
    }
  }

  async function handleDelete() {
    if (!user) return;

    const confirmed = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    const res = await fetch("/api/delete-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    });

    if (res.ok) {
      alert("Your account has been deleted.");
      window.location.href = "/";
    } else {
      const { error } = await res.json();
      alert("Failed to delete account: " + error);
    }
  }

  return (
    <div className="flex items-center justify-center h-[100%] relative">
      <MarqueeBg />
      <div className="max-w-[80%] p-[50px]! rounded-[12px] border-2 border-[#0096FF] backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-[#0A1D37] text-center">
        <h1 className="text-3xl mb-3!">Your Profile</h1>
        {user ? (
          <>
            <p className="mb-3">
              Email: <strong>{user.email}</strong>
            </p>
            <p className="mb-3">
              User ID: <strong>{user.id}</strong>
            </p>

            <br />

            <h2 className="mb-2 text-2xl">Linked Providers:</h2>
            <ul className="mb-4">
              {identities.map((identity) => (
                <li key={identity.id} className="mb-1">
                  ✅ {identity.provider.toUpperCase()}
                </li>
              ))}
            </ul>

            <br />

            <h2 className="mb-2 text-2xl">Link More Accounts:</h2>
            <div className="flex flex-wrap justify-center w-full gap-2">
              {!identities.find((i) => i.provider === "google") && (
                <button
                  className="px-2! py-1! bg-black border-2 border-white rounded-2xl duration-300 hover:bg-gray-800 flex items-center justify-center gap-2"
                  onClick={() => linkIdentity("google")}
                >
                  <FaGoogle /> Link Google
                </button>
              )}
              {!identities.find((i) => i.provider === "github") && (
                <button
                  className="px-2! py-1! bg-black border-2 border-white rounded-2xl duration-300 hover:bg-gray-800 flex items-center justify-center gap-2"
                  onClick={() => linkIdentity("github")}
                >
                  <FaGithub /> Link GitHub
                </button>
              )}
              {!identities.find((i) => i.provider === "discord") && (
                <button
                  className="px-2! py-1! bg-black border-2 border-white rounded-2xl duration-300 hover:bg-gray-800 flex items-center justify-center gap-2"
                  onClick={() => linkIdentity("discord")}
                >
                  <FaDiscord /> Link Discord
                </button>
              )}
            </div>
            <br />
            <hr />
            <br />
            <button
              className="px-4! py-2! text-white bg-black transition-all duration-300 hover:bg-red-800 rounded-2xl border-2 border-white"
              onClick={handleDelete}
            >
              Delete My Account
            </button>
          </>
        ) : (
          <>
            <p>You are not logged in.</p>
            <br />
            <a
              className="bg-[#2a5daf] px-[20px]! py-[12px]! mt-2! rounded-2xl text-white text-[16px] font-bold transition-colors cursor-pointer duration-500 hover:bg-[#31476b]"
              href="/login"
            >
              Sign In (Optional)
            </a>
          </>
        )}
      </div>
    </div>
  );
}
