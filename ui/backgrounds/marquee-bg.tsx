import Marquee from "react-fast-marquee";
import Image from "next/image";

const MarqueeRow = () => {
  const offset = Math.floor(Math.random() * 1000) - 500;
  return (
    <Marquee
      speed={200}
      autoFill={true}
      pauseOnHover={true}
      className="flex-1 h-1/5 z-[0] flex items-center text-[10vh] font-bold text-white"
    >
      <div className="flex items-center mr-5!" style={{ transform: `translateX(${offset}px)` }}>
        PeteZah Games |{" "}
        <Image
          src={"/logo-png-removebg-preview.png"}
          width={200}
          height={10}
          alt="PeteZah Logo"
        />{" "}
        |
      </div>
    </Marquee>
  );
};

export default function MarqueeBg() {
  return (
    <div className="absolute inset-0 z-[0] opacity-75 overflow-hidden">
      <div className="w-full h-full">
        <div className="flex flex-col h-full">
          <MarqueeRow />
          <MarqueeRow />
          <MarqueeRow />
          <MarqueeRow />
          <MarqueeRow />
        </div>
      </div>
    </div>
  );
}
