"use client";

import { useChat } from "@ai-sdk/react";
import MarqueeBg from "@/ui/backgrounds/marquee-bg";
import {
  ArrowUpCircleIcon,
  LockClosedIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  EyeSlashIcon
} from "@heroicons/react/24/solid";
import { MemoizedMarkdown } from "@/ui/memoized-markdown";
import { useEffect, useRef } from "react";
import Image from "next/image";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    experimental_throttle: 50,
  });

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const isUserAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      50;

    if (!isUserAtBottom) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <div className="flex flex-col items-center h-full relative w-full bg-[#0A1D37] text-white overflow-hidden">
        <MarqueeBg className="opacity-50" />
        <div className="flex flex-col items-center justify-between w-full h-full z-1">
          <div className="flex justify-center h-[90%] w-3/4">
            {messages.length > 0 ? (
              <div
                ref={messagesContainerRef}
                className="px-2! w-full overflow-y-scroll [scrollbar-color:#808080_white] bg-[#07142d]/80 backdrop-blur-xs rounded-b-2xl pb-3! pt-3!"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex my-2! whitespace-pre-wrap"
                  >
                    {message.role === "user" ? "User: " : "AI: "}
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <span className="mx-2!" key={`${message.id}-${i}`}>
                              <MemoizedMarkdown
                                className=""
                                id={message.id + "-" + i}
                                content={part.text}
                              />
                            </span>
                          );
                      }
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center">
                  <div className="flex flex-col items-center justify-center bg-[#07142d]/80 backdrop-blur-xs rounded-2xl p-4!">
                    <Image
                      src="/storage/images/logo-png-removebg-preview.png"
                      alt="Pete AI Logo"
                      width={200}
                      height={200}
                    />
                    <p className="text-3xl font-bold">Pete AI</p>
                    <div className="flex items-center justify-around gap-2">
                      <div className="flex items-center">
                        <LockClosedIcon width={20} height={30} />
                        <p className="ml-1!">Secure</p>
                      </div>
                      <span className="text-gray-500">|</span>
                      <div className="flex items-center">
                        <LightBulbIcon width={20} height={30} />
                        <p className="ml-1!">Helpful</p>
                      </div>
                      <span className="text-gray-500">|</span>
                      <div className="flex items-center">
                        <ChatBubbleLeftRightIcon width={20} height={30} />
                        <p className="ml-1!">Communicative</p>
                      </div>
                      <span className="text-gray-500">|</span>
                      <div className="flex items-center">
                        <EyeSlashIcon width={20} height={30} />
                        <p className="ml-1!">Confidential</p>
                      </div>
                    </div>
                    <p className="text-md">Type a message below to get started</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <form
            className="flex items-center justify-center w-full h-[10%]"
            onSubmit={handleSubmit}
          >
            <input
              className="px-2! py-1! bg-black border-2 border-white rounded-2xl transition-colors duration-500 w-1/2 mx-2!"
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
            />
            <button type="submit">
              <ArrowUpCircleIcon
                width={40}
                height={40}
                color="black"
                className="bg-white rounded-full"
              />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
