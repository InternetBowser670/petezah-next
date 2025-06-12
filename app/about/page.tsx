import MarqueeBg from "@/ui/backgrounds/marquee-bg";

export default function Page() {
  return (
    <div className="flex items-center relative justify-center h-[100vh] leading-9">
      <MarqueeBg />
      <div className="text-center p-[50px]! rounded-[12px] border-2 border-[#0096FF] backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-[#0A1D37] max-h-[90%] max-w-[80%] overflow-y-scroll">
        <h1 className="text-3xl font-bold cursor-text bg-linear-to-r from-[#40e0d0] via-[#0096FF] to-[#0096FF] bg-clip-text text-transparent">About PeteZah Games</h1>
        <br />
        <hr className="border-gray-400 border-[1.5px] rounded-2xl" />
        <br />
        <p className="text-md">
          <strong>PeteZah Games</strong> started as a passion project — a hub for innovative and
          fast-performing gaming utilities tailored for modern users. Focused on
          speed, reliability, and user control, PeteZah Games empowers players
          and developers with tools that just work.
        </p>
        <br />
        <h1 className="text-3xl font-bold cursor-text bg-linear-to-r from-[#40e0d0] via-[#0096FF] to-[#0096FF] bg-clip-text text-transparent">About PeteZah-Next</h1>
        <br />
        <hr className="border-gray-400 border-[1.5px] rounded-2xl" />
        <br />
        <p className="text-md">
          <strong>PeteZah-Next</strong> is the next evolution — a modern, blazing-fast proxy
          platform built with Next.js and React. It delivers unmatched
          performance, seamless navigation, and rock-solid privacy, all wrapped
          in a sleek interface. Whether you&apos;re bypassing restrictions,
          accelerating access, or just exploring freely, PeteZah-Next gives you
          the power to browse without limits — smart, secure, and stylish.
        </p>
      </div>
    </div>
  );
}
