import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/app/lib/mongodb";

// Helper to sanitize email
const sanitizeEmail = (email: string) =>
  email.trim().toLowerCase().replace(/[^\w@.-]/g, '');

// Helper to validate ObjectId
const isValidObjectId = (id: string) => ObjectId.isValid(id);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let orderNumber = searchParams.get("orderNumber")?.trim();
    let email = searchParams.get("email")?.trim();

    if (!orderNumber || !email) {
      return NextResponse.json({ message: "Missing order number or email." }, { status: 400 });
    }

    // Sanitize inputs
    email = sanitizeEmail(email);
    orderNumber = orderNumber.trim();

    const client = await clientPromise;
    const db = client.db("autodrive");

    let query: any = { "billingDetails.email": email };

    if (isValidObjectId(orderNumber)) {
      query._id = new ObjectId(orderNumber);
    } else {
      // Use custom orderNumber field if applicable
      query.orderNumber = orderNumber;
    }

    const order = await db.collection("orders").findOne(query);

    if (!order) {
      return NextResponse.json({ message: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({
      orderNumber: order._id.toString(),
      date: order.createdAt ? new Date(order.createdAt).toISOString() : "",
      shippingAddress: order.billingDetails
        ? `${order.billingDetails.firstName} ${order.billingDetails.lastName}, ${order.billingDetails.streetAddress || order.billingDetails.address1}, ${order.billingDetails.city}, ${order.billingDetails.country}`
        : "",
      status: order.status || "placed",
      items: (order.cartItems || []).map((item: any) => ({
        id: item.slug,
        name: item.name,
        image: item.mainImage,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingCarrier: order.shippingDetails?.carrier || "N/A",
      trackingNumber: order.shippingDetails?.trackingNumber || "N/A",
      estimatedDelivery:
        order.shippingDetails?.estimatedDelivery ||
        new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
