
 import clientPromise from "../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";


export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const client = await clientPromise;
     const db = (await clientPromise).db("autodrive");// replace with your DB name

    const { orderId } = params;

    console.log("Searching for orderId:", orderId);
const order = await db
  .collection("orders")
  .findOne({ _id: new ObjectId(orderId) });
console.log("Order found:", order);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
