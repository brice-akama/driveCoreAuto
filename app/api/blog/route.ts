import clientPromise from '../../lib/mongodb';
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import slugify from 'slugify';
import { ObjectId } from 'mongodb';
import sanitizeHtml from 'sanitize-html';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET_KEY!,
});

// Convert ReadableStream to Buffer
async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let done = false;

  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) chunks.push(value);
    done = readerDone;
  }

  return Buffer.concat(chunks);
}

// Upload to Cloudinary
async function uploadToCloudinary(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error("❌ Error uploading image:", error);
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        }
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

// Translate text helper
async function translateText(text: string, source: string, target: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, source, target }),
  });

  const data = await response.json();
  return data.translatedText || text;
}

// Sanitize HTML content (only allow safe tags/attrs)
const sanitize = (input: string) =>
  sanitizeHtml(input, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'p', 'br', 'img'],
    allowedAttributes: {
      a: ['href', 'target'],
      img: ['src', 'alt', 'title', 'width', 'height'],
    },
    allowedSchemes: ['http', 'https', 'data'],
  });

 const LANGUAGES = ['en', 'de', 'fr', 'es'];


  function getMultilingualFields(form: FormData, fieldName: string): Record<string, string> {
  const result: Record<string, string> = {};
  LANGUAGES.forEach((lang) => {
    const val = form.get(`${fieldName}.${lang}`);
    result[lang] = val ? sanitize(val.toString()) : '';
  });
  return result;
}


export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // Extract multilingual fields
    const title = getMultilingualFields(form, "title");
    const content = getMultilingualFields(form, "content");
    const metaTitle = getMultilingualFields(form, "metaTitle");
    const metaDescription = getMultilingualFields(form, "metaDescription");

    const author = form.get("author")?.toString() || "";
    const category = form.get("category")?.toString() || "";

    const slug: Record<string, string> = {};
LANGUAGES.forEach((lang) => {
  const source = title[lang];
  slug[lang] = slugify(source || "untitled", { lower: true, strict: true });
});


    // Handle image upload if present
    let imageUrl = "";
    const imageFile = form.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const buffer = await streamToBuffer(imageFile.stream());
      imageUrl = await uploadToCloudinary(buffer, "news");
    }

    const client = await clientPromise;
   const db = client.db("autodrive");

    const result = await db.collection("news").insertOne({
      title,
      content,
      metaTitle,
      metaDescription,
      author,
      category,
      slug,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      message: "Blog post created successfully",
      data: { id: result.insertedId.toString() },
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
  }
}

// Fetch all blog posts or just the latest 3
// Fetch all blog posts or just a specific one
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const id: string | null = searchParams.get("id");
  const slug: string | null = searchParams.get("slug");
  const lang: string = searchParams.get("lang") || "en";
  const limit: string | null = searchParams.get("limit");
  const page: string | null = searchParams.get("page");
  const category: string | null = searchParams.get("category");

  const client = await clientPromise;
 const db = client.db("autodrive");

  try {
    // Fetch by ID
    if (id) {
      if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
      }

      const post = await db.collection("news").findOne({ _id: new ObjectId(id) });

      if (!post) {
        return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
      }

      const translatedPost = {
        ...post,
        id: post._id.toString(),
        title: post.translations?.[lang]?.title || post.title,
        content: post.translations?.[lang]?.content || post.content,
        metaTitle: post.translations?.[lang]?.metaTitle || post.metaTitle,
        metaDescription: post.translations?.[lang]?.metaDescription || post.metaDescription,
      };

      return NextResponse.json({ data: translatedPost });
    }

    // Fetch by slug in specific language
if (slug) {
  const post = await db.collection("news").findOne({ [`slug.${lang}`]: slug });

  if (!post) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }

  const translatedPost = {
    ...post,
    id: post._id.toString(),
    title: post.title?.[lang] || post.title?.en || "",
    content: post.content?.[lang] || post.content?.en || "",
    metaTitle: post.metaTitle?.[lang] || "",
    metaDescription: post.metaDescription?.[lang] || "",
    slug: post.slug?.[lang] || "",
  };

  return NextResponse.json({ data: translatedPost });
}


    // Build query (e.g., filter by category)
    const query: Record<string, string> = {};
    if (category) {
      query.category = category;
    }

    // If pagination is present, use it
    const isPaginated = limit !== null || page !== null;

    let posts = [];
    let totalPosts = 0;

    if (isPaginated) {
      const limitNumber = Number(limit || 10);
      const pageNumber = Number(page || 1);
      const skip = (pageNumber - 1) * limitNumber;

      totalPosts = await db.collection("news").countDocuments(query);

      posts = await db
        .collection("news")
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .toArray();
    } else {
      // Fetch all if no pagination provided
      posts = await db
        .collection("news")
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      totalPosts = posts.length;
    }

    const translatedPosts = posts.map((post) => ({
      ...post,
      id: post._id.toString(),
      title: post.translations?.[lang]?.title || post.title,
      content: post.translations?.[lang]?.content || post.content,
    }));

    return NextResponse.json({
      data: translatedPosts,
      total: totalPosts,
    });
  } catch (error) {
    console.error("❌ Error fetching blog posts:", error);
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    console.log("🗑️ DELETE request received");

    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    // If ID is not found in query params, check the request body
    if (!id) {
      const body = await req.json();
      id = body.id;
    }

    if (!id || !ObjectId.isValid(id)) {
      console.error("❌ Invalid or missing ID");
      return NextResponse.json({ error: "Invalid or missing blog ID" }, { status: 400 });
    }

    console.log(`🆔 Deleting blog post with ID: ${id}`);

    const client = await clientPromise;
    const db = client.db("autodrive");

    // Fetch the blog post first to get the image URL
    const post = await db.collection("news").findOne({ _id: new ObjectId(id) });

    if (!post) {
      console.error("🚫 Blog post not found");
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Delete image from Cloudinary if it exists
    if (post.imageUrl) {
      const publicId = post.imageUrl.split('/').pop()?.split('.')[0]; // Extract public ID
      if (publicId) {
        console.log(`🖼️ Deleting image from Cloudinary: ${publicId}`);
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Delete the blog post from the database
    const result = await db.collection("news").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      console.error("🚫 Failed to delete blog post");
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    console.log("✅ Blog post deleted successfully");
    return NextResponse.json({ message: "Blog post deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting blog post:", error);
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const form = await req.formData();

    // Extract multilingual fields same as POST
    const title = getMultilingualFields(form, "title");
    const content = getMultilingualFields(form, "content");
    const metaTitle = getMultilingualFields(form, "metaTitle");
    const metaDescription = getMultilingualFields(form, "metaDescription");

    const author = form.get("author")?.toString() || "";
    const category = form.get("category")?.toString() || "";

    // Use English title (or fallback) to generate slug
    // Create multilingual slug object
const slug: Record<string, string> = {};
LANGUAGES.forEach((lang) => {
  const source = title[lang];
  slug[lang] = slugify(source || "untitled", { lower: true, strict: true });
});


    // Handle image upload (optional)
    let imageUrl = "";
    const imageFile = form.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      const buffer = await streamToBuffer(imageFile.stream());
      imageUrl = await uploadToCloudinary(buffer, "news");
    }

    const client = await clientPromise;
    const db = client.db("autodrive");

    const updateFields: any = {
      title,
      content,
      metaTitle,
      metaDescription,
      author,
      category,
      slug,
      updatedAt: new Date(),
    };

    if (imageUrl) updateFields.imageUrl = imageUrl;

    const result = await db.collection("news").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Blog post updated successfully",
      data: { id, ...updateFields },
    });

  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 });
  }
}













