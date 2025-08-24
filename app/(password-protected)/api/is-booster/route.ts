import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
  const userId = body.user_id;

  if (!userId || typeof userId !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid user_id" },
      { status: 400 }
    );
  }

  const { data, error } = await createAdminClient()
    .from("profiles_private")
    .select("discord_id")
    .eq("id", userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const res = await fetch(
    `https://discord.com/api/v10/guilds/1337108365591187640/members/${data.discord_id}`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    }
  );

  const dcData = await res.json();

  const isBooster = dcData.roles?.includes("1341154772006211666");

  return NextResponse.json({ isBooster });
  } catch (error) {
    console.error("Error in /api/is-booster:", error);
  }
}
