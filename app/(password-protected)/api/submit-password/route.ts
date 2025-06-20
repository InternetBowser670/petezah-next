import { cookies } from "next/headers";
import { getPassword } from "@/lib/password-store";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const inputPassword = formData.get("password") as string;
  const validPassword = getPassword();

  (await cookies()).set("app-password", inputPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  if (inputPassword === validPassword) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
