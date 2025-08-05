'use client';

import { useState, FormEvent } from "react";

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
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState("");

  const handleTrackOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setOrderData(null);

    if (!orderNumber.trim() || !email.trim()) {
      setError("Please enter both Order ID and Billing Email.");
      return;
    }

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${orderNumber}&email=${email}`);
      const data = await res.json();

      if (res.ok) {
        setOrderData(data);
      } else {
        setError(data.message || "Order not found.");
      }
    } catch {
      setError("Something went wrong. Please try again later.");
    }
  };

  const renderStatusStep = (label: string, active: boolean) => (
    <div className="flex items-center space-x-2">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${active ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
        {active ? "✓" : ""}
      </div>
      <span className={active ? "font-semibold" : "text-gray-500"}>{label}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 mt-40">
      <h1 className="text-3xl font-bold mb-4 text-center">Track Your Order</h1>
      <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
        To track your order, please enter your <strong>Order ID</strong> and <strong>Billing Email</strong> below, then press the <strong>"Track"</strong> button. 
        This information was provided on your receipt and in your confirmation email.
      </p>

      <form onSubmit={handleTrackOrder} className="flex flex-col gap-4 mb-8">
        <div>
          <label className="block font-medium text-sm mb-1">Order ID</label>
          <input
            type="text"
            placeholder="Found in your order confirmation"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium text-sm mb-1">Billing Email</label>
          <input
            type="email"
            placeholder="Email you used during checkout"
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
          Track 
        </button>
      </form>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {orderData && (
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <p><strong>Order Number:</strong> {orderData.orderNumber}</p>
          <p><strong>Order Date:</strong> {new Date(orderData.date).toLocaleDateString()}</p>
          <p><strong>Shipping To:</strong> {orderData.shippingAddress}</p>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Order Status</h3>
            <div className="flex space-x-6 justify-between max-w-md mx-auto">
              {renderStatusStep("Placed", ["placed", "processing", "shipped", "out_for_delivery", "delivered"].includes(orderData.status))}
              {renderStatusStep("Processing", ["processing", "shipped", "out_for_delivery", "delivered"].includes(orderData.status))}
              {renderStatusStep("Shipped", ["shipped", "out_for_delivery", "delivered"].includes(orderData.status))}
              {renderStatusStep("Out for Delivery", ["out_for_delivery", "delivered"].includes(orderData.status))}
              {renderStatusStep("Delivered", orderData.status === "delivered")}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Items</h3>
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
            <h3 className="font-semibold mb-2">Shipping Details</h3>
            <p><strong>Carrier:</strong> {orderData.shippingCarrier}</p>
            <p><strong>Tracking Number:</strong> {orderData.trackingNumber}</p>
            <p><strong>Estimated Delivery:</strong> {new Date(orderData.estimatedDelivery).toLocaleDateString()}</p>
          </div>

          <div className="mt-6 text-center">
            <a href="/contact" className="text-blue-600 underline hover:text-blue-800">Need help? Contact Support</a>
          </div>
        </div>
      )}
    </div>
  );
}
