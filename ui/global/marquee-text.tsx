import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

interface MarqueeTextProps {
  text: string;
  className?: string;
}

export default function MarqueeText({ text, className }: MarqueeTextProps) {
  const [threshold, setThreshold] = useState(40);

  useEffect(() => {
    function updateThreshold() {
      const width = window.innerWidth;

      if (width >= 1280) setThreshold(50); // xl
      else if (width >= 1024) setThreshold(40); // lg
      else if (width >= 768) setThreshold(30); // md
      else setThreshold(20); // sm
    }

    updateThreshold();
    window.addEventListener("resize", updateThreshold);
    return () => window.removeEventListener("resize", updateThreshold);
  }, []);

  if (text.length < threshold) {
    return <p className={className}>{text}</p>;
  }

  return (
    <Marquee autoFill={false} pauseOnHover={true} className={className}>
      <p className={"ml-2! pl-2! border-l-2 border-white " + className}>
        {text}
      </p>
    </Marquee>
  );
}
