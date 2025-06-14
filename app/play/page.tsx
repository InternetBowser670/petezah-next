"use client";

import MarqueeBg from "@/ui/backgrounds/marquee-bg";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();

  const url = searchParams.get("url")

  if (!url) {
    return (
      <div className="flex items-center relative justify-center h-[100%]">
        <MarqueeBg />
        <div>
          <h1 className="text-center p-[50px]! rounded-[12px] border-2 text-3xl border-[#0096FF] backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-[#0A1D37]">
            No URL provided
          </h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center relative justify-center h-[100%]">
        <MarqueeBg />
        <div className="z-1 h-[90%] w-[90%] border-[#0096FF] bg-[#0A1D37] border-2 rounded-2xl p-2! flex flex-col">
          <iframe className="flex-1 w-full h-max rounded-t-2xl" src={`${url}`} ></iframe>
          <div className="bg-black h-[100px] w-full rounded-b-2xl"></div>
        </div>
      </div>
    </>
  );
}
