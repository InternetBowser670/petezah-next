"use client";

import Link from "next/link";
import clsx from "clsx";
import { useSidebar } from "@/context/sidebar-context";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { GoHome, GoChevronLeft } from "react-icons/go";
import { IoGameControllerOutline } from "react-icons/io5";
import { SlGlobe } from "react-icons/sl";
import { BsGrid3X3GapFill, BsGear } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { FaRegCircleQuestion } from "react-icons/fa6";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { sidebarToggled, toggleSidebar, hydrated } = useSidebar();

  if (!hydrated) return null;

  function isActiveTab(linkHref: string, altLinks?: string[]) {
    if (pathname === "/pages/settings/p" && linkHref === "/pages/settings") {
      //special case for profile settings
      return false;
    }

    return (
      pathname === linkHref ||
      (altLinks && altLinks.includes(pathname)) ||
      pathname.startsWith(linkHref + "/")
    );
  }

  function NavbarLink({
    title,
    url,
    Icon,
    altLinks,
  }: {
    title: string;
    url: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    altLinks?: string[];
  }) {
    function handleClick() {
      router.push(url);
    }

    return (
      <li
        onClick={handleClick}
        className={clsx(
          !sidebarToggled ? "items-center! w-[50px]! aspect-square!" : "w-[90%] translate-x-[8px]",
          "max-w-[90%] h-[50px] flex transition-all rounded-2xl disable-no-m-p hover:bg-white hover:text-black my-2! ",
          isActiveTab(url, altLinks) && "bg-white text-black"
        )}
      >
        <button type="button" className="w-full h-full disable-no-m-p">
          <div className={clsx("box-content flex w-full h-full items-center disable-no-m-p ml-[4px]!")}>
            <Icon className="z-10 flex items-center justify-center w-6 h-6 ml-2!" />
            <span
              className={clsx(
                "nav-label disable-no-m-p transition-all",
                !sidebarToggled && "opacity-0 content-[] w-0",
                sidebarToggled && "opacity-100 ml-2!"
              )}
            >
              {title}
            </span>
          </div>
        </button>
      </li>
    );
  }

  return (
    mounted && (
      <div className="flex w-full h-full">
        <aside
          className={clsx(
            "sidebar ml-2 border-white border-2 duration-300!",
            sidebarToggled ? "sidebar-expanded w-[270px]" : "collapsed"
          )}
        >
          <header className="flex justify-between sidebar-header">
            <Link
              href="/home"
              className="header-logo w-[46px] h-[46px] flex justify-center items-center"
            >
              <Image
                src="/logo-png-removebg-preview.png"
                height={40}
                width={40}
                alt="PeteZah"
              />
            </Link>
            <div
              className={clsx("spacer mt-20px!", { nospacer: sidebarToggled })}
            ></div>
            <button
              className={clsx("toggler transition-all w-[40px] absolute bg-white text-black flex justify-center items-center rounded-xl h-[40px] hover:bg-gray-300")}
              type="button"
              onClick={toggleSidebar}
            >
              <GoChevronLeft className={clsx("material-symbols-rounded transition-all", !sidebarToggled && "rotate-180")}>chevron_left</GoChevronLeft>
            </button>
          </header>

          <div
            className={clsx("spacer spacer-margin-top", {
              nospacer: sidebarToggled,
            })}
          ></div>

          <hr
            className={clsx(
              !sidebarToggled && "w-[80%] ml-[10%]!",
              sidebarToggled && "w-[90%] ml-[5%]!",
              "transition-all"
            )}
          />

          <nav className="h-full sidebar-nav">
            <ul
              className={clsx(
                "transition-all my-2 flex flex-col",
                sidebarToggled ? "pr-2!" : "items-center justify-center"
              )}
            >
              <NavbarLink
                title="Home"
                Icon={GoHome}
                url="/home"
                altLinks={["/home"]}
              />
              <NavbarLink
                title="Games"
                Icon={IoGameControllerOutline}
                url="/g"
                altLinks={["/play"]}
              />
              <NavbarLink
                title="Apps"
                Icon={BsGrid3X3GapFill}
                url="/a"
                altLinks={["/app", "/pete-ai"]}
              />
              <NavbarLink
                title="Proxy"
                Icon={SlGlobe}
                url="/static/prox/main"
              />
            </ul>

            <hr
              className={clsx(
                !sidebarToggled && "w-[80%] ml-[10%]!",
                sidebarToggled && "w-[90%] ml-[5%]!"
              )}
            />

            <ul
              className={clsx(
                "transition-all my-2 flex flex-col",
                sidebarToggled ? "pr-2!" : "items-center justify-center"
              )}
            >
              <NavbarLink
                title="Profile"
                Icon={FaRegUserCircle}
                url="/pages/settings/p"
              />
              <NavbarLink
                title="Settings"
                Icon={BsGear}
                url="/pages/settings"
              />
              <NavbarLink
                title="About"
                Icon={FaRegCircleQuestion}
                url="/about"
              />
            </ul>
          </nav>
        </aside>

        <main
          className={clsx(
            "main-content flex-1 h-screen overflow-y-scroll transition-transform border-white border-2",
            sidebarToggled ? "sidebar-expanded" : ""
          )}
        >
          {children}
        </main>
      </div>
    )
  );
}
