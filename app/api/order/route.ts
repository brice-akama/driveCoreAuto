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
      subtotal: totalPrice,  // This is the subtotal (products only)
      discount: discount || 0,
      shippingCost: shippingCost || 0,
      salesTaxAmount: salesTaxAmount || 0,
      grandTotal: total || totalPrice,  // This is the final total including everything
      status: "pending",
      createdAt: new Date()
    };

    const orderResult = await db.collection("orders").insertOne(order);

    // --- Select language ---
    const lang = billingDetails.language || "en";
    const t = translations[lang];

    // --- Client email ---
    // Replace your existing clientEmailHTML variable with this:
const clientEmailHTML = `
  <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">DriveCore Auto</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Order Confirmation</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 30px 20px; border: 1px solid #e5e7eb; border-top: none;">
      
      <!-- Greeting & Order Info -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #1e3a8a; margin: 0 0 10px 0; font-size: 24px;">${t.thankYou}, ${sanitizedBilling.firstName}!</h2>
        <p style="margin: 0; color: #6b7280; font-size: 16px;">Your order has been received and is being processed.</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; display: inline-block;">
          <p style="margin: 0; font-size: 18px;"><strong>Order #${orderResult.insertedId}</strong></p>
          <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Placed on ${new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <!-- Order Status -->
      <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
        <p style="margin: 0; color: #92400e; font-weight: bold;">⏳ Order Status: Pending Payment</p>
        <p style="margin: 5px 0 0 0; color: #92400e; font-size: 14px;">${t.pendingPayment}</p>
      </div>

      <!-- Order Items -->
      <div style="margin: 30px 0;">
        <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">${t.items}</h3>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
          ${cartItems.map((item: { name: any; quantity: number; price: number; }) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            <div>
              <p style="margin: 0; font-weight: bold; color: #111827;">${item.name}</p>
              <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 14px;">Qty: ${item.quantity} × $${item.price.toFixed(2)}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-weight: bold; color: #111827;">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>`).join('')}
        </div>
      </div>

      <!-- Order Summary -->
      <div style="margin: 30px 0;">
        <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Order Summary</h3>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span>Subtotal:</span>
            <span>$${order.subtotal.toFixed(2)}</span>
          </div>
          ${order.discount > 0 ? `
          <div style="display: flex; justify-content: space-between; margin: 8px 0; color: #059669; font-weight: bold;">
            <span>🎉 Coupon Discount:</span>
            <span>-$${order.discount.toFixed(2)}</span>
          </div>` : ''}
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span>Shipping:</span>
            <span>$${order.shippingCost.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 8px 0;">
            <span>Sales Tax:</span>
            <span>$${order.salesTaxAmount.toFixed(2)}</span>
          </div>
          <div style="border-top: 2px solid #1e3a8a; margin: 15px 0 10px 0; padding-top: 15px;">
            <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; color: #1e3a8a;">
              <span>Grand Total:</span>
              <span>$${order.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Method -->
      <div style="background: #e0e7ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #3730a3;"><strong>💳 ${t.paymentMethod}:</strong> ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}</p>
      </div>

      <!-- Billing Address -->
      <div style="margin: 30px 0;">
        <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">📍 ${t.billingDetails}</h3>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
          <p style="margin: 0 0 5px 0; font-weight: bold;">${sanitizedBilling.firstName} ${sanitizedBilling.lastName}</p>
          <p style="margin: 0 0 5px 0;">${sanitizedBilling.address1 || ""} ${sanitizedBilling.address2 || ""}</p>
          <p style="margin: 0 0 5px 0;">${sanitizedBilling.city || ""}, ${sanitizedBilling.state || ""} ${sanitizedBilling.postalCode || ""}</p>
          <p style="margin: 0 0 5px 0;">${sanitizedBilling.country || ""}</p>
          <p style="margin: 0 0 5px 0; color: #6b7280;">📧 ${sanitizedBilling.email}</p>
          <p style="margin: 0; color: #6b7280;">📞 ${sanitizedBilling.phone || "N/A"}</p>
        </div>
      </div>

      ${sanitizedShipping ? `
      <!-- Shipping Address -->
      <div style="margin: 30px 0;">
        <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">🚚 ${t.shippingDetails}</h3>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
          <p style="margin: 0 0 5px 0; font-weight: bold;">${sanitizedShipping.firstName} ${sanitizedShipping.lastName}</p>
          <p style="margin: 0 0 5px 0;">${sanitizedShipping.address1 || ""} ${sanitizedShipping.address2 || ""}</p>
          <p style="margin: 0 0 5px 0;">${sanitizedShipping.city || ""}, ${sanitizedShipping.state || ""} ${sanitizedShipping.postalCode || ""}</p>
          <p style="margin: 0;">${sanitizedShipping.country || ""}</p>
        </div>
      </div>` : ''}

      <!-- What's Next -->
      <div style="background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
        <h3 style="margin: 0 0 10px 0; color: #065f46;">✅ What's Next?</h3>
        <p style="margin: 0 0 10px 0; color: #065f46;">1. We'll process your payment and send a confirmation</p>
        <p style="margin: 0 0 10px 0; color: #065f46;">2. Your order will be prepared and shipped</p>
        <p style="margin: 0; color: #065f46;">3. You'll receive tracking information via email</p>
      </div>

      <!-- Support -->
      <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f3f4f6; border-radius: 8px;">
        <h3 style="color: #1e3a8a; margin: 0 0 10px 0;">Need Help?</h3>
        <p style="margin: 0 0 10px 0; color: #6b7280;">${t.contactSupport}</p>
        <p style="margin: 0; color: #6b7280;">📧 Contact us at <a href="mailto:support@drivecoreauto.com" style="color: #1e3a8a; text-decoration: none;">support@drivecoreauto.com</a></p>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
      <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">Thank you for choosing DriveCore Auto!</p>
      <p style="margin: 0; opacity: 0.8; font-size: 14px;">Drive with confidence, powered by quality parts.</p>
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #374151;">
        <p style="margin: 0; font-size: 12px; opacity: 0.7;">
          This email was sent to ${sanitizedBilling.email}. 
          <br>© ${new Date().getFullYear()} DriveCore Auto. All rights reserved.
        </p>
      </div>
    </div>

  </div>
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
        ${cartItems.map((item: any) => `<li>${item.name} x ${item.quantity} - $${item.price.toFixed(2)}</li>`).join("")}
      </ul>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      
      <div style="margin: 10px 0;">
        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
          <span>Subtotal:</span>
          <span>$${order.subtotal.toFixed(2)}</span>
        </div>
        ${order.discount > 0 ? `
        <div style="display: flex; justify-content: space-between; margin: 5px 0; color: green;">
          <span>Coupon Discount:</span>
          <span>- $${order.discount.toFixed(2)}</span>
        </div>` : ''}
        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
          <span>Shipping Cost:</span>
          <span>$${order.shippingCost.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
          <span>Sales Tax:</span>
          <span>$${order.salesTaxAmount.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 10px 0; font-weight: bold; font-size: 18px; border-top: 1px solid #ddd; padding-top: 10px;">
          <span>Grand Total:</span>
          <span>$${order.grandTotal.toFixed(2)}</span>
        </div>
      </div>
      
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
}

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