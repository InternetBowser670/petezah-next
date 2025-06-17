import Marquee from "react-fast-marquee";
import Image from "next/image";

const MarqueeRow = ({ hoverPause }: { hoverPause?: boolean }) => {
  return (
    <Marquee
      speed={250}
      autoFill={true}
      pauseOnHover={hoverPause ? true : false}
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

export default function MarqueeBg({ hoverPause, className }: { hoverPause?: boolean, className?: string}) {
  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`}>
      <div className="absolute -inset-[20%] -rotate-12 opacity-75">
        <div className="w-full h-full">
          <div className="flex flex-col h-full">
            <MarqueeRow hoverPause={hoverPause} />
            <MarqueeRow hoverPause={hoverPause} />
            <MarqueeRow hoverPause={hoverPause} />
            <MarqueeRow hoverPause={hoverPause} />
            <MarqueeRow hoverPause={hoverPause} />
          </div>
        </div>
      </div>
    </div>
  );
}
