import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createAdminClient();

  const rJSON = await req.json();

  let { anti_close_enabled } = rJSON;

  const { user_id } = rJSON;

  if (anti_close_enabled == "true" || anti_close_enabled == "false") {
    anti_close_enabled = anti_close_enabled === "true";
  }

  if (typeof anti_close_enabled !== "boolean" || typeof user_id !== "string") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles_private")
    .update({ anti_close_enabled })
    .eq("id", user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
