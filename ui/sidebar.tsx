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
            !sidebarToggled && "aspect-square w-[50px]!",
            "max-w-[90%] h-[50px] flex rounded-2xl disable-no-m-p hover:bg-white hover:text-black m-2!",
            !sidebarToggled &&
              "w-[60%] aspect-square translate-x-[8px] transition-transform",
          (sidebarTab === url) && "bg-white text-black"
          )}
        >
          <button
            type="button"
            onClick={handleClick}
            className={clsx(
              "disable-no-m-p",
              !sidebarToggled && "flex justify-center h-full aspect-square! ",
              sidebarToggled && "flex ml-2!"
            )}
          >
            <div className={clsx("flex items-center justify-center disable-no-m-p box-content",)}>
              <span className="nav-icon material-symbols-rounded">{icon}</span>
               <span className={clsx("nav-label disable-no-m-p ml-2!", !sidebarToggled && "opacity-0 hidden", sidebarToggled && "opacity-100 ")}>{title}</span>
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
            "sidebar-header flex justify-between"
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
          <div className={clsx("spacer mt-20px!", { nospacer: sidebarToggled })}></div>
          <button
                className="toggler w-[40px] absolute bg-white text-black flex justify-center items-center rounded-xl h-[40px] hover:bg-gray-300"
                type="button"
                onClick={toggleSidebar}
              >
                <span className="material-symbols-rounded">chevron_left</span>
              </button>
        </header>

        <div className={clsx("spacer spacer-margin-top", { nospacer: sidebarToggled })}></div>

        <hr className={clsx(!sidebarToggled && "w-[80%] ml-[10%]!", sidebarToggled && "w-[90%] ml-[5%]!", "transition-all")} />

        <nav className="mt-0 sidebar-nav ">
          <ul className={clsx("my-2 nav-list primary-nav")}>
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

          <ul className={clsx("my-2 nav-list secondary-nav")}>
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
