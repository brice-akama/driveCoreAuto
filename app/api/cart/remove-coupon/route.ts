// app/api/cart/remove-coupon/route.ts
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

// POST: Remove coupon from cart
export async function POST(req: Request) {
  const cookies = req.headers.get('cookie') || '';
  const guestId = cookies.split('; ').find(c => c.startsWith('guestId='))?.split('=')[1];

  if (!guestId) {
    return NextResponse.json({ success: false, message: 'No cart found' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("autodrive");
    const cartCollection = db.collection('cart');

    await cartCollection.updateOne({ guestId }, { $unset: { coupon: "", discount: "" } });
    const updatedCart = await cartCollection.findOne({ guestId });

    return NextResponse.json({ success: true, message: 'Coupon removed', cart: updatedCart });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Error removing coupon' }, { status: 500 });
  }
}
