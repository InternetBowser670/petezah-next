import { NextRequest, NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

const ytmusic = new YTMusic();

let initialized = false;
async function ensureInitialized() {
  if (!initialized) {
    await ytmusic.initialize();
    initialized = true;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Missing query param 'q'" },
      { status: 400 }
    );
  }

  try {
    await ensureInitialized();
    const results = await ytmusic.searchSongs(query);
    return NextResponse.json(results);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("YTMusic error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
