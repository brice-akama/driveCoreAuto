import clientPromise from "../../lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import sanitizeHtml from "sanitize-html";

// Define types
interface Review {
  _id: ObjectId;
  customerName: string;
  reviewContent: string;
  rating: number;
  avatarUrl: string;
  createdAt: Date;
  updatedAt?: Date;
  slug: string;
  location?: string; // Added location field
}

interface RequestBody {
  customerName: string;
  reviewContent: string;
  rating: number;
  slug: string;
  location?: string; // optional, admin-controlled
  id?: string;
}

// Generate avatar SVG
function generateAvatar(customerName: string): string {
  const initials = customerName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", "#33FFF5"];
  const color = colors[customerName.length % colors.length];

  return `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <rect width="100%" height="100%" fill="${color}" />
      <text x="50%" y="50%" font-size="18" font-family="Arial" fill="white" text-anchor="middle" dy=".3em">${initials}</text>
    </svg>`
  )}`;
}

// Sanitize helper
const sanitizeInput = (input: string): string => {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
};

// ✅ POST
export async function POST(req: Request): Promise<Response> {
  try {
    const body: RequestBody = await req.json();
    const customerName = sanitizeInput(body.customerName?.trim());
    const reviewContent = sanitizeInput(body.reviewContent?.trim());
    const slug = sanitizeInput(body.slug?.trim());
    const rating = Number(body.rating);
    const location = sanitizeInput(body.location?.trim() || ""); // optional location

    if (!customerName || !reviewContent || !slug || isNaN(rating)) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const avatarUrl = generateAvatar(customerName);
    const newReview: Review = {
      _id: new ObjectId(),
      customerName,
      reviewContent,
      rating,
      avatarUrl,
      createdAt: new Date(),
      slug,
      location, // ✅ store location
    };

    const client = await clientPromise;
      const db = client.db("autodrive");
    const reviewsCollection = db.collection("reviews");

    const result = await reviewsCollection.insertOne(newReview);

    return NextResponse.json({
      message: "Review submitted successfully",
      review: { ...newReview, id: result.insertedId.toString() },
    }, { status: 201 });

  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ✅ GET
export async function GET(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const slug = url.searchParams.get("slug");

    const hasLimit = url.searchParams.has("_limit");
    const _page = parseInt(url.searchParams.get("_page") || "1");
    const _limit = hasLimit ? parseInt(url.searchParams.get("_limit") || "10") : 0;
    const _sort = url.searchParams.get("_sort") || "createdAt";
    const _order = url.searchParams.get("_order") === "DESC" ? -1 : 1;

    const client = await clientPromise;
      const db = client.db("autodrive");
    const reviewsCollection = db.collection("reviews");

    if (slug) {
      const sanitizedSlug = sanitizeInput(slug);
      const query = { slug: sanitizedSlug };
      const cursor = reviewsCollection.find(query).sort({ [_sort]: _order });

      if (hasLimit) cursor.skip((_page - 1) * _limit).limit(_limit);

      const reviews = await cursor.toArray();
      const total = await reviewsCollection.countDocuments(query);

      if (!reviews.length) {
        return NextResponse.json({ message: "No reviews found for this product" }, { status: 404 });
      }

      const allSlugReviews = await reviewsCollection.find(query).toArray();
      const ratingCount = allSlugReviews.length;
      const totalRating = allSlugReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
      const averageRating = ratingCount ? parseFloat((totalRating / ratingCount).toFixed(1)) : 0;
      const starDistributions = [0, 0, 0, 0, 0];
      allSlugReviews.forEach((review) => {
        const star = review.rating;
        if (star >= 1 && star <= 5) starDistributions[star - 1] += 1;
      });

      const formatted = reviews.map((r) => ({
        ...r,
        id: r._id.toString(),
        _id: undefined,
      }));

      return NextResponse.json({
        data: formatted,
        total,
        ratingSummary: { ratingCount, averageRating, starDistributions },
      }, { status: 200 });
    }

    if (id) {
      const review = await reviewsCollection.findOne({ _id: new ObjectId(id) });
      if (!review) return NextResponse.json({ message: "Review not found" }, { status: 404 });

      return NextResponse.json({
        data: [{ ...review, id: review._id.toString(), _id: undefined }],
        total: 1,
      }, { status: 200 });
    }

    const query = {};
    const cursor = reviewsCollection.find(query).sort({ [_sort]: _order });
    if (hasLimit) cursor.skip((_page - 1) * _limit).limit(_limit);

    const reviews = await cursor.toArray();
    const total = await reviewsCollection.countDocuments(query);
    const formatted = reviews.map((r) => ({ ...r, id: r._id.toString(), _id: undefined }));

    return NextResponse.json({ data: formatted, total }, { status: 200 });

  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ✅ PUT
export async function PUT(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);

    // ✅ First parse the body
    const body: RequestBody = await req.json();

    // Then get the ID from query or fallback to body
    const id = url.searchParams.get("id") || (body as any).id;

    // Validate ID
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid review ID" }, { status: 400 });
    }

    // Sanitize and parse data
    const customerName = sanitizeHtml(body.customerName?.trim());
    const reviewContent = sanitizeHtml(body.reviewContent?.trim());
    const rating = Number(body.rating);
    const location = sanitizeHtml(body.location?.trim() || "");

    if (!customerName || !reviewContent || isNaN(rating)) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("autodrive");
    const reviewsCollection = db.collection("reviews");

    // Update the review
    const result = await reviewsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { customerName, reviewContent, rating, location, updatedAt: new Date() } },
      { returnDocument: "after", upsert: false }
    );

    if (!result || !result.value) {
      return NextResponse.json({ message: "Review not found" }, { status: 404 });
    }

    const updatedReview = result.value;

    return NextResponse.json(
      {
        message: "Review updated successfully",
        data: { ...updatedReview, id: updatedReview._id.toString() },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ✅ DELETE
export async function DELETE(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ message: "Review ID is required" }, { status: 400 });

    const client = await clientPromise;
     const db = client.db("autodrive");
    const reviewsCollection = db.collection("reviews");

    const result = await reviewsCollection.deleteOne({ _id: new ObjectId(id) });
    if (!result.deletedCount) return NextResponse.json({ message: "Review not found" }, { status: 404 });

    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
