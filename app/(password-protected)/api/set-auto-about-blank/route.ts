import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createAdminClient();

  const rJSON = await req.json();

  let { autoAboutBlank } = rJSON;

  const { user_id } = rJSON;

  if (autoAboutBlank == "true" || autoAboutBlank == "false") {
    autoAboutBlank = autoAboutBlank === "true";
  }

  if (typeof autoAboutBlank !== "boolean" || typeof user_id !== "string") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles_private")
    .update({ auto_about_blank: autoAboutBlank })
    .eq("id", user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
