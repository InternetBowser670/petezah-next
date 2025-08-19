"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  function handleClick() {
    router.push("https://petezahgames.com/");
  }
  return <><button onClick={handleClick}>Redirect</button></>;
}
