"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/app/context/LanguageContext";

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams();
  const { language, translate } = useLanguage();

  const [order, setOrder] = useState<any | null>(null);
  const [translatedTexts, setTranslatedTexts] = useState<any>({
    thankYou: "Thank you for your order!",
    orderPlaced: "Your order has been successfully placed.",
    confirmationEmail:
      "A confirmation email with shipping and tracking information has been sent to",
    orderSummary: "Order Summary",
    orderID: "Order ID",
    orderDate: "Order Date",
    customer: "Customer",
    items: "Items",
    subtotal: "Subtotal",
    shipping: "Shipping",
    tax: "Tax",
    discount: "Discount",
    total: "Total",
    continueShopping: "Continue Shopping",
    viewOrder: "View Order",
    loadingOrder: "Loading your order...",
  });

  // Translate texts
  useEffect(() => {
    async function translateTexts() {
      setTranslatedTexts({
        thankYou: await translate("Thank you for your order!"),
        orderPlaced: await translate("Your order has been successfully placed."),
        confirmationEmail: await translate(
          "A confirmation email with shipping and tracking information has been sent to"
        ),
        orderSummary: await translate("Order Summary"),
        orderID: await translate("Order ID"),
        orderDate: await translate("Order Date"),
        customer: await translate("Customer"),
        items: await translate("Items"),
        subtotal: await translate("Subtotal"),
        shipping: await translate("Shipping"),
        tax: await translate("Tax"),
        discount: await translate("Discount"),
        total: await translate("Total"),
        continueShopping: await translate("Continue Shopping"),
        viewOrder: await translate("View Order"),
        loadingOrder: await translate("Loading your order..."),
      });
    }
    translateTexts();
  }, [language, translate]);

  // Fetch order data
  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) return;
      const res = await fetch(`/api/order/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder({
          id: data._id,
          date: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "",
          customer: {
            name: `${data.billingDetails.firstName} ${data.billingDetails.lastName}`,
            email: data.billingDetails.email,
          },
          items: (data.cartItems || []).map((item: any) => ({
            id: item.slug,
            name: item.name,
            qty: item.quantity,
            price: item.price ?? 0,
            mainImage: item.mainImage,
          })),
          subtotal: data.subtotal ?? 0,
          shippingCost: data.shippingCost ?? 0,
          salesTaxAmount: data.salesTaxAmount ?? 0,
          discount: data.discount ?? 0,
          total: data.grandTotal ?? 0,
        });
      } else {
        setOrder(null);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p>{translatedTexts.loadingOrder}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 mt-40">
      <div className="text-center">
        <CheckCircle className="mx-auto text-green-500 w-16 h-16" />
        <h1 className="text-3xl font-bold mt-4">{translatedTexts.thankYou}</h1>
        <p className="text-gray-600 mt-2">{translatedTexts.orderPlaced}</p>
        <p className="text-gray-500 mt-2">
          {translatedTexts.confirmationEmail}{" "}
          <a
            href={`mailto:${order.customer.email}`}
            className="text-blue-600 underline font-medium hover:text-blue-800"
          >
            {order.customer.email}
          </a>
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">{translatedTexts.orderSummary}</h2>
        <p>
          <span className="font-medium">{translatedTexts.orderID}:</span> {order.id}
        </p>
        <p>
          <span className="font-medium">{translatedTexts.orderDate}:</span> {order.date}
        </p>
        <p>
          <span className="font-medium">{translatedTexts.customer}:</span> {order.customer.name} (
          {order.customer.email})
        </p>

        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2">{translatedTexts.items}</h3>
          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {item.mainImage && (
                    <img
                      src={item.mainImage}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                  </div>
                </div>
                <span className="font-medium">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* ✅ Order Breakdown */}
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{translatedTexts.subtotal}:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{translatedTexts.shipping}:</span>
              <span>${order.shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{translatedTexts.tax}:</span>
              <span>${order.salesTaxAmount.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>{translatedTexts.discount}:</span>
                <span>- ${order.discount.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-6 text-lg font-bold border-t pt-2">
            <span>{translatedTexts.total}:</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Link
            href="/toyota"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            {translatedTexts.continueShopping}
          </Link>
          <Link
            href={`/order-confirmation/${order.id}`}
            className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg shadow hover:bg-gray-200"
          >
            {translatedTexts.viewOrder}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
