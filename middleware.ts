// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getPassword } from "@/lib/password-store";

const PUBLIC_PATHS = ["/", "/globals.css", "submit-password", "/ads.txt"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const password = getPassword();

  const cookiePassword = request.cookies.get("app-password")?.value;

  if (cookiePassword === password && pathname == "/") {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  if (cookiePassword === password) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("error", "invalid_password");
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|images|favicon.ico|excluded-route).*)',
  ],
};