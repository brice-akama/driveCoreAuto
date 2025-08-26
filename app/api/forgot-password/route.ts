import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import clientPromise from "../../lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: "Email is required" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("autodrive");

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      // Always respond with success to prevent email enumeration
      return NextResponse.json({ message: "If this email exists, a reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiry

    // Save token in DB
    await db.collection("passwordResetTokens").insertOne({
      userId: user._id,
      token,
      expires,
      used: false,
    });

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Or your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}&email=${email}`;

    await transporter.sendMail({
      from: `"Your Company" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    return NextResponse.json({ message: "If this email exists, a reset link has been sent." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
