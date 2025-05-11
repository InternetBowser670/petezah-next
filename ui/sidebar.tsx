"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  
  const sidebarToggledParam = searchParams.get("sidebarToggled");
  const [sidebarToggled, setSidebarToggled] = useState(sidebarToggledParam !== null ? decodeURIComponent(sidebarToggledParam) === "true" : true);
  const [mounted, setMounted] = useState(false);
  const [sidebarTab, setSidebarTab] = useState(decodeURIComponent(searchParams.get("tab") || "/"));

  const router = useRouter();


  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSidebar = () => {
    const newValue = !sidebarToggled;
    const params = new URLSearchParams(window.location.search);
    params.set('sidebarToggled', String(newValue));
    setSidebarToggled(!sidebarToggled);
    window.history.replaceState(null, '', `?${params.toString()}`);
    setSidebarToggled(newValue);
  };


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
      const params = new URLSearchParams(window.location.search);
      params.set('tab', encodeURIComponent(url));
      setSidebarTab(url);
      router.push(`${url}?${params.toString()}`);
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
          (sidebarTab === url) && "bg-white text-black"
          )}
        >
          <button
            type="button"
            onClick={handleClick}
            className={clsx(
              "disable-no-m-p",
              !sidebarToggled && "flex justify-center aspect-square!",
              sidebarToggled && "flex ml-2!"
            )}
          >
            <div className={clsx("flex items-center justify-center disable-no-m-p box-content",)}>
              <span className="nav-icon material-symbols-rounded">{icon}</span>
              {sidebarToggled && <span className="nav-label disable-no-m-p">{title}</span>}
            </div>
          </button>
        </li>
      </>
    );
  }

  return mounted ? (
    <>
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

        <hr className={clsx(!sidebarToggled && "w-[80%] ml-[10%]!", sidebarToggled && "w-[90%] ml-[5%]!")} />

        <nav className="mt-0 sidebar-nav ">
          <ul className={clsx("my-2 nav-list primary-nav", !sidebarToggled && "flex flex-col items-center")}>
            <NavbarLink title="Home" icon="Home" url="/" />
            <NavbarLink title="Games" icon="sports_esports" url="/g" />
            <NavbarLink title="Apps" icon="apps" url="/a" />
            <NavbarLink
              title="Proxy"
              icon="globe_book"
              url="/static/prox/main"
            />
          </ul>
          
          <hr className={clsx(!sidebarToggled && "w-[80%] ml-[10%]!", sidebarToggled && "w-[90%] ml-[5%]!")} />

          <ul className={clsx("my-2 nav-list secondary-nav", !sidebarToggled && "flex flex-col items-center")}>
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
    </>
  ) : (
    <></>
  );
}
