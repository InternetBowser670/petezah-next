"use client";

import { useChat } from "@ai-sdk/react";
import MarqueeBg from "@/ui/backgrounds/marquee-bg";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { MemoizedMarkdown } from "@/ui/memoized-markdown";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    experimental_throttle: 50,
  });

  return (
    <>
      <div className="flex flex-col items-center h-full relative w-full bg-[#0A1D37] text-white overflow-hidden">
        <MarqueeBg className="opacity-50" />
        <div className="flex flex-col items-center justify-between w-full h-full z-1">
          <div className="h-[90%] px-2! w-1/2 overflow-y-scroll [scrollbar-color:#808080_white] bg-blue-950 rounded-b-2xl pb-3!">
            {messages.map((message) => (
              <div key={message.id} className="flex whitespace-pre-wrap">
                {message.role === "user" ? "User: " : "AI: "}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <span className="mx-2!" key={`${message.id}-${i}`}><MemoizedMarkdown id={message.id + "-" + i} content={part.text} /></span>
                      );
                  }
                })}
              </div>
            ))}
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
