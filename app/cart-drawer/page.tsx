'use client';

import React, { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import CartProduct from "../components/CartProduct";
import Breadcrumb from "../components/Breadcrumbs";
import { useLanguage } from "../context/LanguageContext";

const CartPage: React.FC = () => {
  const { cartItems, totalPrice, removeFromCart, updateQuantity } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [showShippingWarning, setShowShippingWarning] = useState(false);
  

  const { language, translate } = useLanguage();

  const [labels, setLabels] = useState({
    shoppingCart: "Shopping cart",
    yourCart: "Your Cart",
    emptyCart: "Your cart is empty. Go back to shopping!",
    continueShopping: "Continue Shopping",
    price: "Price",
    remove: "Remove",
    coupon: "Coupon",
    enterCoupon: "Enter coupon code",
    apply: "Apply",
    couponApplied: "Coupon applied! You saved",
    cartTotals: "Cart Totals",
    subtotal: "Subtotal",
    shipping: "Shipping",
    calculateShipping: "Calculate shipping",
    salesTax: "Sales Tax",
    total: "Total",
    proceedToCheckout: "PROCEED TO CHECKOUT",
    shippingWarning: "Please calculate your shipping cost before proceeding to checkout.",
    shippingDisclaimer: "Final shipping cost may vary depending on location. If actual shipping differs, we’ll contact you before processing payment.",
    
  });

  // Load translations
  useEffect(() => {
    async function loadTranslations() {
      setLabels({
        shoppingCart: await translate("Shopping cart"),
        yourCart: await translate("Your Cart"),
        emptyCart: await translate("Your cart is empty. Go back to shopping!"),
        continueShopping: await translate("Continue Shopping"),
        price: await translate("Price"),
        remove: await translate("Remove"),
        coupon: await translate("Coupon"),
        enterCoupon: await translate("Enter coupon code"),
        apply: await translate("Apply"),
        couponApplied: await translate("Coupon applied! You saved"),
        cartTotals: await translate("Cart Totals"),
        subtotal: await translate("Subtotal"),
        shipping: await translate("Shipping"),
        calculateShipping: await translate("Calculate shipping"),
        salesTax: await translate("Sales Tax"),
        total: await translate("Total"),
        proceedToCheckout: await translate("PROCEED TO CHECKOUT"),
        shippingDisclaimer: await translate(
      "Final shipping cost may vary depending on location. If actual shipping differs, we’ll contact you before processing payment.",
    ),
    shippingWarning: await translate(
  "Please calculate your shipping cost before proceeding to checkout."
),

      });
    }
    loadTranslations();
  }, [translate]);

  // Initialize quantities
  useEffect(() => {
    const initialQuantities = cartItems.reduce((acc, item) => {
      acc[item.slug] = item.quantity || 1;
      return acc;
    }, {} as { [key: string]: number });
    setQuantities(initialQuantities);
  }, [cartItems]);

  // Hide warning automatically when shipping is calculated
useEffect(() => {
  if (shippingCost !== null) {
    setShowShippingWarning(false);
  }
}, [shippingCost]);

  // Recalculate subtotal, tax, and total whenever quantities change
  const subtotal = cartItems.reduce((acc, item) => {
  const qty = quantities[item.slug] || 1;
  return acc + item.price * qty;
}, 0);

const salesTaxAmount = subtotal * 0.07;
const total = subtotal + (shippingCost || 0) + salesTaxAmount - discount;


  // Quantity handlers
  const handleQuantityChange = (slug: string, change: number) => {
    const newQuantity = (quantities[slug] || 1) + change;
    if (newQuantity >= 1) {
      setQuantities((prev) => ({ ...prev, [slug]: newQuantity }));
      updateQuantity(slug, newQuantity);
    }
  };

  const calculateShipping = () => {
  if (subtotal > 2000) {
    setShippingCost(200); // heavy items like engines
  } else if (subtotal > 500) {
    setShippingCost(100); // smaller transmissions
  } else {
    setShippingCost(50);  // small parts
  }
};


  // Coupon application
  // Coupon application
const applyCoupon = async () => {
  if (!couponCode) return;

  try {
    const response = await fetch("/api/cart/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ couponCode }),
    });

    const data = await response.json();

    if (data.success) {
      setDiscount(data.cart.discount || 0);
      alert(`Coupon applied! You saved $${data.cart.discount?.toFixed(2) || 0}`);
    } else {
      setDiscount(0);
      // Show server message (like minOrderValue requirement)
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    setDiscount(0);
    alert("Error applying coupon. Please try again.");
  }
};




  return (
    <div className="mt-20 lg:mt-40">
      <div className="bg-black text-white py-8 text-center w-full">
        <h1 className="text-4xl font-black">{labels.shoppingCart}</h1>
        <Breadcrumb />
        
      </div>

      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold text-center">{labels.yourCart}</h2>

        {cartItems.length === 0 ? (
          <div className="text-center mt-6">
            <p>{labels.emptyCart}</p>
            <Link href="/toyota" className="mt-4 text-blue-600">
              {labels.continueShopping}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left side: Cart Items */}
            <div className="flex-1">
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li
                    key={item.slug}
                    className="flex flex-col md:flex-row justify-between items-center border-b py-4"
                  >
                    <Image
                      src={item.mainImage}
                      alt={item.name}
                      width={100}
                      height={100}
                      unoptimized
                      className="object-cover"
                    />

                    <div className="flex-1 px-4 w-full md:w-auto">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">{labels.price}: ${item.price.toFixed(2)}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item.slug, -1)}
                          className="px-3 py-1 border border-gray-400 rounded disabled:opacity-50"
                          disabled={quantities[item.slug] <= 1}
                        >-</button>
                        <span className="font-semibold">{quantities[item.slug]}</span>
                        <button
                          onClick={() => handleQuantityChange(item.slug, 1)}
                          className="px-3 py-1 border border-gray-400 rounded"
                        >+</button>
                      </div>
                    </div>

                    <div className="text-right mt-2 md:mt-0">
                      <span className="font-semibold">
                        ${(item.price * quantities[item.slug]).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.slug)}
                        className="ml-4 text-red-500 hover:text-red-700 block md:inline"
                      >
                        {labels.remove}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Coupon Input */}
              <div className="mt-8 mb-6 max-w-md">
                <label htmlFor="coupon" className="block mb-1 font-semibold">{labels.coupon}</label>
                <div className="flex">
                  <input
                    id="coupon"
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={labels.enterCoupon}
                    className="flex-1 px-3 py-2 border border-gray-400 rounded-l focus:outline-none"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
                  >
                    {labels.apply}
                  </button>
                </div>
                {discount > 0 && (
                  <p className="text-green-600 mt-2">{labels.couponApplied} ${discount.toFixed(2)}.</p>
                )}
              </div>
            </div>

            {/* Right side: Cart Totals */}
            <div className="w-full md:w-2/3 lg:w-1/3 bg-white p-6 rounded-lg shadow-md">

              <h3 className="font-bold text-xl mb-6">{labels.cartTotals}</h3>

              <div className="flex justify-between mb-3">
                <span>{labels.subtotal}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-3">
                <span>{labels.shipping}</span>
                {shippingCost === null ? (
                  <button className="text-red-600 underline" onClick={calculateShipping}>
                    {labels.calculateShipping}
                  </button>
                ) : (
                  <span>${shippingCost.toFixed(2)}</span>
                )}
              </div>
              {/* Shipping disclaimer */}
{shippingCost !== null && (
  <p className="text-sm text-gray-600 mt-1">
    {labels.shippingDisclaimer}
  </p>
)}

              <div className="flex justify-between mb-3">
                <span>{labels.salesTax}</span>
                <span>${salesTaxAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-bold text-xl border-t pt-4">
                <span>{labels.total}</span>
                <span>${total.toFixed(2)} USD</span>
              </div>

             {/* Proceed to Checkout Button */}
<div className="relative">
  <Link
    href={shippingCost === null ? "#" : `/${language}/checkout`}

    className={`block mt-6 text-white text-center py-3 rounded font-semibold transition-colors
      ${shippingCost === null 
        ? "bg-gray-400 cursor-not-allowed border border-red-500" 
        : "bg-blue-600 hover:bg-blue-700"}`
    }
    onClick={(e) => {
      if (shippingCost === null) e.preventDefault();
    }}
  >
    {labels.proceedToCheckout}
  </Link>

  {/* Always visible warning on mobile/small screens */}
  {shippingCost === null && (
  <p className="mt-2 text-red-600 text-sm md:hidden flex items-center">
    ⚠️ {labels.shippingWarning}
  </p>
)}


  {/* Visible on medium+ screens when hovering */}
  {shippingCost === null && (
    <p className="mt-2 text-red-600 text-sm hidden md:block">
      ⚠️ {labels.shippingWarning}
    </p>
  )}
</div>



{/* Inline message below the button */}
{showShippingWarning && (
  <p className="mt-2 text-red-600 text-sm font-semibold">
    {labels.shippingWarning}
  </p>
)}


            </div>
          </div>
        )}

        <CartProduct />
      </div>
    </div>
  );
};

export default CartPage;
// The above code defines a React component for a shopping cart page with features like quantity adjustment, coupon application, shipping calculation, and total cost display.