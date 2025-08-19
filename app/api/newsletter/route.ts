import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import nodemailer from "nodemailer"; // ✅ Add this to send email

// In-memory rate limit
const ipRequests: Record<string, { attempts: number; lastRequestTime: number }> = {};

function sanitizeInput(input: string): string {
  return input.replace(/[<>\/\\$'"`{};]/g, "").trim();
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function checkRateLimit(ip: string): boolean {
  const MAX_ATTEMPTS = 5;
  const WINDOW_MS = 10 * 60 * 1000;
  const now = Date.now();
  const entry = ipRequests[ip];

  if (!entry) {
    ipRequests[ip] = { attempts: 1, lastRequestTime: now };
    return true;
  }

  if (now - entry.lastRequestTime < WINDOW_MS) {
    if (entry.attempts >= MAX_ATTEMPTS) return false;
    ipRequests[ip].attempts += 1;
  } else {
    ipRequests[ip] = { attempts: 1, lastRequestTime: now };
  }

  return true;
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      (req as any).socket?.remoteAddress ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const rawEmail = body.email;

    if (!rawEmail || typeof rawEmail !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const sanitizedEmail = sanitizeInput(rawEmail);

    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const client = await clientPromise;
   const db = client.db("autodrive");
    const collection = db.collection("newsletters");

    const existing = await collection.findOne({ email: sanitizedEmail });
    if (existing) {
      return NextResponse.json({ message: "This email is already subscribed" }, { status: 409 });
    }

    await collection.insertOne({
      email: sanitizedEmail,
      subscribedAt: new Date(),
    });

    // ✅ Send email to the company
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    await transporter.sendMail({
      from: `"16Zip Newsletter" <${process.env.EMAIL_USER}>`,
      to: "info@16zip.com",
      subject: "New Newsletter Subscription",
      html: `
        <h3>New Subscriber</h3>
        <p>A new user has subscribed to the 16Zip newsletter.</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><small>Time: ${new Date().toLocaleString()}</small></p>
      `,
    });

    return NextResponse.json(
      { message: "Successfully subscribed to the newsletter" },
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Content-Security-Policy": "default-src 'none';",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
        },
      }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}