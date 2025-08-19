"use client";

import { useState, FormEvent, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import Link from "next/link";

interface Props {
  initialLanguage?: string;
  initialTranslations?: Record<string, any>;
}

// Types
interface OrderItem { id: string; name: string; image: string; quantity: number; price: number; }
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

const TrackOrderPage = ({ initialLanguage, initialTranslations }: Props) => {
  const { language, translations, setLanguage } = useLanguage();

  // Set initial SSR language
  useEffect(() => {
    if (initialLanguage) setLanguage(initialLanguage, "track-order");
  }, [initialLanguage, setLanguage]);

  const t = translations || initialTranslations || {};

  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState("");

  const handleTrackOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setOrderData(null);

    if (!orderNumber.trim() || !email.trim()) {
      setError(t?.errorEmpty || "Please enter both Order ID and Billing Email.");
      return;
    }

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${orderNumber}&email=${email}`);
      const data = await res.json();
      if (res.ok) setOrderData(data);
      else setError(data.message || t?.errorNotFound);
    } catch {
      setError(t?.errorGeneric);
    }
  };

  const renderStatusStep = (label: string, active: boolean) => (
    <div className="flex items-center space-x-2">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${active ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"}`}>
        {active ? "✓" : ""}
      </div>
      <span className={active ? "font-semibold" : "text-gray-500"}>{label}</span>
    </div>
  );

  if (!t.title) return null; // wait for translations

  return (
    <div className="max-w-4xl mx-auto p-6 mt-40">
      <h1 className="text-3xl font-bold mb-4 text-center">{t.title}</h1>
      <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">{t.description}</p>

      <form onSubmit={handleTrackOrder} className="flex flex-col gap-4 mb-8">
        <div>
          <label className="block font-medium text-sm mb-1">{t.orderIdLabel}</label>
          <input
            type="text"
            placeholder={t.placeholderOrderId}
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">{t.billingEmailLabel}</label>
          <input
            type="email"
            placeholder={t.placeholderEmail}
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
          {t.trackButton}
        </button>
      </form>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {orderData && (
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">{t.orderSummaryTitle}</h2>
          <p><strong>Order Number:</strong> {orderData.orderNumber}</p>
          <p><strong>Order Date:</strong> {new Date(orderData.date).toLocaleDateString()}</p>
          <p><strong>Shipping To:</strong> {orderData.shippingAddress}</p>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">{t.orderStatusTitle}</h3>
            <div className="flex space-x-6 justify-between max-w-md mx-auto">
              {renderStatusStep(t.statusPlaced, ["placed","processing","shipped","out_for_delivery","delivered"].includes(orderData.status))}
              {renderStatusStep(t.statusProcessing, ["processing","shipped","out_for_delivery","delivered"].includes(orderData.status))}
              {renderStatusStep(t.statusShipped, ["shipped","out_for_delivery","delivered"].includes(orderData.status))}
              {renderStatusStep(t.statusOutForDelivery, ["out_for_delivery","delivered"].includes(orderData.status))}
              {renderStatusStep(t.statusDelivered, orderData.status === "delivered")}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">{t.itemsTitle}</h3>
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
            <h3 className="font-semibold mb-2">{t.shippingDetailsTitle}</h3>
            <p><strong>{t.carrierLabel}</strong> {orderData.shippingCarrier}</p>
            <p><strong>{t.trackingNumberLabel}</strong> {orderData.trackingNumber}</p>
            <p><strong>{t.estimatedDeliveryLabel}</strong> {new Date(orderData.estimatedDelivery).toLocaleDateString()}</p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/contact" className="text-blue-600 underline hover:text-blue-800">{t.needHelp}</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
