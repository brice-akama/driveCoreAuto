import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // 1️⃣ Handle Language Cookie
  const lang = req.cookies.get("lang")?.value || "en";
  res.cookies.set("lang", lang);

  // 2️⃣ Force English for all users (disable other languages)
  const languages = ["en", "fr", "de", "es"];
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Path-based language e.g., /fr/warranty -> /en/warranty
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  if (languages.includes(firstSegment) && firstSegment !== "en") {
    segments[0] = "en"; // force English
    url.pathname = "/" + segments.join("/");
    return NextResponse.redirect(url);
  }

  // Query-based language e.g., ?lang=fr -> ?lang=en
  const langParam = url.searchParams.get("lang");
  if (langParam && langParam !== "en" && languages.includes(langParam)) {
    url.searchParams.set("lang", "en");
    return NextResponse.redirect(url);
  }

  // 3️⃣ Handle Admin Authentication
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
