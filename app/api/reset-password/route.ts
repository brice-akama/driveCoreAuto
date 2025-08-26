import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const { email, token, newPassword } = await req.json();
    if (!email || !token || !newPassword) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("autodrive");

    const resetToken = await db.collection("passwordResetTokens").findOne({ token, used: false });
    if (!resetToken) return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    if (resetToken.expires < new Date()) return NextResponse.json({ message: "Token has expired" }, { status: 400 });

    const user = await db.collection("users").findOne({ _id: new ObjectId(resetToken.userId) });
    if (!user || user.email !== email) return NextResponse.json({ message: "Invalid token for this email" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.collection("users").updateOne(
      { _id: new ObjectId(user._id) },
      { $set: { password: hashedPassword } }
    );

    await db.collection("passwordResetTokens").updateOne(
      { _id: resetToken._id },
      { $set: { used: true } }
    );

    return NextResponse.json({ message: "Password successfully reset" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
