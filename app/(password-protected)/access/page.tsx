"use client";

import MarqueeBg from "@/ui/backgrounds/marquee-bg";
import { useState, useEffect, useReducer } from "react";
import { useCookies } from "next-client-cookies";

export default function Page() {
  const [passwords, setPasswords] = useState<Record<string, string> | null>(
    null
  );
  const cookies = useCookies();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  async function setData() {
    const data = await (await fetch("/api/get-passwords")).json();
    setPasswords(data);
  }

  useEffect(() => {
    setData();
  }, []);

  async function enableLatestPassword() {
    if (!passwords) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const latestMonth: any = Object.keys(passwords.passwords).sort().reverse()[0];
    const latestPassword = passwords.passwords[latestMonth];
    const formData = new FormData();
    formData.append("password", latestPassword);
    await fetch("/api/submit-password", {
      method: "POST",
      body: formData,
    });
    await new Promise((res) => setTimeout(res, 100));
    forceUpdate();
  }

  return (
    <div className="flex items-center relative justify-center h-[100%]">
      <MarqueeBg />
      <div className="max-w-[80%] p-[50px]! rounded-[12px] border-2 border-[#0096FF] backdrop-blur-md backdrop-filter backdrop-opacity-50 bg-[#0A1D37]">
        <h1 className="text-3xl text-center">Manage Your Passwords</h1>
        <br />
        <h2 className="text-gray-300">
          Passwords rotate every month, so make sure to switch as soon as next
          month&apos;s comes out (two weeks before the start of the month).
        </h2>
        <br />
        {passwords ? (
          <>
            <div className="mb-4! text-center">
              {(() => {
                const cookiePassword = cookies.get("app-password");
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const latestMonth: any = Object.keys(passwords.passwords)
                  .sort()
                  .reverse()[0];
                const latestPassword = passwords.passwords[latestMonth];
                if (cookiePassword === latestPassword) {
                  return (
                    <span className="text-green-500">
                      You are on the latest password!
                    </span>
                  );
                } else {
                  return (
                    <>
                      <span className="text-yellow-400">
                        You are not on the latest password.{" "}
                      </span>
                      <button
                        onClick={enableLatestPassword}
                        className="px-1! ml-4! bg-green-500 rounded-lg"
                      >
                        Switch to Latest
                      </button>
                    </>
                  );
                }
              })()}
            </div>

            <table className="w-full my-4 border border-collapse border-white">
              <thead className="bg-[#1f2b47] text-white">
                <tr className="even:bg-[#2c3b5a] border border-white">
                  <th className="px-4! py-2! font-semibold text-left border border-white">
                    Month
                  </th>
                  <th className="px-4! py-2! font-semibold text-left border border-white">
                    Password
                  </th>
                  <th className="px-4! py-2! font-semibold text-left border border-white">
                    Enable
                  </th>
                  <th className="px-4! py-2! font-semibold text-left border border-white">
                    Time Until Expiration
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(passwords.passwords).map(
                  ([month, pwd], index) => (
                    <PasswordRow
                      key={index}
                      month={month}
                      pwd={pwd}
                      forceUpdate={forceUpdate}
                    />
                  )
                )}
              </tbody>
            </table>
          </>
        ) : (
          <p>Loading passwords...</p>
        )}
      </div>
    </div>
  );

  function PasswordRow({
    pwd,
    month,
    forceUpdate,
  }: {
    month: string;
    pwd: string;
    forceUpdate: () => void;
  }) {
    async function enablePassword(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const formData = new FormData();
      formData.append("password", pwd);
      await fetch("/api/submit-password", {
        method: "POST",
        body: formData,
      });
      await new Promise((res) => setTimeout(res, 100));
      forceUpdate();
    }

    const cookiePassword = cookies.get("app-password");

    const now = new Date();
    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth() + 1;

    const [yearStr, monthStr] = month.split("-");
    const year = parseInt(yearStr);
    const monthNum = parseInt(monthStr);

    const isCurrentMonth = year === currentYear && monthNum === currentMonth;
    const isNextMonth =
      (year === currentYear && monthNum === currentMonth + 1) ||
      (year === currentYear + 1 && currentMonth === 12 && monthNum === 1);

    const [expirationString, setExpirationString] = useState("");

    useEffect(() => {
      if (isCurrentMonth || isNextMonth) {
        function updateCountdown() {
          const nextMonthStart = new Date(Date.UTC(year, monthNum, 1));
          const diffMs = nextMonthStart.getTime() - new Date().getTime();
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
      } else {
        setExpirationString("-");
      }
    }, [isCurrentMonth, isNextMonth, year, monthNum]);

    return (
      <tr className="even:bg-[#2c3b5a] border border-white">
        <td className="px-4! py-2! border border-white">{month}</td>
        <td className="px-4! py-2! border border-white">{pwd}</td>
        <td className="px-4! py-2! border border-white">
          <div>
            {isCurrentMonth ? (
              <span className="text-blue-500">Current Month</span>
            ) : isNextMonth ? (
              <span className="text-green-500">Next Month</span>
            ) : (
              <span className="text-gray-400">Expired</span>
            )}
          </div>
          {cookiePassword === pwd ? (
            <div>Enabled</div>
          ) : (
            <form onSubmit={enablePassword}>
              <button className="bg-green-500 rounded-2xl px-2!">Enable</button>
            </form>
          )}
        </td>
        <td className="px-4! py-2! border border-white font-mono tabular-nums">
          {expirationString}
        </td>
      </tr>
    );
  }
}
