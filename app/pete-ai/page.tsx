"use client";

import { useChat } from "@ai-sdk/react";
import MarqueeBg from "@/ui/backgrounds/marquee-bg";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <>
      <div className="flex flex-col items-center h-full relative w-full bg-[#0A1D37] text-white overflow-hidden p-2!">
        <MarqueeBg />
        <div className="flex flex-col justify-between w-full h-full z-1">
          <div>
            {messages.map((message) => (
              <div key={message.id} className="whitespace-pre-wrap">
                {message.role === "user" ? "User: " : "AI: "}
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return <span key={`${message.id}-${i}`}>{part.text}</span>;
                  }
                })}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <input
              className="px-2! py-1! bg-black border-2 border-white rounded-2xl transition-colors duration-500 w-200 mx-2!"
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
            />
          </form>
        </div>
      </div>
    </>
  );
}
