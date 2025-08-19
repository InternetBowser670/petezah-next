"use client";
import { useEffect, useState } from "react";

export function Cloak({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  if (!show) return null;

  return <div aria-hidden="true">{children}</div>;
}
