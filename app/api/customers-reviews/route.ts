// File: /app/api/customers-reviews/route.ts
// File: /app/api/customers-reviews/route.ts
import clientPromise from '../../lib/mongodb';
import { NextRequest, NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";

// Define Review type
export type Review = {
  product: string;
  rating: number;
  text: string;
  author: string;
  location?: string;
  createdAt: Date;
};

// Helper to sanitize strings
const sanitizeInput = (input: string) =>
  sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} }).trim();

// Helper to validate numbers
const validateNumber = (num: any, min = 1, max = 5) => {
  const value = Number(num);
  return !isNaN(value) && value >= min && value <= max ? value : null;
};

// Basic admin check placeholder
const checkAdmin = (isAdmin: boolean) => {
  if (!isAdmin) throw new Error("Unauthorized");
};

// GET: Fetch all reviews
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("autodrive");
    const reviews = await db
      .collection<Review>("review")
      .find({})
      .sort({ createdAt: -1 }) // latest first
      .toArray();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST: Submit a new review
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Sanitize string inputs
    const product = sanitizeInput(data.product || "");
    const text = sanitizeInput(data.text || "");
    const author = sanitizeInput(data.author || "");
    const location = sanitizeInput(data.location || "");

    // Validate rating
    const rating = validateNumber(data.rating);
    if (!product || !text || !author || rating === null) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }

    const newReview: Review = {
      product,
      rating,
      text,
      author,
      location: location || "",
      createdAt: new Date(),
    };

    const client = await clientPromise;
    const db = client.db("autodrive");

    await db.collection("review").insertOne(newReview);

    return NextResponse.json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

// DELETE: Delete review by ID (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { isAdmin } = body;

    try { checkAdmin(isAdmin); } catch { return NextResponse.json({ message: "Unauthorized" }, { status: 401 }); }

    const client = await clientPromise;
    const db = client.db("autodrive");

    const result = await db.collection("review").deleteOne({ _id: new (require('mongodb').ObjectId)(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT: Update review (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { isAdmin, text, rating, location, author, product } = body;

    try { checkAdmin(isAdmin); } catch { return NextResponse.json({ message: "Unauthorized" }, { status: 401 }); }

    // Sanitize string inputs
    const textSanitized = sanitizeInput(text || "");
    const authorSanitized = sanitizeInput(author || "");
    const productSanitized = sanitizeInput(product || "");
    const locationSanitized = sanitizeInput(location || "");

    const ratingNum = validateNumber(rating);
    if (!textSanitized || !authorSanitized || !productSanitized || ratingNum === null) {
      return NextResponse.json({ message: "Missing or invalid required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("autodrive");

    const result = await db.collection("review").updateOne(
      { _id: new (require('mongodb').ObjectId)(params.id) },
      {
        $set: {
          text: textSanitized,
          author: authorSanitized,
          product: productSanitized,
          location: locationSanitized,
          rating: ratingNum,
        }
      }
    );

    if (result.matchedCount === 0) return NextResponse.json({ message: "Review not found" }, { status: 404 });

    const updatedReview = await db.collection("review").findOne({ _id: new (require('mongodb').ObjectId)(params.id) });

    return NextResponse.json({ message: "Review updated successfully", data: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
