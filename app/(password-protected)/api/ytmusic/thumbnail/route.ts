import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return new NextResponse("Missing url param", { status: 400 });
  }

  try {
    const resp = await fetch(url); // server-side fetch (no CORS issues)
    if (!resp.ok) {
      return new NextResponse("Failed to fetch thumbnail", {
        status: resp.status,
      });
    }

    const contentType = resp.headers.get("content-type") ?? "image/jpeg";
    const buffer = await resp.arrayBuffer();

    return new NextResponse(buffer, {
      headers: { "Content-Type": contentType },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return new NextResponse(`Error fetching thumbnail: ${err}`, {
      status: 500,
    });
  }
}
