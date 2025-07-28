import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import clientPromise from "../../../lib/mongodb";
import { z } from "zod";
import { serialize } from "cookie";
import sanitizeHtml from "sanitize-html";
import bcrypt from "bcryptjs";

// MongoDB setup
const client = await clientPromise;
const db = client.db("autodrive");
const adminCollection = db.collection("admins");
const attemptsCollection = db.collection("loginAttempts");

// .env variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!; // ✅ Still required
const SECRET_KEY = process.env.JWT_SECRET_KEY!;
const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 60 * 60 * 1000; // 1 hour

// Zod validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const cleanEmail = sanitizeHtml(email, { allowedTags: [], allowedAttributes: {} });

    loginSchema.parse({ email: cleanEmail, password });

    const userAttempts = await attemptsCollection.findOne({ email: cleanEmail });
    const now = Date.now();

    if (userAttempts) {
      const lastAttempt = new Date(userAttempts.lastAttempt).getTime();

      if (userAttempts.attempts >= MAX_ATTEMPTS && now - lastAttempt < BLOCK_TIME) {
        return NextResponse.json(
          { error: "Too many attempts. Please try again later." },
          { status: 429 }
        );
      }

      if (now - lastAttempt > BLOCK_TIME) {
        await attemptsCollection.updateOne({ email: cleanEmail }, { $set: { attempts: 0 } });
      }
    }

    // 🔐 Check if admin already exists in DB
    let admin = await adminCollection.findOne({ email: cleanEmail });

    // 🧠 If not, create the very first admin account if email matches
    if (!admin && cleanEmail === ADMIN_EMAIL) {
      const hashed = await bcrypt.hash(password, 10);
      await adminCollection.insertOne({
        email: cleanEmail,
        passwordHash: hashed,
        createdAt: new Date(),
      });
      console.log("✅ Initial admin created in DB.");
      admin = await adminCollection.findOne({ email: cleanEmail }); // re-fetch
    }

    if (!admin) {
      await logFailedAttempt(cleanEmail);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!passwordMatch) {
      await logFailedAttempt(cleanEmail);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ email: cleanEmail }, SECRET_KEY, { expiresIn: "1h" });

    await attemptsCollection.updateOne(
      { email: cleanEmail },
      { $set: { attempts: 0, lastAttempt: new Date() } },
      { upsert: true }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 60 * 60,
      path: "/",
    };

    const cookieHeader = serialize("auth_token", token, cookieOptions);
    const response = NextResponse.json({ message: "Login successful", token });
    response.headers.set("Set-Cookie", cookieHeader);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function logFailedAttempt(email: string) {
  const now = new Date();
  const existing = await attemptsCollection.findOne({ email });

  if (existing) {
    await attemptsCollection.updateOne(
      { email },
      { $set: { lastAttempt: now }, $inc: { attempts: 1 } }
    );
  } else {
    await attemptsCollection.insertOne({
      email,
      attempts: 1,
      lastAttempt: now,
    });
  }
}
