"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User, UserIdentity, Provider } from "@supabase/supabase-js";
import {
  FaGithub,
  FaGoogle,
  FaDiscord,
  FaTwitch,
  FaEnvelope,
} from "react-icons/fa";
import MarqueeBg from "@/ui/backgrounds/marquee-bg";
import {
  ArrowUpCircleIcon,
  EyeSlashIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import { PrimaryButtonChildren } from "@/ui/global/buttons";
import BoosterData from "@/ui/profile/booster-data";
import Card from "@/ui/global/card";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [identities, setIdentities] = useState<UserIdentity[]>([]);
  const [passwordToSetA, setPasswordToSetA] = useState<string>("");
  const [showPasswordA, setShowPasswordA] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);
      const { data: identityData } = await supabase.auth.getUserIdentities();
      if (identityData?.identities) {
        setIdentities(identityData.identities);
      }
    }
    fetchData();
  }, []);

  async function linkIdentity(provider: Provider) {
    const { error } = await supabase.auth.linkIdentity({ provider });
    if (
      error?.status === 400 &&
      error?.message.includes("identity_already_exists")
    ) {
      alert(
        "Sorry, this account is already linked to another user. If you delete the other user, you will not be able to link your social account with this one."
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

  const rules = {
    minLength: passwordToSetA.length >= 6,
    hasLowercase: /[a-z]/.test(passwordToSetA),
    hasUppercase: /[A-Z]/.test(passwordToSetA),
    hasDigit: /\d/.test(passwordToSetA),
    hasSymbol: /[^a-zA-Z0-9]/.test(passwordToSetA),
  };

  const allPassed = Object.values(rules).every(Boolean);

  async function handleEmailAdded() {
    if (passwordToSetA.trim() === "") return alert("Please enter a password.");
    if (!allPassed) {
      return alert(
        "Password must be at least 6 characters long, contain uppercase and lowercase letters, a digit, and a symbol."
      );
    }

    const result = await supabase.auth.updateUser({ password: passwordToSetA });

    if (result.error) {
      alert("Failed to link email: " + result.error.message);
    } else {
      alert("Email linked successfully!");
      setPasswordToSetA("");
      const { data: identityData } = await supabase.auth.getUserIdentities();
      if (identityData?.identities) {
        setIdentities(identityData.identities);
      }
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
            {identities.length > 0 && (
              <>
                <h2 className="mb-2 text-2xl">Linked Providers:</h2>
                <ul className="mb-4">
                  {identities.map((identity) => (
                    <li key={identity.id} className="mb-1">
                      ✅ {identity.provider.toUpperCase()}{" "}
                      {identity?.identity_data?.email &&
                        identity.provider == "email" &&
                        `(${identity?.identity_data?.email})`}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {identities.length < 5 && (
              <>
                <br />
                <h2 className="mb-2 text-2xl">Link More Providers:</h2>
                <br />
                <div className="flex flex-wrap justify-center w-full gap-2">
                  {!identities.find((i) => i.provider === "google") && (
                    <PrimaryButtonChildren
                      onClick={() => linkIdentity("google")}
                    >
                      <FaGoogle /> Link Google
                    </PrimaryButtonChildren>
                  )}
                  {!identities.find((i) => i.provider === "github") && (
                    <PrimaryButtonChildren
                      onClick={() => linkIdentity("github")}
                    >
                      <FaGithub /> Link GitHub
                    </PrimaryButtonChildren>
                  )}
                  {!identities.find((i) => i.provider === "discord") && (
                    <PrimaryButtonChildren
                      onClick={() => linkIdentity("discord")}
                    >
                      <FaDiscord /> Link Discord
                    </PrimaryButtonChildren>
                  )}
                  {!identities.find((i) => i.provider === "twitch") && (
                    <PrimaryButtonChildren
                      onClick={() => linkIdentity("twitch")}
                    >
                      <FaTwitch /> Link Twitch
                    </PrimaryButtonChildren>
                  )}
                  {!identities.find((i) => i.provider === "email") && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleEmailAdded();
                      }}
                    >
                      <div className="px-2! py-1! bg-black border-2 border-white rounded-2xl duration-300 flex items-center justify-center gap-2 hover:bg-gray-900">
                        <FaEnvelope className="ml-2!" /> Link Email
                        <input
                          type={showPasswordA ? "text" : "password"}
                          name="password"
                          value={passwordToSetA}
                          placeholder="Enter password"
                          onChange={(e) => setPasswordToSetA(e.target.value)}
                          className="ml-2 text-white bg-transparent border-b-2 focus:outline-none my-1!"
                          required
                        />
                        {passwordToSetA.length > 0 && (
                          <>
                            <button
                              type="button"
                              className="mr-2!"
                              onClick={() => setShowPasswordA(!showPasswordA)}
                            >
                              {showPasswordA ? (
                                <EyeSlashIcon width={20} height={20} />
                              ) : (
                                <EyeIcon width={20} height={20} />
                              )}
                            </button>
                          </>
                        )}
                        <button
                          type="submit"
                          onClick={() => {
                            if (allPassed) handleEmailAdded();
                          }}
                        >
                          <ArrowUpCircleIcon
                            width={36}
                            height={36}
                            color={allPassed ? "white" : "gray"}
                            className="object-cover rounded-full"
                          />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
                {passwordToSetA &&
                  passwordToSetA.length &&
                  !identities.find((i) => i.provider === "email") && (
                    <>
                      <br />
                      <ul className="space-y-2 text-sm">
                        <li
                          className={
                            rules.minLength ? "text-green-600" : "text-red-600"
                          }
                        >
                          {rules.minLength ? "✅" : "❌"} Minimum 6 characters
                        </li>
                        <li
                          className={
                            rules.hasLowercase
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {rules.hasLowercase ? "✅" : "❌"} At least one
                          lowercase letter
                        </li>
                        <li
                          className={
                            rules.hasUppercase
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {rules.hasUppercase ? "✅" : "❌"} At least one
                          uppercase letter
                        </li>
                        <li
                          className={
                            rules.hasDigit ? "text-green-600" : "text-red-600"
                          }
                        >
                          {rules.hasDigit ? "✅" : "❌"} At least one digit
                        </li>
                        <li
                          className={
                            rules.hasSymbol ? "text-green-600" : "text-red-600"
                          }
                        >
                          {rules.hasSymbol ? "✅" : "❌"} At least one symbol
                          (e.g. !@#$%)
                        </li>
                      </ul>
                    </>
                  )}
              </>
            )}

            <br />

            {identities?.some((identity) => identity.provider === "discord") ? (
              <BoosterData />
            ) : (
              <Card className="text-lg">
                Sign in with Discord and boost our server for special perks!
              </Card>
            )}

            <br />
            <hr />
            <br />
            <button
              className="px-4! py-2! text-white bg-black transition-all duration-300 hover:bg-red-700 rounded-2xl border-2 border-white"
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
