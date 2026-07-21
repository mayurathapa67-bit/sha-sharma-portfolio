import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyRefreshToken,
  signAccessToken,
  signRefreshToken,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieOptions,
} from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function POST() {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    store.delete(REFRESH_COOKIE);
    store.delete(ACCESS_COOKIE);
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }

  const email = payload.sub;
  const newAccess = signAccessToken(email);
  const newRefresh = signRefreshToken(email);

  store.set(ACCESS_COOKIE, newAccess, { ...cookieOptions(), maxAge: 60 * 15 });
  store.set(REFRESH_COOKIE, newRefresh, {
    ...cookieOptions(),
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json(
    { ok: true, user: { email } },
    { headers: { "Cache-Control": "no-store" } }
  );
}
