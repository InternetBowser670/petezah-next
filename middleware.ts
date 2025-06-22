import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyPassword } from "@/lib/password-store";

const PUBLIC_PATHS = [
  "/",
  "/globals.css",
  "/api/submit-password",
  "/ads.txt",
  "/favicon.ico",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookiePassword = request.cookies.get("app-password")?.value;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (cookiePassword && (await verifyPassword(cookiePassword))) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("reload", "1");
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|ads.txt).*)"],
};
