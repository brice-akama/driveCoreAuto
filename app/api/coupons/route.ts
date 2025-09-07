// File: /app/api/coupons/route.ts
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';
import { NextResponse } from "next/server";
import sanitizeHtml from "sanitize-html";

// Helper to sanitize strings
const sanitizeInput = (input: string) =>
  sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} }).trim();

// Helper to validate numbers
const validateNumber = (num: any) => {
  const value = Number(num);
  return !isNaN(value) && value >= 0 ? value : null;
};

// Basic admin check placeholder (replace with JWT/session check)
const checkAdmin = (isAdmin: boolean) => {
  if (!isAdmin) throw new Error("Unauthorized");
};

// POST: Create a coupon
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, discount, type, expiresAt, usageLimit, minOrderValue, isAdmin } = body;

    // Admin check
    try { checkAdmin(isAdmin); } catch { return NextResponse.json({ message: "Unauthorized" }, { status: 401 }); }

    // Sanitize inputs
    const codeSanitized = sanitizeInput(code);
    const typeSanitized = sanitizeInput(type);

    if (!codeSanitized || !discount || !typeSanitized) {
      return NextResponse.json({ message: "Code, discount, and type are required" }, { status: 400 });
    }

    if (!["percentage", "flat"].includes(typeSanitized)) {
      return NextResponse.json({ message: "Type must be 'percentage' or 'flat'" }, { status: 400 });
    }

    const discountNum = validateNumber(discount);
    const usageLimitNum = validateNumber(usageLimit);
    const minOrderValueNum = validateNumber(minOrderValue) || 0;

    const expiresDate = expiresAt ? new Date(expiresAt) : null;
    if (expiresAt && isNaN(expiresDate!.getTime())) {
      return NextResponse.json({ message: "Invalid expiration date" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("autodrive");
    const couponsCollection = db.collection("coupons");

    // Check duplicate code
    const existingCoupon = await couponsCollection.findOne({ code: codeSanitized });
    if (existingCoupon) {
      return NextResponse.json({ message: "Coupon code already exists" }, { status: 400 });
    }

    await couponsCollection.insertOne({
      code: codeSanitized,
      discount: discountNum,
      type: typeSanitized,
      expiresAt: expiresDate,
      usageLimit: usageLimitNum,
      usageCount: 0,
      minOrderValue: minOrderValueNum,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Coupon created successfully" });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// GET: Fetch all coupons
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("autodrive");
    const couponsCollection = db.collection("coupons");

    const coupons = await couponsCollection.find().toArray();
    const total = await couponsCollection.countDocuments();

    const data = coupons.map(coupon => ({
      ...coupon,
      id: coupon._id.toString()
    }));

    return NextResponse.json({ data, total });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE: Delete coupon by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { isAdmin } = body;

    try { checkAdmin(isAdmin); } catch { return NextResponse.json({ message: "Unauthorized" }, { status: 401 }); }

    const client = await clientPromise;
    const db = client.db("autodrive");
    const couponsCollection = db.collection("coupons");

    const result = await couponsCollection.deleteOne({ _id: new ObjectId(params.id) });
    if (result.deletedCount === 0) return NextResponse.json({ message: "Coupon not found" }, { status: 404 });

    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT: Update coupon by ID
export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ message: "Coupon ID missing" }, { status: 400 });

    const body = await request.json();
    const { code, discount, type, expiresAt, usageLimit, minOrderValue, isAdmin } = body;

    try { checkAdmin(isAdmin); } catch { return NextResponse.json({ message: "Unauthorized" }, { status: 401 }); }

    // Sanitize inputs
    const codeSanitized = sanitizeInput(code);
    const typeSanitized = sanitizeInput(type);

    if (!codeSanitized || !discount || !typeSanitized) {
      return NextResponse.json({ message: "Code, discount, and type are required" }, { status: 400 });
    }

    if (!["percentage", "flat"].includes(typeSanitized)) {
      return NextResponse.json({ message: "Type must be 'percentage' or 'flat'" }, { status: 400 });
    }

    const discountNum = validateNumber(discount);
    const usageLimitNum = validateNumber(usageLimit);
    const minOrderValueNum = validateNumber(minOrderValue) || 0;

    const expiresDate = expiresAt ? new Date(expiresAt) : null;
    if (expiresAt && isNaN(expiresDate!.getTime())) {
      return NextResponse.json({ message: "Invalid expiration date" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("autodrive");
    const couponsCollection = db.collection("coupons");

    // Check duplicate code excluding current coupon
    const existingCoupon = await couponsCollection.findOne({
      code: codeSanitized,
      _id: { $ne: new ObjectId(id) }
    });
    if (existingCoupon) return NextResponse.json({ message: "Coupon code already exists" }, { status: 400 });

    const result = await couponsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          code: codeSanitized,
          discount: discountNum,
          type: typeSanitized,
          expiresAt: expiresDate,
          usageLimit: usageLimitNum,
          minOrderValue: minOrderValueNum,
        }
      }
    );

    if (result.matchedCount === 0) return NextResponse.json({ message: "Coupon not found" }, { status: 404 });

    const updatedCoupon = await couponsCollection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      message: "Coupon updated successfully",
      data: {
        id: updatedCoupon!._id.toString(),
        code: updatedCoupon!.code,
        discount: updatedCoupon!.discount,
        type: updatedCoupon!.type,
        expiresAt: updatedCoupon!.expiresAt,
        usageLimit: updatedCoupon!.usageLimit,
        usageCount: updatedCoupon!.usageCount || 0,
        createdAt: updatedCoupon!.createdAt,
      }
    });
  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
