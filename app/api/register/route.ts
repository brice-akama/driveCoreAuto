import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import bcrypt from "bcrypt";
import zxcvbn from "zxcvbn";
import nodemailer from "nodemailer";
import { ObjectId } from "mongodb";

// Helper function to get the users collection
async function getUsersCollection() {
  const client = await clientPromise;
  const db = client.db("autodrive");
  return db.collection("users");
}

// Sanitize input
function sanitizeInput(input: string): string {
  return input.replace(/[<>\/\\$'"`]/g, "").trim();
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
function isStrongPassword(password: string): boolean {
  const result = zxcvbn(password);
  return result.score >= 3;
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 Register API called");

    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 415 });
    }

    const body = await request.json();
    let { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Sanitize inputs
    email = sanitizeInput(email.toLowerCase());
    password = sanitizeInput(password);

    // Validate inputs
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long and strong." },
        { status: 400 }
      );
    }

    const usersCollection = await getUsersCollection();
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // ✅ Send notification email to company
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"DriveCore Auto" <${process.env.EMAIL_USER}>`,
        to: "support@drivecoreauto.com",
        subject: "New User Registration",
        html: `
          <h3>New User Registered on DriveCore Auto</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Registered At:</strong> ${new Date().toLocaleString()}</p>
        `,
      });

      console.log("✅ Registration notification email sent");
    } catch (emailError) {
      console.error("❌ Failed to send registration email:", emailError);
    }

    return NextResponse.json(
      { message: "Registration successful", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
