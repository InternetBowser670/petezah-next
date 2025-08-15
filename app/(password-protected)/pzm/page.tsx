/* eslint-disable @next/next/no-img-element */
"use client";

import CenteredDivPage from "@/ui/global/centered-div-page";
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
} from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import { WipWarning } from "@/ui/wip/wip-page";
import { v4 } from "uuid";

interface ITunesResult {
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
  id: string;
}

interface ITunesResponse {
  resultCount: number;
  results: ITunesResult[];
}

export default function Page() {
  const [albumCoverSRC, setAlbumCoverSRC] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<ITunesResponse | null>(
    null
  );
  const [queue, setQueue] = useState<ITunesResult[] | null>(null);

  const SEARCH_EP = "https://itunes.apple.com/search?term=";

  async function getSearchResults(query: string | null) {
    if (query == null) return;
    const url = `${SEARCH_EP}${encodeURIComponent(query)}&media=music&limit=10`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (e) {
      console.log(e);
      return { type: "error", message: e };
    }
  }

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        const results = await getSearchResults(searchQuery);
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
              ) : searchResults.resultCount > 0 ? (
                searchResults.results.map((track) => (
                  <div
                    key={track.previewUrl}
                    className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2! rounded-lg"
                    onClick={() => {
                      const trackWithId: ITunesResult = {
                        ...track,
                        id: v4(),
                      };
                      if (queue == null || queue.length === 0) {
                        setAlbumCoverSRC(
                          track.artworkUrl100.replaceAll("100", "600")
                        );
                      }
                      setQueue([...(queue ?? []), trackWithId]);
                      setSearchQuery("");
                    }}
                  >
                    <img
                      src={track.artworkUrl100}
                      alt={track.trackName}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                    <div>
                      <p className="text-white">{track.trackName}</p>
                      <p className="text-white/70 text-sm">
                        {track.artistName}
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
      <CenteredDivPage className="p-[20px]! overflow-auto flex max-h-[80%]">
        <div className="flex flex-col">
          <div className="flex gap-[20px]! mb-4!">
            <div className="grow-0 shrink-0 basis-[250px] h-[250px] w-[250px] flex justify-center items-center bg-white/10 rounded-xl overflow-hidden">
              {albumCoverSRC ? (
                <img
                  src={albumCoverSRC}
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
                  Not Playing
                </h1>
                {false && (
                  <StarIcon
                    id="favoritesBtn"
                    className="w-[18px] h-[18px] cursor-pointer text-white/60"
                  />
                )}
              </div>
              <div className="artist mb-[20px]!" id="artistName"></div>
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
        <div className="bl-2 bl-white">
          {queue && queue.length > 0 && (
            <>
              {queue.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2! rounded-lg"
                  onClick={() => {
                    const trackWithId: ITunesResult = {
                      ...track,
                      id: v4(),
                    };
                    if (queue == null || queue.length === 0) {
                      setAlbumCoverSRC(
                        track.artworkUrl100.replaceAll("100", "600")
                      );
                    }
                    setQueue([...(queue ?? []), trackWithId]);
                    setSearchQuery("");
                  }}
                >
                  <img
                    src={track.artworkUrl100}
                    alt={track.trackName}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                  <div>
                    <p className="text-white">{track.trackName}</p>
                    <p className="text-white/70 text-sm">{track.artistName}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </CenteredDivPage>
    </>
  );
}
