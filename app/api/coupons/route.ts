// app/api/coupons/route.ts
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';
import { NextResponse } from "next/server";

// Only admins should access this endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, discount, type, expiresAt, usageLimit,  minOrderValue, isAdmin } = body;

    // Simple admin check (replace with real auth check)
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!code || !discount || !type) {
      return NextResponse.json({ message: "Code, discount, and type are required" }, { status: 400 });
    }

    if (!["percentage", "flat"].includes(type)) {
      return NextResponse.json({ message: "Type must be 'percentage' or 'flat'" }, { status: 400 });
    }

    if (minOrderValue && typeof minOrderValue !== 'number') {
  return NextResponse.json({ message: "minOrderValue must be a number" }, { status: 400 });
}


    const client = await clientPromise;
     const db = client.db("autodrive");
    const couponsCollection = db.collection("coupons");

    const existingCoupon = await couponsCollection.findOne({ code });
    if (existingCoupon) {
      return NextResponse.json({ message: "Coupon code already exists" }, { status: 400 });
    }

    

    await couponsCollection.insertOne({
      code,
      discount,
      type,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      usageLimit: usageLimit || null,
      usageCount: 0,
      minOrderValue: minOrderValue || 0,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Coupon created successfully" });
  } catch (error) {
    console.error("Error creating coupon:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("autodrive");
    const couponsCollection = db.collection("coupons");

    const coupons = await couponsCollection.find().toArray();
    const total = await couponsCollection.countDocuments();

    // Map _id to id
    const data = coupons.map((coupon) => ({
      ...coupon,
      id: coupon._id.toString(), // convert ObjectId to string
    }));

    return NextResponse.json({ data, total });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { isAdmin } = body;

    // Simple admin check (replace with real auth check)
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("autodrive");
    const couponsCollection = db.collection("coupons");

    const result = await couponsCollection.deleteOne({ _id: new (require('mongodb').ObjectId)(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}



export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id"); // ✅ get ID from query string
    if (!id) {
      return NextResponse.json({ message: "Coupon ID missing" }, { status: 400 });
    }

    const body = await request.json();
    const { code, discount, type, expiresAt, usageLimit, minOrderValue, isAdmin } = body;

    // Admin check
    if (!isAdmin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Validation
    if (!code || !discount || !type) {
      return NextResponse.json({ message: "Code, discount, and type are required" }, { status: 400 });
    }

    if (!["percentage", "flat"].includes(type)) {
      return NextResponse.json({ message: "Type must be 'percentage' or 'flat'" }, { status: 400 });
    }

    if (minOrderValue && typeof minOrderValue !== 'number') {
  return NextResponse.json({ message: "minOrderValue must be a number" }, { status: 400 });
}


    const client = await clientPromise;
    const db = client.db("autodrive");
    const couponsCollection = db.collection("coupons");

    // Check if coupon code exists (excluding current coupon)
    const existingCoupon = await couponsCollection.findOne({ 
      code, 
      _id: { $ne: new ObjectId(id) } 
    });

    if (existingCoupon) {
      return NextResponse.json({ message: "Coupon code already exists" }, { status: 400 });
    }

    // Update coupon
    const result = await couponsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          code,
          discount,
          type,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          usageLimit: usageLimit || null,
          minOrderValue: minOrderValue || 0,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
    }

    // Fetch updated coupon
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
      },
    });

  } catch (error) {
    console.error("Error updating coupon:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// The above code defines a Next.js API route for managing coupons, including creating, fetching, updating, and deleting coupons with admin checks.