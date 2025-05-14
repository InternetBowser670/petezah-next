"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type SidebarContextType = {
  sidebarToggled: boolean;
  toggleSidebar: () => void;
  hydrated: boolean;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [sidebarToggled, setSidebarToggledState] = useState(true);
  const [hydrated, setHydrated] = useState(false); // ← NEW

  useEffect(() => {
    const storedToggle = localStorage.getItem("sidebarToggled");
    if (storedToggle !== null) {
      setSidebarToggledState(storedToggle === "true");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("sidebarToggled", String(sidebarToggled));
    }
  }, [sidebarToggled, hydrated]);

  const toggleSidebar = () => {
    setSidebarToggledState((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ sidebarToggled, toggleSidebar, hydrated }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within SidebarProvider!!!");
  return context;
};
