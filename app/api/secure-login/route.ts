import clientPromise from "../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import zxcvbn from "zxcvbn";
import sanitizeHtml from "sanitize-html";
import he from "he";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "your_secret_key";

let ipLoginAttempts: Record<string, { attempts: number; lastAttempt: number }> = {};
let userLoginAttempts: Record<string, { attempts: number; lastAttempt: number }> = {};

function sanitizeInput(input: string): string {
  const decoded = he.decode(input);
  const cleaned = sanitizeHtml(decoded, { allowedTags: [], allowedAttributes: {} });
  return cleaned.replace(/[<>\/\\$'"`]/g, "").trim();
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isStrongPassword(password: string): boolean {
  const result = zxcvbn(password);
  return result.score >= 3;
}

// IP-based logging
function logFailedLogin(ip: string) {
  if (!ipLoginAttempts[ip]) {
    ipLoginAttempts[ip] = { attempts: 1, lastAttempt: Date.now() };
  } else {
    ipLoginAttempts[ip].attempts += 1;
    ipLoginAttempts[ip].lastAttempt = Date.now();
  }
}

function hasExceededRateLimit(ip: string): boolean {
  const MAX_ATTEMPTS = 5;
  const WINDOW_MS = 10 * 60 * 1000;
  if (ipLoginAttempts[ip]) {
    const { attempts, lastAttempt } = ipLoginAttempts[ip];
    if (attempts >= MAX_ATTEMPTS && Date.now() - lastAttempt < WINDOW_MS) {
      return true;
    }
  }
  return false;
}

// Email-based brute-force logging
function logFailedUserLogin(email: string) {
  if (!userLoginAttempts[email]) {
    userLoginAttempts[email] = { attempts: 1, lastAttempt: Date.now() };
  } else {
    userLoginAttempts[email].attempts += 1;
    userLoginAttempts[email].lastAttempt = Date.now();
  }
}

function hasUserExceededRateLimit(email: string): boolean {
  const MAX_ATTEMPTS = 5;
  const WINDOW_MS = 10 * 60 * 1000;
  if (userLoginAttempts[email]) {
    const { attempts, lastAttempt } = userLoginAttempts[email];
    if (attempts >= MAX_ATTEMPTS && Date.now() - lastAttempt < WINDOW_MS) {
      return true;
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    console.log(`Login attempt from IP: ${ip}`);

    if (hasExceededRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many login attempts from this IP. Try again later." },
        { status: 429 }
      );
    }

    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 415 });
    }

    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase());
    const sanitizedPassword = sanitizeInput(password);

    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    if (hasUserExceededRateLimit(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Too many failed login attempts for this account. Try again later." },
        { status: 429 }
      );
    }

    if (!isStrongPassword(sanitizedPassword)) {
      return NextResponse.json(
        { error: "Password must be strong (score ≥ 3)." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
     const db = client.db("autodrive");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email: sanitizedEmail });
    if (!user) {
      logFailedLogin(ip);
      logFailedUserLogin(sanitizedEmail);
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(sanitizedPassword, user.password);
    if (!isPasswordValid) {
      logFailedLogin(ip);
      logFailedUserLogin(sanitizedEmail);
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Clear attempts on successful login
    if (userLoginAttempts[sanitizedEmail]) {
      delete userLoginAttempts[sanitizedEmail];
    }
    if (ipLoginAttempts[ip]) {
      delete ipLoginAttempts[ip];
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json({ message: "Login successful", token }, { status: 200 });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 3600,
    });

    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Content-Security-Policy", "default-src 'self'");

    return response;
  } catch (error) {
    console.error("Error handling login:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}