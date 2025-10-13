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
  paymentMethod,
  billingDetails,
  shippingDetails,
  discount = 0,
  shippingCost = 0,
  salesTaxAmount = 0
} = body;

// Recalculate subtotal exactly like frontend
const subtotal = cartItems.reduce((acc: number, item: any) => {
  const priceNum = typeof item.price === 'string' 
    ? parseFloat(item.price) 
    : item.price;
  return acc + priceNum * item.quantity;
}, 0);

// Ensure all values are numbers
const discountNum = typeof discount === 'string' ? parseFloat(discount) : (discount || 0);
const shippingNum = typeof shippingCost === 'string' ? parseFloat(shippingCost) : (shippingCost || 0);
const taxNum = typeof salesTaxAmount === 'string' ? parseFloat(salesTaxAmount) : (salesTaxAmount || 0);

const grandTotal = subtotal + shippingNum + taxNum - discountNum;

// Optional: validate grandTotal is positive
if (grandTotal < 0) {
  return NextResponse.json({ error: "Invalid order total" }, { status: 400 });
}

    // --- Basic validation ---
    if (!cartItems || cartItems.length === 0)
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    // Removed totalPrice check because grandTotal is recalculated on backend
        if (grandTotal <= 0)
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
  subtotal: parseFloat(subtotal.toFixed(2)),        // ✅ recalculated
  discount: parseFloat(discountNum.toFixed(2)),
  shippingCost: parseFloat(shippingNum.toFixed(2)),
  salesTaxAmount: parseFloat(taxNum.toFixed(2)),
  grandTotal: parseFloat(grandTotal.toFixed(2)),    // ✅ recalculated
  status: "pending",
  createdAt: new Date()
};

    const orderResult = await db.collection("orders").insertOne(order);

    // --- Select language ---
    const lang = billingDetails.language || "en";
    const t = translations[lang];

    // --- Client email ---
    
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
  <div style="max-width: 700px; margin: 0 auto; font-family: Arial, sans-serif; color: #333; background: #f8fafc;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 25px 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px; font-weight: bold;">🚨 NEW ORDER ALERT</h1>
      <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">DriveCore Auto - Internal Notification</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 25px 20px; border: 1px solid #e5e7eb; border-top: none;">
      
      <!-- Order Header Info -->
      <div style="background: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; padding: 20px; margin-bottom: 25px; text-align: center;">
        <h2 style="color: #991b1b; margin: 0 0 8px 0; font-size: 22px;">Order #${orderResult.insertedId}</h2>
        <p style="margin: 0; color: #7f1d1d; font-size: 16px;">Received: ${new Date().toLocaleString()}</p>
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #fca5a5;">
          <p style="margin: 0; font-size: 20px; font-weight: bold; color: #991b1b;">💰 TOTAL: $${order.grandTotal.toFixed(2)}</p>
        </div>
      </div>

      <!-- Customer Information -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0;">
        
        <!-- Customer Details -->
        <div style="background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px; padding: 20px;">
          <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 16px; border-bottom: 2px solid #7dd3fc; padding-bottom: 8px;">👤 CUSTOMER INFO</h3>
          <p style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px; color: #1e40af;">${sanitizedBilling.firstName} ${sanitizedBilling.lastName}</p>
          <p style="margin: 0 0 8px 0; color: #1e40af;">📧 <a href="mailto:${sanitizedBilling.email}" style="color: #1e40af; text-decoration: none;">${sanitizedBilling.email}</a></p>
          <p style="margin: 0 0 8px 0; color: #1e40af;">📞 ${sanitizedBilling.phone || "Not provided"}</p>
          <p style="margin: 0; color: #1e40af;">💳 ${paymentMethod.toUpperCase()}</p>
        </div>

        <!-- Quick Actions -->
        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px;">
          <h3 style="color: #14532d; margin: 0 0 15px 0; font-size: 16px; border-bottom: 2px solid #86efac; padding-bottom: 8px;">⚡ QUICK ACTIONS</h3>
          <div style="margin: 8px 0;">
            <button style="background: #16a34a; color: white; border: none; padding: 8px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">✅ Confirm Payment</button>
          </div>
          <div style="margin: 8px 0;">
            <button style="background: #0891b2; color: white; border: none; padding: 8px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">📦 Prepare Shipping</button>
          </div>
          <div style="margin: 8px 0;">
            <button style="background: #7c3aed; color: white; border: none; padding: 8px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">📧 Contact Customer</button>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div style="margin: 25px 0;">
        <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">📋 ORDER ITEMS</h3>
        <div style="background: #f9fafb; border-radius: 8px; overflow: hidden;">
          <div style="background: #e5e7eb; padding: 12px 20px; font-weight: bold; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 10px;">
            <span>Product</span>
            <span style="text-align: center;">Price</span>
            <span style="text-align: center;">Qty</span>
            <span style="text-align: right;">Total</span>
          </div>
          ${cartItems.map((item: { name: any; slug: any; price: number; quantity: number; }, index: number) => `
          <div style="padding: 15px 20px; border-bottom: 1px solid #e5e7eb; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 10px; align-items: center; ${index % 2 === 0 ? 'background: #ffffff;' : 'background: #f9fafb;'}">
            <div>
              <p style="margin: 0; font-weight: bold; color: #111827;">${item.name}</p>
              <p style="margin: 2px 0 0 0; color: #6b7280; font-size: 12px;">SKU: ${item.slug || 'N/A'}</p>
            </div>
            <p style="margin: 0; text-align: center;">$${item.price.toFixed(2)}</p>
            <p style="margin: 0; text-align: center; font-weight: bold;">${item.quantity}</p>
            <p style="margin: 0; text-align: right; font-weight: bold; color: #16a34a;">$${(item.price * item.quantity).toFixed(2)}</p>
          </div>`).join('')}
        </div>
      </div>

      <!-- Financial Breakdown -->
      <div style="margin: 25px 0;">
        <h3 style="color: #1e3a8a; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">💰 FINANCIAL BREAKDOWN</h3>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <div style="display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="font-weight: 500;">Subtotal:</span>
                <span>$${order.subtotal.toFixed(2)}</span>
              </div>
              ${order.discount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #16a34a; font-weight: bold;">
                <span>Discount Applied:</span>
                <span>-$${order.discount.toFixed(2)}</span>
              </div>` : ''}
              <div style="display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="font-weight: 500;">Shipping Cost:</span>
                <span>$${order.shippingCost.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="font-weight: 500;">Sales Tax (7%):</span>
                <span>$${order.salesTaxAmount.toFixed(2)}</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; justify-content: center; background: #fee2e2; border-radius: 8px; padding: 20px;">
              <div style="text-align: center;">
                <p style="margin: 0 0 5px 0; font-size: 14px; color: #7f1d1d;">GRAND TOTAL</p>
                <p style="margin: 0; font-size: 28px; font-weight: bold; color: #991b1b;">$${order.grandTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Addresses -->
      <div style="display: grid; grid-template-columns: 1fr ${sanitizedShipping ? '1fr' : ''}; gap: 20px; margin: 25px 0;">
        
        <!-- Billing Address -->
        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px;">
          <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 16px; border-bottom: 2px solid #f59e0b; padding-bottom: 8px;">🏢 BILLING ADDRESS</h3>
          <p style="margin: 0 0 5px 0; font-weight: bold; color: #92400e;">${sanitizedBilling.firstName} ${sanitizedBilling.lastName}</p>
          <p style="margin: 0 0 3px 0; color: #92400e;">${sanitizedBilling.address1 || ""} ${sanitizedBilling.address2 || ""}</p>
          <p style="margin: 0 0 3px 0; color: #92400e;">${sanitizedBilling.city || ""}, ${sanitizedBilling.state || ""} ${sanitizedBilling.postalCode || ""}</p>
          <p style="margin: 0; color: #92400e;">${sanitizedBilling.country || ""}</p>
        </div>

        ${sanitizedShipping ? `
        <!-- Shipping Address -->
        <div style="background: #dbeafe; border: 1px solid #60a5fa; border-radius: 8px; padding: 20px;">
          <h3 style="color: #1d4ed8; margin: 0 0 15px 0; font-size: 16px; border-bottom: 2px solid #60a5fa; padding-bottom: 8px;">🚚 SHIPPING ADDRESS</h3>
          <p style="margin: 0 0 5px 0; font-weight: bold; color: #1d4ed8;">${sanitizedShipping.firstName} ${sanitizedShipping.lastName}</p>
          <p style="margin: 0 0 3px 0; color: #1d4ed8;">${sanitizedShipping.address1 || ""} ${sanitizedShipping.address2 || ""}</p>
          <p style="margin: 0 0 3px 0; color: #1d4ed8;">${sanitizedShipping.city || ""}, ${sanitizedShipping.state || ""} ${sanitizedShipping.postalCode || ""}</p>
          <p style="margin: 0; color: #1d4ed8;">${sanitizedShipping.country || ""}</p>
        </div>` : ''}
      </div>

      <!-- Action Required -->
      <div style="background: #fef2f2; border: 2px solid #fca5a5; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
        <h3 style="margin: 0 0 10px 0; color: #991b1b; font-size: 18px;">⚠️ ACTION REQUIRED</h3>
        <p style="margin: 0 0 15px 0; color: #7f1d1d;">This order is pending payment confirmation. Please process and update the order status.</p>
        <div style="margin-top: 15px;">
          <p style="margin: 0; font-size: 14px; color: #991b1b;">Order Status: <strong>PENDING PAYMENT</strong></p>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
      <p style="margin: 0 0 10px 0; font-weight: bold;">DriveCore Auto - Order Management System</p>
      <p style="margin: 0; opacity: 0.8; font-size: 14px;">Internal Use Only • Generated ${new Date().toLocaleString()}</p>
    </div>

  </div>
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