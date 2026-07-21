import { cookies } from "next/headers";
import { verifyAccessToken, ACCESS_COOKIE } from "@/lib/jwt";

export async function requireAdmin(): Promise<{ ok: true; email: string } | { ok: false }> {
  const store = await cookies();
  const access = store.get(ACCESS_COOKIE)?.value;
  const payload = access ? verifyAccessToken(access) : null;
  if (!payload) return { ok: false };
  return { ok: true, email: payload.sub };
}
