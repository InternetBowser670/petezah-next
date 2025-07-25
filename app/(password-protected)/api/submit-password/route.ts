import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyPassword } from "@/lib/password-store";

export async function POST(request: Request) {
  const formData = await request.formData();

  const submittedPassword = formData.get("password")?.toString();

  if (submittedPassword) {
    (await cookies()).set("app-password", submittedPassword, {
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  if (submittedPassword && (await verifyPassword(submittedPassword))) {
    return NextResponse.json({ success: true });
  }

  const url = new URL(request.url);
  url.pathname = "/";
  url.searchParams.set("reload", "1");
  return NextResponse.redirect(url);
}
