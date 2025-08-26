// app/api/order/route.ts
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";
import DOMPurify from "isomorphic-dompurify"; // sanitize user input

export async function POST(req: NextRequest) {
  try {
    const db = (await clientPromise).db("autodrive");
    const body = await req.json();
   
console.log("Order request body:", body);

    const {
      cartItems,
      totalPrice,
      paymentMethod,
      billingDetails,
      shippingDetails,
      discount,
      shippingCost,
      salesTaxAmount,
      total
    } = body;

    // --- Basic validation ---
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!totalPrice || totalPrice <= 0) {
      return NextResponse.json({ error: "Total price is invalid" }, { status: 400 });
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: "Payment method is required" }, { status: 400 });
    }

    if (
      !billingDetails ||
      !billingDetails.email ||
      !billingDetails.firstName ||
      !billingDetails.lastName
    ) {
      return NextResponse.json({ error: "Billing details are incomplete" }, { status: 400 });
    }

    if (!isValidEmail(billingDetails.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (billingDetails.phone && !isValidPhone(billingDetails.phone)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    if (billingDetails.postalCode && !isValidPostalCode(billingDetails.postalCode)) {
      return NextResponse.json({ error: "Invalid postal code" }, { status: 400 });
    }

    if (billingDetails.country && !isValidCountry(billingDetails.country)) {
  return NextResponse.json({ error: "Invalid country" }, { status: 400 });
}

if (billingDetails.state && !isValidState(billingDetails.state)) {
  return NextResponse.json({ error: "Invalid state" }, { status: 400 });
}

    // --- Optional: create account if requested ---
    let userId: any = null;
    if (billingDetails.createAccount) {
      if (!billingDetails.password) {
        return NextResponse.json({ error: "Password required to create account" }, { status: 400 });
      }

      const existingUser = await db.collection("users").findOne({ email: billingDetails.email });
      if (existingUser) {
        userId = existingUser._id;
      } else {
        const hashedPassword = await bcrypt.hash(billingDetails.password, 10);
        const result = await db.collection("users").insertOne({
          email: billingDetails.email,
          password: hashedPassword,
          firstName: DOMPurify.sanitize(billingDetails.firstName),
          lastName: DOMPurify.sanitize(billingDetails.lastName),
          createdAt: new Date()
        });
        userId = result.insertedId;
      }
    }

    // --- Sanitize billing & shipping details ---
    const sanitizedBilling = {
      ...billingDetails,
      firstName: DOMPurify.sanitize(billingDetails.firstName),
      lastName: DOMPurify.sanitize(billingDetails.lastName),
      address1: billingDetails.address1 ? DOMPurify.sanitize(billingDetails.address1) : null,
      address2: billingDetails.address2 ? DOMPurify.sanitize(billingDetails.address2) : null,
      city: billingDetails.city ? DOMPurify.sanitize(billingDetails.city) : null,
      state: billingDetails.state ? DOMPurify.sanitize(billingDetails.state) : null,
      postalCode: billingDetails.postalCode ? DOMPurify.sanitize(billingDetails.postalCode) : null,
      country: billingDetails.country ? DOMPurify.sanitize(billingDetails.country) : null,
      orderNotes: billingDetails.orderNotes?.trim()
        ? DOMPurify.sanitize(billingDetails.orderNotes)
        : null
    };

    const sanitizedShipping = shippingDetails
      ? {
          shippingDetails,
          firstName: DOMPurify.sanitize(shippingDetails.firstName),
          lastName: DOMPurify.sanitize(shippingDetails.lastName),
          address1: shippingDetails.address1 ? DOMPurify.sanitize(shippingDetails.address1) : null,
          address2: shippingDetails.address2 ? DOMPurify.sanitize(shippingDetails.address2) : null,
          city: shippingDetails.city ? DOMPurify.sanitize(shippingDetails.city) : null,
          state: shippingDetails.state ? DOMPurify.sanitize(shippingDetails.state) : null,
          postalCode: shippingDetails.postalCode ? DOMPurify.sanitize(shippingDetails.postalCode) : null,
          country: shippingDetails.country ? DOMPurify.sanitize(shippingDetails.country) : null
        }
      : null;

    // --- Prepare order object ---
    const order = {
      userId,
      cartItems,
      billingDetails: sanitizedBilling,
      shippingDetails: billingDetails.shipToDifferentAddress ? sanitizedShipping : null,
      paymentMethod,
      totalPrice,
      discount: discount || 0,
      shippingCost: shippingCost || 0,
      salesTaxAmount: salesTaxAmount || 0,
      grandTotal: total || totalPrice,
      status: "pending",
      createdAt: new Date()
    };

    const orderResult = await db.collection("orders").insertOne(order);

    return NextResponse.json({
      message: "Order placed successfully",
      orderId: orderResult.insertedId
    });
  } catch (error: any) {
    console.error("Order error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}

// ----------------- Helper Validation Functions -----------------
function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string) {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164
  return phoneRegex.test(phone);
}

function isValidPostalCode(postalCode: string) {
  const postalCodeRegex = /^[A-Za-z0-9\s\-]{3,10}$/;
  return postalCodeRegex.test(postalCode);
}

function isValidCountry(country: string) {
  // Accept 2-letter code or country name (case-insensitive)
  const codeRegex = /^[A-Z]{2}$/;
  const nameRegex = /^[A-Za-z\s\-]{2,}$/;
  return codeRegex.test(country.toUpperCase()) || nameRegex.test(country);
}

function isValidState(state: string) {
  // Accept 2-letter code or state name (case-insensitive)
  const codeRegex = /^[A-Z]{2}$/;
  const nameRegex = /^[A-Za-z\s\-]{2,}$/;
  return codeRegex.test(state.toUpperCase()) || nameRegex.test(state);
}


// --------------------------------------------------------------

// --- GET logic for React Admin ---
export async function GET(req: NextRequest) {
  try {
    const db = (await clientPromise).db("autodrive");

    const orders = await db
      .collection("orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Transform _id to id for React Admin
    const transformedOrders = orders.map(order => ({
      ...order,
      id: order._id.toString(),
      _id: undefined
    }));

    return NextResponse.json(transformedOrders);
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}