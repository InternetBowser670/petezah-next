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

  function PasswordTd({ pwd, month }: { month: string; pwd: string }) {
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

    return (
      <td className="px-4! py-2! border border-white">
        <div>
          {isCurrentMonth ? (
            <span className="text-green-500">Current Month</span>
          ) : isNextMonth ? (
            <span className="text-blue-500">Next Month</span>
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
    );
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
              </tr>
            </thead>
            <tbody>
              {Object.entries(passwords.passwords).map(([month, pwd]) => (
                <tr
                  key={month}
                  className="even:bg-[#2c3b5a] border border-white"
                >
                  <td className="px-4! py-2! border border-white">{month}</td>
                  <td className="px-4! py-2! border border-white">{pwd}</td>
                  <PasswordTd month={month} pwd={pwd} />
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading passwords...</p>
        )}
      </div>
    </div>
  );
}
