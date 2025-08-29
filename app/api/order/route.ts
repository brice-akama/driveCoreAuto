import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";
import DOMPurify from "isomorphic-dompurify";
import nodemailer from "nodemailer";

// --- Multilingual translations ---
const translations: Record<string, any> = {
  en: {
    thankYou: "Thank you for your order",
    pendingPayment: "Your order is currently pending payment. Our team will contact you shortly with payment instructions.",
    billingDetails: "Billing Details",
    shippingDetails: "Shipping Details",
    items: "Items",
    paymentMethod: "Payment Method",
    contactSupport: "If you have any queries, contact our support team.",
    newOrderNotification: "New order placed on your website!",
    customer: "Customer",
    orderDetails: "Order Details",
    billingAddress: "Billing Address",
    shippingAddress: "Shipping Address",
    orderPending: "Order is currently pending payment."
  },
  fr: {
    thankYou: "Merci pour votre commande",
    pendingPayment: "Votre commande est actuellement en attente de paiement. Notre équipe vous contactera prochainement avec les instructions de paiement.",
    billingDetails: "Informations de facturation",
    shippingDetails: "Informations de livraison",
    items: "Articles",
    paymentMethod: "Mode de paiement",
    contactSupport: "Si vous avez des questions, contactez notre équipe de support.",
    newOrderNotification: "Nouvelle commande passée sur votre site !",
    customer: "Client",
    orderDetails: "Détails de la commande",
    billingAddress: "Adresse de facturation",
    shippingAddress: "Adresse de livraison",
    orderPending: "La commande est actuellement en attente de paiement."
  },
  es: {
    thankYou: "Gracias por su pedido",
    pendingPayment: "Su pedido está pendiente de pago. Nuestro equipo se pondrá en contacto con usted con las instrucciones de pago.",
    billingDetails: "Detalles de facturación",
    shippingDetails: "Detalles de envío",
    items: "Artículos",
    paymentMethod: "Método de pago",
    contactSupport: "Si tiene alguna pregunta, comuníquese con nuestro equipo de soporte.",
    newOrderNotification: "¡Nuevo pedido realizado en su sitio web!",
    customer: "Cliente",
    orderDetails: "Detalles del pedido",
    billingAddress: "Dirección de facturación",
    shippingAddress: "Dirección de envío",
    orderPending: "El pedido está actualmente pendiente de pago."
  },
  it: {
    thankYou: "Grazie per il tuo ordine",
    pendingPayment: "Il tuo ordine è attualmente in attesa di pagamento. Il nostro team ti contatterà a breve con le istruzioni di pagamento.",
    billingDetails: "Dettagli di fatturazione",
    shippingDetails: "Dettagli di spedizione",
    items: "Articoli",
    paymentMethod: "Metodo di pagamento",
    contactSupport: "Se hai domande, contatta il nostro team di supporto.",
    newOrderNotification: "Nuovo ordine effettuato sul tuo sito!",
    customer: "Cliente",
    orderDetails: "Dettagli dell'ordine",
    billingAddress: "Indirizzo di fatturazione",
    shippingAddress: "Indirizzo di spedizione",
    orderPending: "L'ordine è attualmente in attesa di pagamento."
  }
};

