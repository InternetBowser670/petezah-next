"use client";

import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";

export default function LatestPasswordStatus({ className }: { className?: string }) {
  const cookies = useCookies();
  const [passwords, setPasswords] = useState<Record<string, string> | null>(null);
  const [expirationString, setExpirationString] = useState("");
  const [latestMonth, setLatestMonth] = useState<string | null>(null);
  const [latestPassword, setLatestPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchPasswords() {
    const res = await fetch("/api/get-passwords");
    const data = await res.json();
    setPasswords(data.passwords);

    const sortedMonths = Object.keys(data.passwords).sort().reverse();
    const latest = sortedMonths[0];
    setLatestMonth(latest);
    setLatestPassword(data.passwords[latest]);
    setLoading(false);
  }

  async function enableLatestPassword() {
    if (!latestPassword) return;

    const formData = new FormData();
    formData.append("password", latestPassword);
    await fetch("/api/submit-password", {
      method: "POST",
      body: formData,
    });
    await new Promise((res) => setTimeout(res, 100));
  }

  useEffect(() => {
    fetchPasswords();
  }, []);

  useEffect(() => {
    if (!latestMonth) return;

    function updateCountdown() {
      const [yearStr, monthStr] = (latestMonth || "").split("-");
      const year = parseInt(yearStr);
      const monthNum = parseInt(monthStr);
      const nextMonthStart = new Date(Date.UTC(year, monthNum, 1));
      const diffMs = nextMonthStart.getTime() - Date.now();

      if (diffMs > 0) {
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
        const seconds = Math.floor((diffMs / 1000) % 60);
        setExpirationString(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setExpirationString("Expired");
      }
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [latestMonth]);

  if (loading || !passwords || !latestPassword || !latestMonth) {
    return <div className={`text-white ${className}`}>Loading...</div>;
  }

  const cookiePassword = cookies.get("app-password");

  return (
    <div className={`mb-4! ${className}`}>
      {cookiePassword === latestPassword ? (
        <span className="text-green-500">You are on the latest password!</span>
      ) : (
        <>
          <span className="text-yellow-400">You are not on the latest password. </span>
          <button onClick={enableLatestPassword} className="px-2! my-2! ml-4! bg-green-500 rounded-lg">
            Switch to Latest
          </button>
        </>
      )}
      <div className="mt-2 font-mono text-sm text-white tabular-nums">
        Time until expiration: {expirationString}
      </div>
    </div>
  );
}
