// File: /app/api/customers-reviews/route.ts
import clientPromise from '../../lib/mongodb';
import { NextRequest, NextResponse } from "next/server";

// Define Review type
export type Review = {
  product: string;
  rating: number;
  text: string;
  author: string;
  location: string;
  createdAt: Date;
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
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST: Submit a new review
export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
   const db = client.db("autodrive");
    const data = await req.json();

    // Basic validation
    if (!data.product || !data.rating || !data.text || !data.author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newReview: Review = {
      ...data,
      createdAt: new Date(),
    };

    await db.collection("review").insertOne(newReview);

    return NextResponse.json({ message: "Review submitted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
