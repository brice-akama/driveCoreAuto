import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 1️⃣ Handle Language Cookie (no forcing, just preserve)
  const lang = req.cookies.get("lang")?.value || "en";
  res.cookies.set("lang", lang);

  // 2️⃣ Language handling removed - let multilingual setup work naturally

  // 3️⃣ Handle Admin Authentication
  const pathname = req.nextUrl.pathname;
  if (pathname.startsWith("/admin")) {
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
};