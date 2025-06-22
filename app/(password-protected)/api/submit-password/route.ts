import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const formData = await request.formData();
  
  const submittedPassword = formData.get("password")?.toString();

  if (submittedPassword) {
    (await cookies()).set("app-password", submittedPassword, {
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }
  return NextResponse.json({ success: true });
}
