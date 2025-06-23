import { useEffect } from "react";

export default function GooglebotVerifier() {
  useEffect(() => {
    if (document.cookie.includes("isGooglebot=true")) return;

    fetch("/api/verify-googlebot")
      .then((res) => res.json())
      .then(({ verified }) => {
        if (verified) {
          console.log("Googlebot verified — cookie set");
        } else {
          console.log("Not a verified Googlebot");
        }
      })
      .catch((err) => {
        console.error("Failed to verify Googlebot", err);
      });
  }, []);

  return null;
}
