// File: /app/api/cart/apply/route.ts
import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import sanitizeHtml from "sanitize-html";

// In-memory rate limiter
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();
const MAX_REQUESTS = 3; // max 3 requests
const WINDOW_TIME = 60 * 60 * 1000; // 1 hour


const checkRateLimit = (key: string) => {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry) {
    rateLimitMap.set(key, { count: 1, lastRequest: now });
    return true;
  }

  if (now - entry.lastRequest > WINDOW_TIME) {
    rateLimitMap.set(key, { count: 1, lastRequest: now });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) return false;

  rateLimitMap.set(key, { count: entry.count + 1, lastRequest: now });
  return true;
};

// Helper to sanitize strings
const sanitizeInput = (input: string) => 
  sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} }).trim();

export async function POST(req: Request) {
  const { couponCode: rawCouponCode } = await req.json();

  // Rate limit key: guestId or couponCode
  const cookies = req.headers.get('cookie') || '';
  const guestId = cookies.split('; ').find(c => c.startsWith('guestId='))?.split('=')[1];

  if (!guestId) {
    return NextResponse.json({ success: false, message: 'No cart found' }, { status: 400 });
  }

  // Apply rate limiting per guest
 if (!checkRateLimit(guestId)) {
  const entry = rateLimitMap.get(guestId);
  const retryAfter = entry ? Math.ceil((WINDOW_TIME - (Date.now() - entry.lastRequest)) / 1000 / 60) : 60;
  return NextResponse.json({
    success: false, 
    message: `Too many requests. Try again in ${retryAfter} minutes.`
  }, { status: 429 });
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

    // Sanitize & normalize coupon code
    const couponCode = sanitizeInput(rawCouponCode).toUpperCase();

    // Fetch coupon
    const coupon = await couponsCollection.findOne({
      code: { $regex: `^${couponCode}$`, $options: 'i' }
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
