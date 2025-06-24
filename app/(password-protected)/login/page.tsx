"use client";

import { login, signup } from "./actions";
import MarqueeBg from "@/ui/backgrounds/marquee-bg";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { FaGithub, FaGoogle, FaDiscord, FaTwitch } from "react-icons/fa";

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    fetchUser();
  }, []);

  async function signInWithGithub() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
    });
  }

  async function signInWithGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  async function signInWithDiscord() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "discord",
    });
  }

  async function signInWithTwitch() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "twitch",
    });
  }

  return (
    <div className="flex items-center relative justify-center h-[100%]">
      <MarqueeBg />
      {user ? (
        <div className="max-w-[80%] p-[50px]! rounded-[12px] border-2 border-[#0096FF] backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-[#0A1D37]">
          <h1 className="text-3xl text-center">You are already logged in!</h1>
          <br />
          <p className="text-center text-gray-300">
            You can now go to the{" "}
            <a href="/home" className="text-blue-400 hover:underline">
              home page
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <form className="max-w-[80%] text-center px-[50px]! py-[25px]! rounded-[12px] border-2 border-[#0096FF] backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-[#0A1D37]">
            <h1 className="text-3xl mb-3!">Authenticate</h1>
            <label htmlFor="email">Email:</label>
            <input
              className="px-2! py-1! bg-black border-2 border-white rounded-2xl transition-colors duration-500 mx-2! w-100"
              id="email"
              name="email"
              type="email"
              required
            />
            <br />
            <br />
            <label htmlFor="password">Password:</label>
            <input
              className="px-2! py-1! bg-black border-2 border-white rounded-2xl transition-colors duration-500 mx-2! w-100"
              id="password"
              name="password"
              type="password"
              required
            />
            <br />
            <br />
            <div>
              <button
                className="px-2! py-1! bg-black border-2 border-white rounded-2xl hover:bg-gray-800 transition-colors duration-500"
                formAction={login}
              >
                Log in
              </button>
              <span> or </span>
              <button
                className="px-2! py-1! bg-black border-2 border-white rounded-2xl hover:bg-gray-800 transition-colors duration-500"
                formAction={signup}
              >
                Sign up
              </button>
            </div>
            <br />
            <p className="text-gray-500">
              You will have to verify your email address before you can log in.
            </p>
            <br />
            <p>Or sign in with:</p>
            <br />
            <div className="flex flex-wrap justify-center w-full gap-2">
              <button
                className="px-2! py-1! bg-black border-2 border-white rounded-2xl hover:bg-gray-800 transition-colors duration-500 flex items-center justify-center gap-2"
                onClick={signInWithGoogle}
              >
                <FaGoogle /> Google
              </button>
              <button
                className="px-2! py-1! bg-black border-2 border-white rounded-2xl hover:bg-gray-800 transition-colors duration-500 flex items-center justify-center gap-2"
                onClick={signInWithGithub}
              >
                <FaGithub /> GitHub
              </button>
              <button
                className="px-2! py-1! bg-black border-2 border-white rounded-2xl hover:bg-gray-800 transition-colors duration-500 flex items-center justify-center gap-2"
                onClick={signInWithDiscord}
              >
                <FaDiscord /> Discord
              </button>
              <button
                className="px-2! py-1! bg-black border-2 border-white rounded-2xl hover:bg-gray-800 transition-colors duration-500 flex items-center justify-center gap-2"
                onClick={signInWithTwitch}
              >
                <FaTwitch /> Twitch
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
