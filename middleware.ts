import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/password-store";
import { updateSession } from "@/utils/supabase/middleware";

import dns from "dns/promises";

const PUBLIC_PATHS = [
  "/",
  "?reload=1",
  "/globals.css",
  "/api/submit-password",
  "/ads.txt",
  "/favicon.ico",
  "/error",
];

const STARTSWITH_PATHS = ["/error"];

async function isVerifiedGooglebot(request: NextRequest): Promise<boolean> {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip");

  if (!ip) {
    return false;
  }

  try {
    const hostnames = await dns.reverse(ip);
    const isGoogleHost = hostnames.some(
      (hostname) =>
        hostname.endsWith(".googlebot.com") || hostname.endsWith(".google.com")
    );

    if (!isGoogleHost) {
      return false;
    }

    for (const hostname of hostnames) {
      const addresses = await dns.lookup(hostname, { all: true });
      const verified = addresses.some((addr) => addr.address === ip);
      if (verified) return true;
    }

    return false;
  } catch (e) {
    console.error("Googlebot verification failed:", e);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookiePassword = request.cookies.get("app-password")?.value;

  const supabaseResponse = await updateSession(request);

  if (supabaseResponse.status !== 200) {
    return supabaseResponse;
  }

  if (
    PUBLIC_PATHS.includes(pathname) ||
    STARTSWITH_PATHS.some((prefix) => pathname.startsWith(prefix))
  ) {
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      if (cookiePassword && (await verifyPassword(cookiePassword))) {
        url.pathname = "/home";
        const redirectResponse = NextResponse.redirect(url);
        supabaseResponse.cookies.getAll().forEach((cookie) => {
          redirectResponse.cookies.set(cookie);
        });
        return redirectResponse;
      }
    }
    return supabaseResponse;
  }

  const userAgent = request.headers.get("user-agent")?.toLowerCase() ?? "";
  if (userAgent.includes("googlebot") && (await isVerifiedGooglebot(request))) {
    console.log("Allowing verified Googlebot access to", pathname);
    return supabaseResponse;
  }

  if (cookiePassword && (await verifyPassword(cookiePassword))) {
    return supabaseResponse;
  }

  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("reload", "1");

  const redirectResponse = NextResponse.redirect(url);
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });
  return redirectResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|ads.txt).*)"],
};
