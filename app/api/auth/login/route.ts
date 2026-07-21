import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  verifyPassword,
  signAccessToken,
  signRefreshToken,
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  cookieOptions,
} from "@/lib/jwt";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  const adminEmail = (process.env.ADMIN_EMAIL ?? "esha@example.com").toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "";

  if (!email || !password || email !== adminEmail || !verifyPassword(password, hash)) {
    return NextResponse.json({ error: "Invalid credentials", len: hash.length, end: hash.slice(-4), cmp: verifyPassword(password, hash) }, { status: 401 });
  }

  const access = signAccessToken(adminEmail);
  const refresh = signRefreshToken(adminEmail);

  const store = await cookies();
  store.set(ACCESS_COOKIE, access, { ...cookieOptions(), maxAge: 60 * 15 });
  store.set(REFRESH_COOKIE, refresh, {
    ...cookieOptions(),
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json(
    { ok: true, user: { email: adminEmail } },
    { headers: { "Cache-Control": "no-store" } }
  );
}
