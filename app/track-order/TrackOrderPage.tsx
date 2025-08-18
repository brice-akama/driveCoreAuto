'use client';

import { useState, useEffect, FormEvent } from "react";
import { useLanguage } from "@/app/context/LanguageContext";

// Types for order items
interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

// Type for full order data
interface OrderData {
  orderNumber: string;
  date: string;
  shippingAddress: string;
  status: "placed" | "processing" | "shipped" | "out_for_delivery" | "delivered";
  items: OrderItem[];
  shippingCarrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
}

export default function TrackOrderPage() {
  const { translate, language } = useLanguage();

  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState("");

  // ✅ default English content
  const [translations, setTranslations] = useState({
    title: "Track Your Order",
    description:
      "To track your order, please enter your Order ID and Billing Email below, then press the \"Track\" button. This information was provided on your receipt and in your confirmation email.",
    orderIdLabel: "Order ID",
    billingEmailLabel: "Billing Email",
    trackButton: "Track",
    placeholderOrderId: "Found in your order confirmation",
    placeholderEmail: "Email you used during checkout",
    errorEmpty: "Please enter both Order ID and Billing Email.",
    errorNotFound: "Order not found.",
    errorGeneric: "Something went wrong. Please try again later.",
    orderSummaryTitle: "Order Summary",
    orderStatusTitle: "Order Status",
    itemsTitle: "Items",
    shippingDetailsTitle: "Shipping Details",
    carrierLabel: "Carrier:",
    trackingNumberLabel: "Tracking Number:",
    estimatedDeliveryLabel: "Estimated Delivery:",
    needHelp: "Need help? Contact Support",
    statusPlaced: "Placed",
    statusProcessing: "Processing",
    statusShipped: "Shipped",
    statusOutForDelivery: "Out for Delivery",
    statusDelivered: "Delivered"
  });

  // ✅ load translations async if user changes language
  useEffect(() => {
    const loadTranslations = async () => {
      if (language === "en") return; // already in English
      setTranslations({
        title: await translate("Track Your Order"),
        description: await translate(
          "To track your order, please enter your Order ID and Billing Email below, then press the \"Track\" button. This information was provided on your receipt and in your confirmation email."
        ),
        orderIdLabel: await translate("Order ID"),
        billingEmailLabel: await translate("Billing Email"),
        trackButton: await translate("Track"),
        placeholderOrderId: await translate("Found in your order confirmation"),
        placeholderEmail: await translate("Email you used during checkout"),
        errorEmpty: await translate("Please enter both Order ID and Billing Email."),
        errorNotFound: await translate("Order not found."),
        errorGeneric: await translate("Something went wrong. Please try again later."),
        orderSummaryTitle: await translate("Order Summary"),
        orderStatusTitle: await translate("Order Status"),
        itemsTitle: await translate("Items"),
        shippingDetailsTitle: await translate("Shipping Details"),
        carrierLabel: await translate("Carrier:"),
        trackingNumberLabel: await translate("Tracking Number:"),
        estimatedDeliveryLabel: await translate("Estimated Delivery:"),
        needHelp: await translate("Need help? Contact Support"),
        statusPlaced: await translate("Placed"),
        statusProcessing: await translate("Processing"),
        statusShipped: await translate("Shipped"),
        statusOutForDelivery: await translate("Out for Delivery"),
        statusDelivered: await translate("Delivered")
      });
    };

    loadTranslations();
  }, [language, translate]);

  const handleTrackOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setOrderData(null);

    if (!orderNumber.trim() || !email.trim()) {
      setError(translations.errorEmpty);
      return;
    }

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${orderNumber}&email=${email}`);
      const data = await res.json();

      if (res.ok) {
        setOrderData(data);
      } else {
        setError(data.message || translations.errorNotFound);
      }
    } catch {
      setError(translations.errorGeneric);
    }
  };

  const renderStatusStep = (label: string, active: boolean) => (
    <div className="flex items-center space-x-2">
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          active ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
        }`}
      >
        {active ? "✓" : ""}
      </div>
      <span className={active ? "font-semibold" : "text-gray-500"}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 mt-40">
      <h1 className="text-3xl font-bold mb-4 text-center">{translations.title}</h1>
      <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">{translations.description}</p>

      <form onSubmit={handleTrackOrder} className="flex flex-col gap-4 mb-8">
        <div>
          <label className="block font-medium text-sm mb-1">{translations.orderIdLabel}</label>
          <input
            type="text"
            placeholder={translations.placeholderOrderId}
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">{translations.billingEmailLabel}</label>
          <input
            type="email"
            placeholder={translations.placeholderEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-2 w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition self-start md:self-center"
        >
          {translations.trackButton}
        </button>
      </form>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {orderData && (
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{translations.orderSummaryTitle}</h2>
          <p><strong>Order Number:</strong> {orderData.orderNumber}</p>
          <p><strong>Order Date:</strong> {new Date(orderData.date).toLocaleDateString()}</p>
          <p><strong>Shipping To:</strong> {orderData.shippingAddress}</p>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">{translations.orderStatusTitle}</h3>
            <div className="flex space-x-6 justify-between max-w-md mx-auto">
              {renderStatusStep(translations.statusPlaced, ["placed","processing","shipped","out_for_delivery","delivered"].includes(orderData.status))}
              {renderStatusStep(translations.statusProcessing, ["processing","shipped","out_for_delivery","delivered"].includes(orderData.status))}
              {renderStatusStep(translations.statusShipped, ["shipped","out_for_delivery","delivered"].includes(orderData.status))}
              {renderStatusStep(translations.statusOutForDelivery, ["out_for_delivery","delivered"].includes(orderData.status))}
              {renderStatusStep(translations.statusDelivered, orderData.status === "delivered")}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">{translations.itemsTitle}</h3>
            <ul>
              {orderData.items.map((item) => (
                <li key={item.id} className="flex items-center space-x-4 mb-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>${item.price.toFixed(2)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">{translations.shippingDetailsTitle}</h3>
            <p><strong>{translations.carrierLabel}</strong> {orderData.shippingCarrier}</p>
            <p><strong>{translations.trackingNumberLabel}</strong> {orderData.trackingNumber}</p>
            <p><strong>{translations.estimatedDeliveryLabel}</strong> {new Date(orderData.estimatedDelivery).toLocaleDateString()}</p>
          </div>

          <div className="mt-6 text-center">
            <a href="/contact" className="text-blue-600 underline hover:text-blue-800">{translations.needHelp}</a>
          </div>
        </div>
      )}
    </div>
  );
}
