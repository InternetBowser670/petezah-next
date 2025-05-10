"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  const [sidebarToggled, setSidebarToggled] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [sidebarTab, setSidebarTab] = useState(
    decodeURIComponent(searchParams.get("tab") || "/")
  );

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  function toggleSidebar() {
    setSidebarToggled(!sidebarToggled);
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
      setSidebarTab(url);
      router.push(`${url}?tab=${encodeURIComponent(url)}`);
    }

    return (
      <>
        <li
          onClick={handleClick}
          className={clsx(
            !sidebarToggled && "aspect-square w-[10%]",
            "max-w-[90%] h-[40px] flex items-center py-6! rounded-2xl disable-no-m-p pl-8 hover:bg-white hover:text-black m-2!",
            !sidebarToggled &&
              "justify-center content-center items-center w-[60%] aspect-square",
            sidebarTab === url && "bg-white text-black"
          )}
        >
          <button
            type="button"
            onClick={handleClick}
            className={clsx(
              "w-full h-full my-6! disable-no-m-p",
              !sidebarToggled && "flex justify-center",
              sidebarToggled && "flex"
            )}
          >
            <div
              className={clsx(
                "flex items-center disable-no-m-p box-content ml-8"
              )}
            >
              <span className="ml-2! nav-icon material-symbols-rounded">
                {icon}
              </span>
              {sidebarToggled && (
                <span className="ml-2! nav-label disable-no-m-p">{title}</span>
              )}
            </div>
          </button>
        </li>
      </>
    );
  }

  return mounted ? (
    <>
      <Suspense>
        <aside
          className={clsx(
            "sidebar ml-2",
            sidebarToggled ? "sidebar-expanded w-[270px]" : "collapsed"
          )}
        >
          <header
            className={clsx(
              "sidebar-header",
              sidebarToggled ? "flex justify-between items-center" : ""
            )}
          >
            <Link
              href="/"
              className="header-logo w-[46px] h-[46px] flex justify-center items-center"
            >
              <img
                src="/logo-png-removebg-preview.png"
                height={40}
                width={40}
                alt="PeteZah"
              />
            </Link>
            {!sidebarToggled && <br />}
            {sidebarToggled ? (
              <>
                <button
                  className="toggler sidebar-toggler w-[40px] bg-white text-black flex justify-center items-center rounded-xl h-[40px] hover:bg-gray-300"
                  type="button"
                  onClick={toggleSidebar}
                >
                  <span className="material-symbols-rounded">chevron_left</span>
                </button>
              </>
            ) : (
              <>
                <button
                  className="toggler menu-toggler w-[40px] bg-white text-black flex justify-center items-center rounded-xl h-[40px] hover:bg-gray-300"
                  type="button"
                  onClick={toggleSidebar}
                >
                  <p className="material-symbols-rounded">menu</p>
                </button>
              </>
            )}
          </header>

          <hr />

          <nav className="mt-0 sidebar-nav ">
            <ul className="pl-2! my-2 nav-list primary-nav">
              <NavbarLink title="Home" icon="Home" url="/" />
              <NavbarLink title="Games" icon="sports_esports" url="/g" />
              <NavbarLink title="Apps" icon="apps" url="/a" />
              <NavbarLink
                title="Proxy"
                icon="globe_book"
                url="/static/prox/main"
              />
            </ul>

            <hr />

            <ul className="nav-list secondary-nav">
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
            </ul>
          </nav>
        </aside>

        <main
          className={clsx(
            "main-content",
            sidebarToggled ? "sidebar-expanded" : ""
          )}
        >
          {children}
        </main>
      </Suspense>
    </>
  ) : (
    <></>
  );
}
