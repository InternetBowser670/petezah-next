"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import MarqueeBg from "@/ui/backgrounds/marquee-bg";

const apps = [
  {
    label: "App Request",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSfDWiLkFUAcAsVVzb57HFW1xfGY3dSUwbMUhDdinsyESCCYeg/viewform?usp=sf_link",
    imageUrl: "/storage/images/main/googleforms.jpg",
  },
  {
    label: "PeteAI",
    url: "/pages/other/ai/iframe.html",
    imageUrl: "/storage/images/logo-png-removebg-preview.png",
  },
  {
    label: "Google",
    url: "/iframe.html?url=/storage/ag/a/google/",
    imageUrl: "/storage/ag/a/google/IMG_5324.webp",
  },
  {
    label: "Now.gg",
    url: "/iframe.html?url=/storage/ag/a/nowgg/",
    imageUrl: "/storage/ag/a/nowgg/IMG_5325.png",
  },
  {
    label: "Reddit",
    url: "/iframe.html?url=/storage/ag/a/reddit/",
    imageUrl: "/storage/ag/a/reddit/IMG_5326.jpeg",
  },
  {
    label: "GeForce",
    url: "/iframe.html?url=/storage/ag/a/geforce",
    imageUrl: "/storage/images/main/geforce.jpg",
  },
  {
    label: "Xbox",
    url: "/iframe.html?url=/storage/ag/a/xbox/",
    imageUrl: "/storage/ag/a/xbox/IMG_5327.png",
  },
  {
    label: "ChatGPT",
    url: "/iframe.html?url=/storage/ag/a/chatgpt/",
    imageUrl: "/storage/ag/a/chatgpt/IMG_5328.jpeg",
  },
  {
    label: "Github",
    url: "/iframe.html?url=/storage/ag/a/github",
    imageUrl: "/storage/images/main/github.jpg",
  },
  {
    label: "Facebook",
    url: "/iframe.html?url=/storage/ag/a/facebook/",
    imageUrl: "/storage/ag/a/facebook/IMG_5332.jpeg",
  },
  {
    label: "Discord",
    url: "/iframe.html?url=/storage/ag/a/discord/",
    imageUrl: "/storage/ag/a/discord/IMG_5331.jpeg",
  },
  {
    label: "TikTok",
    url: "/iframe.html?url=/storage/ag/a/tiktok/",
    imageUrl: "/storage/ag/a/tiktok/IMG_5335.png",
  },
  {
    label: "Snapchat",
    url: "/iframe.html?url=/storage/ag/a/snapchat/",
    imageUrl: "/storage/ag/a/snapchat/IMG_5334.png",
  },
  {
    label: "Twitch",
    url: "/iframe.html?url=/storage/ag/a/twitch/",
    imageUrl: "/storage/ag/a/twitch/IMG_5336.png",
  },
  {
    label: "X",
    url: "/iframe.html?url=/storage/ag/a/x/",
    imageUrl: "/storage/ag/a/x/IMG_5337.png",
  },
  {
    label: "YouTube",
    url: "/iframe.html?url=/storage/ag/a/youtube/",
    imageUrl: "/storage/ag/a/youtube/IMG_5338.webp",
  },
  {
    label: "YouTube Invidious",
    url: "/iframe.html?url=/storage/ag/a/invid/",
    imageUrl: "/storage/images/main/invid.png",
  },
  {
    label: "HD Today",
    url: "/iframe.html?url=/storage/ag/a/hdtoday/",
    imageUrl: "/storage/ag/a/hdtoday/IMG_5342.jpeg",
  },
  {
    label: "Aptoid",
    url: "/iframe.html?url=/storage/ag/a/aptoid/",
    imageUrl: "/storage/ag/a/aptoid/IMG_5343.png",
  },
  {
    label: "Android Emulator",
    url: "/iframe.html?url=/storage/ag/a/android/",
    imageUrl: "/storage/ag/a/android/logo.webp",
  },
  {
    label: "EmulatorJS",
    url: "/iframe.html?url=/storage/ag/a/emulatorjs/",
    imageUrl: "/storage/ag/a/emulatorjs/docs/Logo-light.png",
  },
  {
    label: "Rumble",
    url: "/iframe.html?url=/storage/ag/a/rumble",
    imageUrl: "/storage/images/main/rumble.jpg",
  },
  {
    label: "Yahoo",
    url: "/iframe.html?url=/storage/ag/a/yahoo",
    imageUrl: "/storage/images/main/yahoo.jpg",
  },
  {
    label: "Netflix",
    url: "/iframe.html?url=/storage/ag/a/netflix",
    imageUrl: "/storage/images/main/netflix.jpg",
  },
  {
    label: "Hulu",
    url: "/iframe.html?url=/storage/ag/a/hul",
    imageUrl: "/storage/images/main/hulu.jpg",
  },
  {
    label: "Pintrest",
    url: "/iframe.html?url=/storage/ag/a/pinterest",
    imageUrl: "/storage/images/main/pinterist.jpg",
  },
  {
    label: "Soundcloud",
    url: "/iframe.html?url=/storage/ag/a/soundcloud",
    imageUrl: "/storage/images/main/soundcloud.jpg",
  },
  {
    label: "ESPN",
    url: "/iframe.html?url=/storage/ag/a/espn",
    imageUrl: "/storage/images/main/espn.jpg",
  },
  {
    label: "Vortex",
    url: "/iframe.html?url=/storage/ag/a/vortex",
    imageUrl: "/storage/images/main/vortex.png",
  },
  {
    label: "Fifa Rosters",
    url: "/iframe.html?url=/storage/ag/a/fifa",
    imageUrl: "/storage/images/main/fifarosters.jpg",
  },
  {
    label: "Vercel",
    url: "/iframe.html?url=/storage/ag/a/vercel",
    imageUrl: "/storage/images/main/vercel.jpg",
  },
  {
    label: "VsCode",
    url: "/iframe.html?url=/storage/ag/a/vscode",
    imageUrl: "/storage/images/main/vscode.jpg",
  },
  {
    label: "W3School",
    url: "/iframe.html?url=/storage/ag/a/w3school",
    imageUrl: "/storage/images/main/w3school.jpg",
  },
  {
    label: "Scratch",
    url: "/iframe.html?url=/storage/ag/a/scratch",
    imageUrl: "/storage/images/main/scratch.jpg",
  },
  {
    label: "Gmail",
    url: "/iframe.html?url=/storage/ag/a/gmail",
    imageUrl: "/storage/images/main/gmail.jpg",
  },
  {
    label: "Google Drive",
    url: "/iframe.html?url=/storage/ag/a/drive",
    imageUrl: "/storage/images/main/drive.jpg",
  },
];

