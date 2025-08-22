import { createAdminClient } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = createAdminClient();

  const { songs, user_id, remove } = await req.json();

  if (!user_id || typeof user_id !== "string") {
    return NextResponse.json({ error: "Invalid user_id" }, { status: 400 });
  }
  if (!Array.isArray(songs)) {
    return NextResponse.json({ error: "songs must be array" }, { status: 400 });
  }

  let result;
  if (remove) {
    const videoIds = songs.map((s) => s.videoId);
    result = await supabase.rpc("remove_starred_songs", {
      user_id,
      video_ids: videoIds,
    });
  } else {
    result = await supabase.rpc("upsert_starred_songs", {
      user_id,
      new_songs: songs,
    });
  }

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
