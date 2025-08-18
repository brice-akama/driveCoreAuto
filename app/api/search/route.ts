import { NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import he from "he";

// Decode HTML entities
function decodeHtmlEntities(input: string): string {
  return he.decode(input);
}

// Sanitize user input
function sanitizeInput(input: string): string {
  return input.replace(/[^\w\s-]/gi, "").trim();
}

// Escape regex special characters
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const rawSearch = url.searchParams.get("search") || "";
    const language = url.searchParams.get("lang") || "en"; // Current language

    const decodedSearch = decodeHtmlEntities(rawSearch);
    const search = sanitizeInput(decodedSearch);

    if (!search) {
      return NextResponse.json({ products: [], blogs: [] });
    }

    const client = await clientPromise;
    const db = client.db("autodrive");
    const productsCollection = db.collection("products");
    const blogsCollection = db.collection("news");

    const escapedSearch = escapeRegExp(search);

    // Search products
    const products = await productsCollection
      .find({
        lang: language,
        $or: [
  { slug: { $regex: escapedSearch, $options: "i" } },
  { name: { $regex: escapedSearch, $options: "i" } },
  { category: { $regex: escapedSearch, $options: "i" } },
]

      })
      .toArray();

    // Search blogs by title
    const blogs = await blogsCollection
      .find({
        lang: language,
        title: { $regex: escapedSearch, $options: "i" },
      })
      .toArray();

    // Return combined results
    return NextResponse.json({ products, blogs });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
