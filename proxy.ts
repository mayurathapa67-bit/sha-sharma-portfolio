import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, ACCESS_COOKIE } from "@/lib/jwt";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const access = req.cookies.get(ACCESS_COOKIE)?.value;
  const valid = access ? verifyAccessToken(access) : null;

  if (valid) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}
