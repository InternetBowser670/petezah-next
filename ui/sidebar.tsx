"use client";

import Link from "next/link";
import clsx from "clsx";
import { useSidebar } from "@/context/sidebar-context";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

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
    icon,
  }: {
    title: string;
    url: string;
    icon: string;
  }) {
    function handleClick() {
      router.push(url);
    }

    return (
      <li
        onClick={handleClick}
        className={clsx(
          !sidebarToggled && "translate-x-[8px] items-center!",
          "max-w-[90%] h-[50px] flex items-center transition-all rounded-2xl disable-no-m-p hover:bg-white hover:text-black m-2!",
          isActiveTab(url, []) && "bg-white text-black"
        )}
      >
        <button
          type="button"
          className={clsx(
            "disable-no-m-p",
            !sidebarToggled &&
              "flex justify-center items-center h-full aspect-square!",
            sidebarToggled && "flex ml-2!"
          )}
        >
          <div className="box-content flex items-center justify-center h-full disable-no-m-p">
            <span className="nav-icon material-symbols-rounded">{icon}</span>
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
            "sidebar ml-2",
            sidebarToggled ? "sidebar-expanded w-[270px]" : "collapsed"
          )}
        >
          <header className="flex justify-between sidebar-header">
            <Link
              href="/"
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
              className="toggler w-[40px] absolute bg-white text-black flex justify-center items-center rounded-xl h-[40px] hover:bg-gray-300"
              type="button"
              onClick={toggleSidebar}
            >
              <span className="material-symbols-rounded">chevron_left</span>
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
                "transition-all my-2 nav-list primary-nav",
                sidebarToggled ? "pr-2!" : "pr-[19%]!"
              )}
            >
              <NavbarLink title="Home" icon="Home" url="/" />
              <NavbarLink title="Games" icon="sports_esports" url="/g" />
              <NavbarLink title="Apps" icon="apps" url="/a" />
              <NavbarLink
                title="Proxy"
                icon="globe_book"
                url="/static/prox/main"
              />
            </ul>

            <hr
              className={clsx(
                !sidebarToggled && "w-[80%] ml-[10%]!",
                sidebarToggled && "w-[90%] ml-[5%]!"
              )}
            />

            <ul className={clsx(
                "transition-all my-2 nav-list secondary-nav",
                sidebarToggled ? "pr-2!" : "pr-[19%]!"
              )}>
              <NavbarLink
                title="Profile"
                icon="account_circle"
                url="/pages/settings/p"
              />
              <NavbarLink
                title="Settings"
                icon="settings"
                url="/pages/settings"
              />
              <NavbarLink title="About" icon="help" url="/about" />
            </ul>
          </nav>
        </aside>

        <main
          className={clsx(
            "main-content flex-1 h-screen overflow-y-scroll transition-transform",
            sidebarToggled ? "sidebar-expanded" : ""
          )}
        >
          {children}
        </main>
      </div>
    )
  );
}
