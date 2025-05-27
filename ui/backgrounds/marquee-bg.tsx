import Marquee from "react-fast-marquee";
import Image from "next/image";

const MarqueeRow = () => {
  return (
    <Marquee
      speed={250}
      autoFill={true}
      pauseOnHover={true}
      className="flex-1 h-1/5 z-[0] flex items-center text-[10vh] font-bold text-white overflow-y-hidden"
    >
      <div className="flex items-center mr-5!">
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
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute -inset-[20%] -rotate-12 opacity-75">
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
    </div>
  );
}
