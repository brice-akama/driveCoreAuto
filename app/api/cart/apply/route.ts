// app/api/cart/apply/route.ts
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export async function POST(req: Request) {
  const { couponCode } = await req.json();
  const cookies = req.headers.get('cookie') || '';
  const guestId = cookies.split('; ').find(c => c.startsWith('guestId='))?.split('=')[1];

  if (!guestId) {
    return NextResponse.json({ success: false, message: 'No cart found' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("autodrive");
    const cartCollection = db.collection('cart');
    const couponsCollection = db.collection('coupons');

    // Fetch cart
    const cart = await cartCollection.findOne({ guestId });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ success: false, message: 'Cart is empty' });
    }

    // Normalize code for safer matching
    const normalizedCode = couponCode.replace(/\s+/g, ' ').trim().toUpperCase();

    // Fetch coupon
    const coupon = await couponsCollection.findOne({
      code: { $regex: `^${normalizedCode}$`, $options: 'i' }
    });

    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Invalid coupon code' });
    }

    // Calculate cart subtotal
    const subtotal = cart.items.reduce(
      (acc: number, item: { price: number; quantity: number }) => acc + item.price * item.quantity,
      0
    );

    // Check minimum order value
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return NextResponse.json({
        success: false,
        message: `Cart total must be at least $${coupon.minOrderValue} to use this coupon`
      });
    }

    // Calculate discount
    const discount = coupon.type === "percentage" 
      ? subtotal * (coupon.discount / 100) 
      : coupon.discount;

    // Update cart
    await cartCollection.updateOne({ guestId }, { $set: { coupon: coupon.code, discount } });
    const updatedCart = await cartCollection.findOne({ guestId });

    return NextResponse.json({ success: true, message: 'Coupon applied', cart: updatedCart });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Error applying coupon' }, { status: 500 });
  }
}


