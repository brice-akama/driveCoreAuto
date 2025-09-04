
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import clientPromise from "../../lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );

    const client = await clientPromise;
    const db = client.db("autodrive");

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      // Always respond with success to prevent email enumeration
      return NextResponse.json({
        message: "If this email exists, a reset link has been sent.",
      });
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

    // ✅ Use SMTP config (works with professional email)
    // ✅ Use SMTP config (works with Zoho professional email)
    const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,            // Hardcoded SSL port
      secure: true,            // 465 requires SSL
      auth: {
        user: process.env.EMAIL_USER, // from .env
        pass: process.env.EMAIL_PASS, // from .env
      },
    });


    const resetUrl = `${process.env.NEXT_PUBLIC_API_URL}/reset-password?token=${token}&email=${email}`;

    await transporter.sendMail({
      from: `"DriveCore Auto" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    return NextResponse.json({
      message: "If this email exists in our system, you’ll receive a password reset link from DriveCore Auto shortly.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
