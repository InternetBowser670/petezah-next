"use client";

import Image from "next/image";
import CenteredDivPage from "@/ui/global/centered-div-page";
import { useState } from "react";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/outline";
import {
  FaChevronLeft,
  FaChevronRight,
  FaForward,
  FaBackward,
  FaPlay,
  FaVolumeUp,
  FaSearch
} from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import { WipWarning } from "@/ui/wip/wip-page";

export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [albumCoverSRC, setAlbumCoverSRC] = useState<string | null>(null);
  return (
    <>
      <div className="absolute top-2 w-full flex justify-center items-center">
        <div className="max-w-[560px] flex items-center justify-center gap-2 z-100 border-2 border-white p-2! rounded-2xl bg-gray-400/10 backdrop-blur-md backdrop-filter hover:bg-gray-200/20 focus:bg-white/30">
          <FaSearch /><input className="focus:outline-0" id="searchbar" placeholder="Search for any song..." type="text" />
        </div>
      </div>
      <CenteredDivPage className="py-[20px]! pl-[20px]! overflow-auto">
        <div className="flex flex-col">
          <div className="flex gap-[20px]! mb-4!">
            {" "}
            <div className="grow-0 shrink-0 basis-[250px] h-[250px] w-[250px] flex justify-center items-center bg-white/10 rounded-xl">
              {albumCoverSRC ? (
                <>
                  {" "}
                  <Image src="" alt="Album Art" crossOrigin="anonymous" />
                </>
              ) : (
                <>
                  <MusicalNoteIcon
                    className="m-10! text-white/50"
                    id="musicIcon"
                  />
                </>
              )}
            </div>
            <div
              className="info flex flex-col justify-center w-[400px]"
              id="playerInfo"
            >
              <div className="top-icons flex gap-10 justify-between items-center">
                <h1 className="track-title text-3xl" id="trackTitle">
                  Not Playing
                </h1>
                {
                  false && (
                    <StarIcon
                      id="favoritesBtn"
                      className="w-[18px] h-[18px] cursor-pointer text-white/60"
                    />
                  ) /* Not yet lol */
                }
              </div>
              <div className="artist mb-[20px]!" id="artistName"></div>
              <div className="controls">
                <div className="control-row flex gap-3  mb-[10px]! w-full items-center justify-center">
                  <div className="bg-white/10 hover:bg-white/40 transition-all duration-400 rounded-full aspect-square size-10 text-white p-3! flex items-center justify-center">
                    <FaBackward id="backward10" className="size-full" />
                  </div>
                  <div className="bg-white/10 hover:bg-white/40 transition-all duration-400 rounded-full aspect-square size-10 text-white p-3! flex items-center justify-center">
                    <FaChevronLeft id="backward5" className="size-full" />
                  </div>
                  <div className="bg-white/10 hover:bg-white/40 transition-all duration-400 rounded-full aspect-square size-10 text-white p-3! flex items-center justify-center">
                    <FaPlay id="playPause" className="size-full" />
                  </div>
                  <div className="bg-white/10 hover:bg-white/40 transition-all duration-400 rounded-full aspect-square size-10 text-white p-3! flex items-center justify-center">
                    <FaChevronRight id="forward5" className="size-full" />
                  </div>
                  <div className="bg-white/10 hover:bg-white/40 transition-all duration-400 rounded-full aspect-square size-10 text-white p-3! flex items-center justify-center">
                    <FaForward id="forward10" className="size-full" />
                  </div>
                </div>

                <div className="control-row flex gap-3! mb-[15px]! w-full items-center justify-center">
                  <div className="bg-white/10 hover:bg-white/40 transition-all duration-400 rounded-full aspect-square size-10 text-white p-3! flex items-center justify-center">
                    <FaRepeat id="loopToggle" className="size-full" />
                  </div>
                  <div className="bg-white/10 hover:bg-white/40 transition-all duration-400 rounded-full aspect-square size-10 text-white p-3! flex items-center justify-center">
                    <FaVolumeUp id="volumeBtn" className="size-full" />
                  </div>
                </div>
              </div>
              <div
                id="seekbar"
                className="h-[6px] bg-white/20 rounded-3xl relative hover:h-[12px] transition-all duration-300 w-full"
              >
                <div id="progress"></div>
              </div>
              <div className="timecodes flex justify-between">
                <span id="currentTime">0:00</span>
                <span id="remainingTime">-0:00</span>
              </div>
            </div>
            <div className="lyrics-info" id="lyricsInfo">
              <div className="lyrics-content" id="lyricsContent"></div>
            </div>
          </div>
          <WipWarning />
        </div>
      </CenteredDivPage>
    </>
  );
}
