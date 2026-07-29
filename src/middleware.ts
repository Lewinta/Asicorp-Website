import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session-options";
import type { PortalSession } from "@/lib/portal-types";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession<Partial<PortalSession>>(req, res, sessionOptions);
  const isAuth = Boolean(session.cedente && session.email);
  const path = req.nextUrl.pathname;
  const isLogin = path === "/portal/login";

  if (!isAuth && path.startsWith("/portal") && !isLogin) {
    return NextResponse.redirect(new URL("/portal/login", req.url));
  }
  if (isAuth && isLogin) {
    return NextResponse.redirect(new URL("/portal", req.url));
  }
  return res;
}

export const config = { matcher: ["/portal/:path*"] };
