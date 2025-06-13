"use client";

import { useRouter } from "next/navigation";
import Typewriter from "@/ui/typewriter";
import { useEffect, useState, useRef } from "react";
import Particles from "@/ui/particles";
import MarqueeBg from "@/ui/backgrounds/marquee-bg";
import Image from "next/image";
import clsx from "clsx";

export default function Page() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [counter, setCounter] = useState(4);

  const images = [
    { src: "/storage/images/main/geo.jpeg", caption: "Geometry Dash" },
    { src: "/storage/images/main/smashy.jpg", caption: "Smashy Road" },
    { src: "/storage/images/main/ragdoll.jpg", caption: "Ragdoll Simulator" },
    { src: "/storage/ag/g/slope/IMG_5256.jpeg", caption: "Slope" },
    { src: "/storage/images/main/slitherio.jpg", caption: "Slither.io" },
    { src: "/storage/images/main/brawlstars1.jpg", caption: "Brawl Stars" },
    { src: "/storage/ag/g/yohoho/IMG_5302.jpeg", caption: "YoHoHo!" },
  ];

  const imageWidth = 128;
  const totalImages = images.length;

  const containerRef = useRef<HTMLDivElement | null>(null);

  const clonesBefore = images.slice(totalImages - 4, totalImages);
  const clonesAfter = images.slice(0, 4);
  const fullImageSet = [...clonesBefore, ...images, ...clonesAfter];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.style.transition = "transform 0.5s ease-in-out";
    container.style.transform = `translateX(-${counter * imageWidth}px)`;

    Array.from(container.children).forEach((child) => {
      const img = child.querySelector("img");
      if (img) img.classList.remove("glow");
    });

    const currentImage = container.children[counter];
    if (currentImage) {
      const img = currentImage.querySelector("img");
      if (img) img.classList.add("glow");
    }
  }, [counter]);

  function handleTransitionEnd() {
    const container = containerRef.current;
    if (!container) return;

    if (counter >= totalImages + 4) {
      container.style.transition = "none";
      setCounter(4);
      container.style.transform = `translateX(-${4 * imageWidth}px)`;
    } else if (counter <= 0) {
      container.style.transition = "none";
      setCounter(totalImages);
      container.style.transform = `translateX(-${totalImages * imageWidth}px)`;
    }
  }

  function handleNext() {
    setCounter((prev) => prev + 1);
  }

  function handlePrev() {
    setCounter((prev) => prev - 1);
  }

  const router = useRouter();

  function redirectToGames() {
    router.push(`/g`);
  }

  function redirectToAbout() {
    router.push(`/about`);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const currentImage = images[currentIndex];

  return (
    <div className="flex items-center h-full relative w-full bg-[#0A1D37] text-white overflow-hidden">
      <Particles />
      <div className="flex items-center justify-between w-full">
        <div className="relative z-5 p-8! rounded-2xl bg-[#0A1D37] border-2 border-[#0096FF] text-white text-left left-[10%] w-[450px]">
          <h2 className="text-[40px] font-bold">
            Welcome to
            <br />
            <span className="hidden cursor-text bg-linear-to-r from-[#40e0d0] via-[#0096FF] to-[#0096FF] bg-clip-text text-transparent h-[27px] md:inline">
              <Typewriter />
            </span>
            <span className="cursor-text bg-linear-to-r from-[#40e0d0] via-[#0096FF] to-[#0096FF] bg-clip-text text-transparent h-[27px] md:hidden">
              PeteZah Games.
            </span>
            <p className="text-sm my-[20px]! text-gray-400 flex items-center">
              (Official Next.js Version)
              <button
                type="button"
                className="justify-center items-center h-[25px] w-[25px] m-[4px]! bg-[#112c69] rounded-[8px] p-[4px]! inline-flex cursor-pointer"
                onClick={redirectToAbout}
              >
                <span className="inline text-[18px]! text-white nav-icon material-symbols-rounded">
                  help
                </span>
              </button>
            </p>{" "}
          </h2>
          <p className="mb-[20px]! text-[18px]">Game on!</p>
          <button
            onClick={redirectToGames}
            type="button"
            className="bg-[#2a5daf] px-[20px]! py-[12px]! rounded-2xl text-white text-[16px] font-bold transition-colors cursor-pointer duration-500 hover:bg-[#31476b]"
          >
            Start Gaming
          </button>
          <br />
          <div className="flex social-media-tray">
            <a href="https://x.com/PeteZahGames/" target="_parent">
              <div className="flex justify-center items-center h-[30px] w-[30px] m-[4px]! mt-[15px]! bg-[#112c69] rounded-[8px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="14"
                  width="14"
                  viewBox="0 0 512 512"
                >
                  {/*<!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->*/}
                  <path
                    fill="#ffffff"
                    d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                  />
                </svg>
              </div>
            </a>
            <a href="https://discord.gg/cYjHFDguxS" target="_parent">
              <div className="flex justify-center items-center h-[30px] w-[30px] m-[4px]! mt-[15px]! bg-[#112c69] rounded-[8px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="14"
                  width="17.5"
                  viewBox="0 0 640 512"
                >
                  {/*<!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->*/}
                  <path
                    fill="#ffffff"
                    d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z"
                  />
                </svg>
              </div>
            </a>
          </div>
        </div>
        <div className="absolute top-0 flex items-center justify-center w-full pt-2!">
          <div className="hidden gh-image-shuffler items-center w-[60%] max-w-[800px] rounded-[12px] bg-[#1e1e2d] p-[14px]! z-5 shadow-[0_12px_35px_rgba(255,255,255,0.2)] mx-auto border-2 border-white md:flex">
            <button
              type="button"
              id="gh-prev-btn"
              className="gh-arrow bg-[#2a5daf] text-[1.2em] flex items-center justify-center h-[50px] aspect-square rounded-[6px] m-2! transition-all duration-300 z-10 hover:bg-[#0062ff]"
              onClick={handlePrev}
            >
              {"<"}
            </button>

            <div
              className="z-20 w-full overflow-hidden gh-image-wrapper"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                maskImage:
                  "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
              }}
            >
              <div
                ref={containerRef}
                className="flex items-center gh-image-container w-max"
                onTransitionEnd={handleTransitionEnd}
                style={{ transform: `translateX(-${counter * imageWidth}px)` }}
              >
                {fullImageSet.map((image, index) => (
                  <div
                    key={index}
                    className={clsx(
                      "relative flex flex-col z-10 border-white border-2 group items-center text-center cursor-pointer rounded-md overflow-hidden gh-image-box"
                    )}
                    onClick={redirectToGames}
                    style={{ width: imageWidth }}
                  >
                    <Image
                      src={image.src}
                      alt={image.caption || `Image ${index}`}
                      className="gh-image w-[120px] h-[80px] object-cover mx-[4px]"
                      width={120} height={80}
                    />
                    <div
                      className={clsx(
                        "gh-caption absolute opacity-0 group-hover:opacity-100 caption bottom-0 left-0 w-full text-center text-[12px] tracking-[0.5px] bg-[linear-gradient(45deg,rgba(10,29,55,0.9),rgba(40,40,40,0.8))] shadow-[0_3px_8px_rgba(255,255,255,0.1)] transition-opacity duration-500 ease-in-out"
                      )}
                    >
                      {image.caption}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              id="next-btn"
              className="gh-arrow bg-[#2a5daf] text-[1.2em] h-[50px] aspect-square rounded-[6px] m-2! z-10 transition-all duration-500 hover:bg-[#0062ff]"
              onClick={handleNext}
            >
              {">"}
            </button>
          </div>
        </div>
        <MarqueeBg />
        <button
          className="hidden lg:block relative right-[20px] xl:right-[200px] text-center p-[20px]! rounded-[12px] bg-[#0A1D37] cursor-pointer hover:scale-[1.05] hover:translate-y-[-10%] transition duration-300 border-2 border-[#0096FF]"
          type="button"
          onClick={redirectToGames}
        >
          <Image
            height={200}
            width={200}
            src={currentImage.src}
            alt={currentImage.caption}
            className="h-[200px] border-[5px] border-solid border-[rgba(255, 255, 255, 0.5)] rounded-[12px] transition-all duration-300 ease-in-out hover:shadow-[0_20px_50px_rgba(255,255,255,0.4)] hover:scale-105 transform"
            id="large-image"
          />
          <div
            className="mt-[10px]! text-white font-[600] text-[18px] bg-blue-950 backdrop-opacity-50 p-[8px]! rounded-[8px]"
            id="large-image-caption"
          >
            {currentImage.caption}
          </div>
        </button>
      </div>
    </div>
  );
}