// Email transporter (Zoho)
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const db = (await clientPromise).db("autodrive");
    const body = await req.json();

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
    if (!cartItems || cartItems.length === 0)
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    if (!totalPrice || totalPrice <= 0)
      return NextResponse.json({ error: "Total price is invalid" }, { status: 400 });

    if (!paymentMethod)
      return NextResponse.json({ error: "Payment method is required" }, { status: 400 });

    if (!billingDetails || !billingDetails.email || !billingDetails.firstName || !billingDetails.lastName)
      return NextResponse.json({ error: "Billing details are incomplete" }, { status: 400 });

    if (!isValidEmail(billingDetails.email))
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });

    // --- Optional: create account ---
    let userId: any = null;
    if (billingDetails.createAccount) {
      if (!billingDetails.password)
        return NextResponse.json({ error: "Password required to create account" }, { status: 400 });

      const existingUser = await db.collection("users").findOne({ email: billingDetails.email });
      if (existingUser) userId = existingUser._id;
      else {
        const hashedPassword = await bcrypt.hash(billingDetails.password, 10);
        const result = await db.collection("users").insertOne({
          email: billingDetails.email,
          password: hashedPassword,
          firstName: DOMPurify.sanitize(billingDetails.firstName),
          lastName: DOMPurify.sanitize(billingDetails.lastName),
          createdAt: new Date(),
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
      orderNotes: billingDetails.orderNotes?.trim() ? DOMPurify.sanitize(billingDetails.orderNotes) : null
    };

    const sanitizedShipping = shippingDetails
      ? {
          ...shippingDetails,
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

    // --- Select language ---
    const lang = billingDetails.language || "en";
    const t = translations[lang];

    // --- Client email ---
    const clientEmailHTML = `
      <h2>${t.thankYou}, ${sanitizedBilling.firstName}!</h2>
      <p>Order ID: <strong>${orderResult.insertedId}</strong></p>
      <p>Total: <strong>$${order.grandTotal.toFixed(2)}</strong></p>
      <p><em>${t.pendingPayment}</em></p>
      <p>${t.contactSupport}</p>
      <h3>${t.billingDetails}:</h3>
      <p>${sanitizedBilling.firstName} ${sanitizedBilling.lastName}</p>
      <p>${sanitizedBilling.address1 || ""} ${sanitizedBilling.address2 || ""}</p>
      <p>${sanitizedBilling.city || ""}, ${sanitizedBilling.state || ""} ${sanitizedBilling.postalCode || ""}</p>
      <p>${sanitizedBilling.country || ""}</p>
      <p>Email: ${sanitizedBilling.email}</p>
      <p>Phone: ${sanitizedBilling.phone || "N/A"}</p>
      ${sanitizedShipping ? `<h3>${t.shippingDetails}:</h3>
      <p>${sanitizedShipping.firstName} ${sanitizedShipping.lastName}</p>
      <p>${sanitizedShipping.address1 || ""} ${sanitizedShipping.address2 || ""}</p>
      <p>${sanitizedShipping.city || ""}, ${sanitizedShipping.state || ""} ${sanitizedShipping.postalCode || ""}</p>
      <p>${sanitizedShipping.country || ""}</p>` : ""}
      <h3>${t.items}:</h3>
      <ul>
        ${cartItems.map((item: any) => `<li>${item.name} x ${item.quantity} - $${item.price}</li>`).join("")}
      </ul>
      <p>${t.paymentMethod}: ${paymentMethod}</p>
      <p>Thank you for choosing <strong>DriveCore Auto</strong>!</p>
    `;

    // --- Company email ---
    const companyEmailHTML = `
      <h2>${t.newOrderNotification}</h2>
      <p>Order ID: <strong>${orderResult.insertedId}</strong></p>
      <p>${t.customer}: <strong>${sanitizedBilling.firstName} ${sanitizedBilling.lastName}</strong></p>
      <p>Email: ${sanitizedBilling.email}</p>
      <p>Phone: ${sanitizedBilling.phone || "N/A"}</p>
      <h3>${t.orderDetails}:</h3>
      <ul>
        ${cartItems.map((item: any) => `<li>${item.name} x ${item.quantity} - $${item.price}</li>`).join("")}
      </ul>
      <p>Total: <strong>$${order.grandTotal.toFixed(2)}</strong></p>
      <p>${t.paymentMethod}: ${paymentMethod}</p>
      <h3>${t.billingAddress}:</h3>
      <p>${sanitizedBilling.address1 || ""} ${sanitizedBilling.address2 || ""}</p>
      <p>${sanitizedBilling.city || ""}, ${sanitizedBilling.state || ""} ${sanitizedBilling.postalCode || ""}</p>
      <p>${sanitizedBilling.country || ""}</p>
      ${sanitizedShipping ? `<h3>${t.shippingAddress}:</h3>
      <p>${sanitizedShipping.address1 || ""} ${sanitizedShipping.address2 || ""}</p>
      <p>${sanitizedShipping.city || ""}, ${sanitizedShipping.state || ""} ${sanitizedShipping.postalCode || ""}</p>
      <p>${sanitizedShipping.country || ""}</p>` : ""}
      <p>${t.orderPending}</p>
    `;

    // --- Send emails ---
    await transporter.sendMail({
      from: `"DriveCore Auto" <${process.env.EMAIL_USER}>`,
      to: sanitizedBilling.email,
      subject: `Your DriveCore Auto Order Confirmation #${orderResult.insertedId}`,
      html: clientEmailHTML
    });

    await transporter.sendMail({
      from: `"DriveCore Auto Orders" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Order Received #${orderResult.insertedId}`,
      html: companyEmailHTML
    });

    return NextResponse.json({
      message: "Order placed successfully",
      orderId: orderResult.insertedId
    });

  } catch (error: any) {
    console.error("Order error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
};

// Helper
function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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