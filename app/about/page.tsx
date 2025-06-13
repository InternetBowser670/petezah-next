import MarqueeBg from "@/ui/backgrounds/marquee-bg";
import { Tabs } from "@/ui/tabs";

export default function Page() {
  const tabs = [
    {
      title: "PeteZah Games",
      value: "PeteZah Games",
      content: (
        <div className="text-center p-[50px]! rounded-[12px] border-2 border-[#0096FF] backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-[#0A1D37] max-h-[90%] max-w-[80%] overflow-y-scroll">
          <h1 className="text-3xl font-bold cursor-text bg-linear-to-r from-[#40e0d0] via-[#0096FF] to-[#0096FF] bg-clip-text text-transparent">
            About PeteZah Games
          </h1>
          <br />
          <hr className="border-gray-400 border-[1.5px] rounded-2xl" />
          <br />
          <p className="text-md">
            <strong>PeteZah Games</strong> started as a passion project — a hub
            for innovative and fast-performing gaming utilities tailored for
            modern users. Focused on speed, reliability, and user control,
            PeteZah Games empowers players and developers with tools that just
            work. You can find the original PeteZah Games at{" "}
            <a
              href="https://petezahgames.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              https://petezahgames.com
            </a>{" "}
          </p>
        </div>
      ),
    },
    {
      title: "PeteZah-Next",
      value: "PeteZah-Next",
      content: (
        <div className="text-center p-[50px]! rounded-[12px] border-2 border-[#0096FF] backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-[#0A1D37] max-h-[90%] max-w-[80%] overflow-y-scroll">
          <h1 className="text-3xl font-bold cursor-text bg-linear-to-r from-[#40e0d0] via-[#0096FF] to-[#0096FF] bg-clip-text text-transparent">
            About PeteZah-Next
          </h1>
          <br />
          <hr className="border-gray-400 border-[1.5px] rounded-2xl" />
          <br />
          <p className="text-md">
            <strong>PeteZah-Next</strong> is the next evolution — a modern,
            blazing-fast proxy platform built with Next.js and React. It
            delivers unmatched performance, seamless navigation, and rock-solid
            privacy, all wrapped in a sleek interface. Whether you&apos;re
            bypassing restrictions, accelerating access, or just exploring
            freely, PeteZah-Next gives you the power to browse without limits —
            smart, secure, and stylish.
          </p>
        </div>
      ),
    },
    {
      title: "The Devs",
      value: "The Devs",
      content: (
        <div className="text-center p-[50px]! rounded-[12px] border-2 border-[#0096FF] backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-[#0A1D37] max-h-[90%] max-w-[80%] overflow-y-scroll">
          <h1 className="text-3xl font-bold cursor-text bg-linear-to-r from-[#40e0d0] via-[#0096FF] to-[#0096FF] bg-clip-text text-transparent">
            About The Devs
          </h1>
          <br />
          <hr className="border-gray-400 border-[1.5px] rounded-2xl" />
          <br />
          <p className="text-md">
            <strong>PeteZah-Next and PeteZah Games</strong> are developed by a
            group of dedicated individuals from all across the USA. We are
            committed to delivering a fast, reliable, and useful proxy
            experience for your everyday browsing needs. Whether you&apos;re looking
            to explore apps or stay connected on the go, our goal is to make it
            seamless. Join our community on{" "}
            <a
              href="https://discord.gg/GqshrYNn62"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Discord
            </a>{" "}
            to get updates, offer feedback, or just hang out with the team!
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="flex items-center relative justify-center h-[100%] leading-9">
      <MarqueeBg />
      <div className="w-[80%] h-[80%] flex flex-col justify-center items-center bg-black z-1 rounded-2xl pt-15!">
        <Tabs
          containerClassName="flex justify-center items-center"
          contentClassName="flex justify-center"
          activeTabClassName="text-black"
          tabClassName="mb-2! mx-2! text-white bg-black"
          tabs={tabs}
        />
      </div>
    </div>
  );
}
