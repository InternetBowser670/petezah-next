import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/password-store";
import { updateSession } from "@/utils/supabase/middleware";

const PUBLIC_PATHS = [
  "/",
  "/globals.css",
  "/api/submit-password",
  "/ads.txt",
  "/favicon.ico",
  "/error",
];

const STARTSWITH_PATHS = ["/error"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always call updateSession first (keep Supabase session synced)
  const supabaseResponse = await updateSession(request);

  // If Supabase wants to do a redirect or returns non-200, respect that
  if (supabaseResponse.status !== 200) {
    return supabaseResponse;
  }

  // Bypass password check for public paths
  if (
    PUBLIC_PATHS.includes(pathname) ||
    STARTSWITH_PATHS.some((prefix) => pathname.startsWith(prefix))
  ) {
    return supabaseResponse;
  }

  // Check app-password cookie
  const cookiePassword = request.cookies.get("app-password")?.value;
  if (cookiePassword && (await verifyPassword(cookiePassword))) {
    return supabaseResponse;
  }

  // No valid password, redirect to homepage
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("reload", "1");

  // Make sure cookies stay in sync when returning redirect
  const redirectResponse = NextResponse.redirect(url);
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });
  return redirectResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|ads.txt).*)"],
};
