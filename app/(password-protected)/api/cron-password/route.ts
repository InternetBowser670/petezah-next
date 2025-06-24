import { NextResponse } from "next/server";
import { generateNextMonthPasswordIfEligible } from "@/lib/password-store";

export async function GET() {
  await generateNextMonthPasswordIfEligible();
  return NextResponse.json({ ok: true });
}
