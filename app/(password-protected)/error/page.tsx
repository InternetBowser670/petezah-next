"use client";

import { useSearchParams } from "next/navigation";
import MarqueeBg from "@/ui/backgrounds/marquee-bg";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("message");

  return (
    <div className="flex items-center relative justify-center h-[100%]">
      <MarqueeBg />
      <div>
        <h1 className="text-center p-[50px]! rounded-[12px] border-2 text-3xl border-[#0096FF] backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-[#0A1D37]">
          {"Sorry, something went wrong: " + errorMessage || "Error undefined"}
        </h1>
      </div>
    </div>
  );
}
