import { NextResponse } from "next/server";
import dns from "dns/promises";

async function isGooglebotIP(ip: string): Promise<boolean> {
  try {
    const hostnames = await dns.reverse(ip);

    const isGooglebot = hostnames.some((hostname) =>
      hostname.endsWith(".googlebot.com") || hostname.endsWith(".google.com")
    );
    if (!isGooglebot) return false;

    for (const hostname of hostnames) {
      const ips = await dns.lookup(hostname, { all: true });
      if (ips.some((addr) => addr.address === ip)) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "";

  if (!ip) {
    return NextResponse.json({ verified: false }, { status: 400 });
  }

  const verified = await isGooglebotIP(ip);

  const response = NextResponse.json({ verified });

  if (verified) {
    response.headers.append(
      "Set-Cookie",
      `isGooglebot=true; Path=/; HttpOnly; Max-Age=${60 * 60 * 24}`
    );
  }

  return response;
}
