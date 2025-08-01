"use client";

import MarqueeBg from "@/ui/backgrounds/marquee-bg";
import { useSearchParams } from "next/navigation";
import { BsFullscreen } from "react-icons/bs";
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { useRef } from "react";
import WidgetBotCrate from "@/ui/play/crate";
import { FaDiscord } from "react-icons/fa6";

export default function Page() {
  const searchParams = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const url = searchParams.get("url");

  function toggleFullscreen() {
    const iframe = iframeRef.current;
    if (!iframe) return;

    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } else if ((iframe as any).mozRequestFullScreen) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (iframe as any).mozRequestFullScreen();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } else if ((iframe as any).webkitRequestFullscreen) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (iframe as any).webkitRequestFullscreen();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } else if ((iframe as any).msRequestFullscreen) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (iframe as any).msRequestFullscreen();
    }
  }

  function refreshIframe() {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  }

  function openIframeSource() {
    if (iframeRef.current) {
      window.open(iframeRef.current.src, "_blank");
    }
  }

  function DCMessagae() {
    alert(
      'You can now send messages in the Discord channel. Click the icon in the bottom to open the channel. Alternatively, you can join the server by using the link provided by Pete-ai (in "apps").'
    );
  }

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
          <iframe
            className="flex-1 w-full bg-white h-max rounded-t-2xl"
            src={`${url}`}
            ref={iframeRef}
          ></iframe>
          <div className="bg-black h-[100px] w-full rounded-b-2xl border-white border-t-2 flex justify-around items-center">
            <button
              onClick={refreshIframe}
              className="border-2 border-gray-400 rounded-full hover:bg-gray-900 p-4! hover:scale-110 transition-all duration-500"
            >
              <ArrowPathIcon width={30} height={30} />
            </button>
            <button
              onClick={toggleFullscreen}
              className="border-2 border-gray-400 rounded-full hover:bg-gray-900 p-4! hover:scale-110 transition-all duration-500"
            >
              <BsFullscreen size={20} />
            </button>
            <button
              onClick={openIframeSource}
              className="border-2 border-gray-400 rounded-full hover:bg-gray-900 p-4! hover:scale-110 transition-all duration-500"
            >
              <ArrowTopRightOnSquareIcon width={30} height={30} />
            </button>
            <button
              onClick={DCMessagae}
              className="border-2 border-gray-400 rounded-full hover:bg-gray-900 p-4! hover:scale-110 transition-all duration-500"
            >
              <FaDiscord size={30} />
            </button>
          </div>
        </div>
        <WidgetBotCrate />
      </div>
    </>
  );
}