export default function Page() {
  const [query, setQuery] = useState("");

  const filtered = apps.filter((app) =>
    app.label.toLowerCase().includes(query.toLowerCase())
  );

  function AppCard({
    app,
  }: {
    app: { label: string; imageUrl: string; url: string };
  }) {
    return (
      <>
        <div className="flex items-center justify-center">
          <div className="relative w-[200px] h-[170px] overflow-hidden transition-transform duration-500 rounded-2xl border-white border-2 bg-black flex justify-center items-center hover:scale-110 group">
            <Link
              className="w-full h-[170px]! flex justify-center items-center"
              href={app.url + "/index.html"}
            >
              <Image
                className="object-cover! p-2 h-full hover:scale-110 transition-all duration-500 text-white"
                width={200}
                height={170}
                alt={app.label}
                src={app.imageUrl}
                unoptimized
              />
              <p className="absolute bottom-0 right-0 text-center bg-black/60 p-[10px] w-full">
                {app.label}
              </p>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center h-full relative w-full bg-[#0A1D37] text-white overflow-hidden">
        <MarqueeBg />
        <div className="relative w-full h-full overflow-y-scroll z-1 backdrop-blur-[2px]">
          <div className="h-[12%] w-full bg-black/20 p-2! px-8! flex justify-center items-center">
            <input
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              className="px-2! py-1! bg-black border-2 border-white rounded-2xl transition-colors duration-500 w-200 mx-2!"
              name="searchQuery"
              id="searchQuery"
              placeholder="Search for your favorite game..."
            />
          </div>
          <div>
            <div className="flex-1 overflow-y-auto !px-4 !py-6">
              {(
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {filtered.map((app: any, index: number) => (
                    <AppCard key={index} app={app} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
