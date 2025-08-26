import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/app/lib/mongodb";
 // adjust to your db import

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber");
  const email = searchParams.get("email");

  if (!orderNumber || !email) {
    return NextResponse.json({ message: "Missing order number or email." }, { status: 400 });
  }

  const client = await clientPromise;
  const db = (await clientPromise).db("autodrive");// use your actual DB name

  // Try to find order by _id and billingDetails.email
  let order;
try {
  let query: any = { "billingDetails.email": email };
  if (ObjectId.isValid(orderNumber)) {
    query._id = new ObjectId(orderNumber);
  } else {
    // If you support custom order numbers, use another field, e.g. orderNumber
    query.orderNumber = orderNumber;
  }
  order = await db.collection("orders").findOne(query);
} catch (err) {
  return NextResponse.json({ message: "Invalid order number format." }, { status: 400 });
}

  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  // Map to frontend shape
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
    estimatedDelivery: order.shippingDetails?.estimatedDelivery || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  });
}