import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 1. Handle Language Cookie
  const lang = req.cookies.get("lang")?.value || "en";
  res.cookies.set("lang", lang);

  // 2. Handle Admin Authentication
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/secure-login", req.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY || "default_secret");
    } catch {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], 
  // Run middleware for all pages (but exclude static files & images)
};
