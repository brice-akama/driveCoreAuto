import clientPromise from "../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import zxcvbn from "zxcvbn"; // Import zxcvbn for password strength evaluation

// Helper function to get the users collection from the database
async function getUsersCollection() {
  const client = await clientPromise;
  const db = client.db("autodrive");// Replace with your DB name
  return db.collection("users");
}

// Helper to sanitize input
function sanitizeInput(input: string): string {
  return input.replace(/[<>\/\\$'"`]/g, "").trim();
}

// Validate email using regex
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength using zxcvbn
function isStrongPassword(password: string): boolean {
  const result = zxcvbn(password);
  return result.score >= 3; // Score ranges from 0 to 4, where 3 is considered strong
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔐 Register API called");

    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 415 }
      );
    }

    const body = await request.json();
    let { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
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
        { error: "Password must be at least 8 characters long" },
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

// ✅ GET: Fetch all users
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("autodrive"); // Replace with your DB name
    const usersCollection = db.collection("users");

    console.log("Fetching all users...");

    const users = await usersCollection.find().toArray();
    const formattedUsers = users.map((user) => ({
      ...user,
      id: user._id.toString(), // Convert _id to string
    }));

    console.log("Fetched users:", formattedUsers);

    return NextResponse.json(
      { data: formattedUsers, total: formattedUsers.length }, // ✅ Matches required format
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// ✅ DELETE: Delete user by ID (supports `DELETE /api/register?id=registerId`)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("autodrive");
    const usersCollection = db.collection("users");

    // ✅ Ensure correct ObjectId conversion
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}