import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken, ACCESS_COOKIE } from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await cookies();
  const access = store.get(ACCESS_COOKIE)?.value;
  const payload = access ? verifyAccessToken(access) : null;
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(
    { ok: true, user: { email: payload.sub } },
    { headers: { "Cache-Control": "no-store" } }
  );
}
