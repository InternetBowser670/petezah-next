/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { MusicalNoteIcon } from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/outline";
import {
  FaChevronLeft,
  FaChevronRight,
  FaForward,
  FaBackward,
  FaPlay,
  FaVolumeUp,
  FaSearch,
  FaTrashAlt,
} from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import { WipWarning } from "@/ui/wip/wip-page";
import { v4 } from "uuid";
import MarqueeBg from "@/ui/backgrounds/marquee-bg";
import clsx from "clsx";
import MarqueeText from "@/ui/global/marquee-text";

interface YTMusicReult {
  name: string;
  artist: { artistId: string; name: string };
  duration: string;
  thumbnails: { height: number; width: number; url: string }[];
  videoId: string;
  id: string;
}

export default function Page() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<YTMusicReult[] | null>(
    null
  );
  const [queue, setQueue] = useState<YTMusicReult[] | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<null | number>(
    null
  );

  async function getSearchResults(query: string | null) {
    if (query == null) return;

    const res = await fetch(
      `/api/ytmusic/search?q=${encodeURIComponent(query)}`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch search results");
    }

    const data = await res.json();

    return data;
  }

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        const results = await getSearchResults(searchQuery);
        for (let i = 0; i < results.length; i++) {
          results[i].id = v4();
        }
        setSearchResults(results);
      } else {
        setSearchResults(null);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  return (
    <>
      <div className="absolute top-2 w-full flex justify-center items-center">
        <div className="max-w-[560px] max-h-[80vh] overflow-y-auto transition-all z-100 border-2 border-white p-2! rounded-2xl bg-gray-400/10 backdrop-blur-md backdrop-filter hover:bg-gray-200/20 focus:bg-white/30">
          <div className="flex items-center justify-center gap-2">
            <FaSearch />
            <input
              className="focus:outline-0"
              id="searchbar"
              placeholder="Search for any song..."
              type="text"
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              value={searchQuery}
            />
          </div>
          {searchQuery && (
            <div className="flex flex-col gap-2 mt-2">
              {searchResults == null ? (
                <p className="text-white/70">Searching...</p>
              ) : searchResults.length > 0 ? (
                searchResults.map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2! rounded-lg"
                    onClick={() => {
                      if (queue == null || queue.length === 0) {
                        setCurrentTrackIndex(0);
                      }
                      setQueue([...(queue ?? []), track]);
                      setSearchQuery("");
                    }}
                  >
                    <img
                      src={`/api/ytmusic/thumbnail?url=${encodeURIComponent(
                        track.thumbnails.sort((a, b) => b.width - a.width)[0]
                          .url
                      )}`}
                      alt={track.name}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                    <div>
                      <p className="text-white">{track.name}</p>
                      <p className="text-white/70 text-sm">
                        {track.artist.name}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white/70">No results found</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div
        className={`flex items-center relative justify-center h-[100%] gap-3`}
      >
        <MarqueeBg />
        <div
          className={clsx(
            "rounded-[12px] border-2 border-[#0096FF] backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-[#0A1D37] p-[20px]! overflow-auto flex max-h-[80%]",
            queue ? "max-w-[60%]" : "max-w-[90%]"
          )}
        >
          <div className="flex flex-col">
            <div className="flex gap-[20px]! mb-4!">
              <div className="grow-0 shrink-0 basis-[250px] h-[250px] w-[250px] flex justify-center items-center bg-white/10 rounded-xl overflow-hidden">
                {queue && queue.length > 0 && currentTrackIndex != null ? (
                  <img
                    src={`/api/ytmusic/thumbnail?url=${encodeURIComponent(
                      queue[currentTrackIndex].thumbnails.sort(
                        (a, b) => b.width - a.width
                      )[0].url
                    )}`}
                    alt="Album Art"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <MusicalNoteIcon
                    className="m-10! text-white/50"
                    id="musicIcon"
                  />
                )}
              </div>
              <div
                className="info flex flex-col justify-center w-[400px]"
                id="playerInfo"
              >
                <div className="top-icons flex gap-10 justify-between items-center">
                  <h1 className="track-title text-3xl" id="trackTitle">
                    {queue && queue.length > 0 && currentTrackIndex != null
                      ? queue[currentTrackIndex].name
                      : "Not Playing"}
                  </h1>
                  {false && (
                    <StarIcon
                      id="favoritesBtn"
                      className="w-[18px] h-[18px] cursor-pointer text-white/60"
                    />
                  )}
                </div>
                <div className="mb-[20px]! text-gray-500">
                  {queue &&
                    queue.length > 0 &&
                    currentTrackIndex != null &&
                    queue[currentTrackIndex].artist.name}
                </div>
                <div className="controls">
                  <div className="control-row flex gap-3 mb-[10px]! w-full items-center justify-center">
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
        </div>
        {queue && queue.length > 0 && (
          <>
            <div className="max-w-[30%] rounded-[12px] border-2 border-[#0096FF] backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-[#0A1D37] p-[20px]! overflow-auto max-h-[80%]">
              {queue.map((trackData) => (
                <div
                  key={trackData.id}
                  className="flex items-center justify-between gap-3 cursor-pointer hover:bg-white/10 p-2! rounded-lg h-[90px]"
                >
                  <div className="flex items-center gap-3">
                    {" "}
                    <img
                      src={`/api/ytmusic/thumbnail?url=${encodeURIComponent(
                        trackData.thumbnails.sort(
                          (a, b) => b.width - a.width
                        )[0].url
                      )}`}
                      alt={trackData.name}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                    <div className="flex flex-col gap-1">
                      <MarqueeText text={trackData.name} />
                      <MarqueeText
                        className="text-white/70 text-sm border-white/70"
                        text={trackData.artist.name}
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setQueue(
                          queue.filter((track) => track.id !== trackData.id)
                        );
                      }}
                      className="rounded-full mr-2! p-3! hover:bg-white/30 z-100"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
