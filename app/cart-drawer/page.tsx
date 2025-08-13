
"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import CartProduct from "../components/CartProduct";



const CartPage: React.FC = () => {
  const { cartItems, totalPrice, removeFromCart, updateQuantity } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0); // You can later extend logic to apply real discounts
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [salesTax, setSalesTax] = useState(0);
  

  // Initialize quantities when cart items change
  useEffect(() => {
    const initialQuantities = cartItems.reduce((acc, item) => {
      acc[item.slug] = item.quantity || 1;
      return acc;
    }, {} as { [key: string]: number });
    setQuantities(initialQuantities);

    // Calculate sales tax (example 7%)
    const tax = totalPrice * 0.07;
    setSalesTax(tax);
  }, [cartItems, totalPrice]);

  const handleQuantityChange = (slug: string, change: number) => {
    const newQuantity = (quantities[slug] || 1) + change;
    if (newQuantity >= 1) {
      setQuantities((prev) => ({ ...prev, [slug]: newQuantity }));
      updateQuantity(slug, newQuantity);
    }
  };

  // Placeholder: Shipping calculator (you can replace with your logic)
  const calculateShipping = () => {
    // Example flat rate or free shipping logic
    const shipping = 25.0;
    setShippingCost(shipping);
  };

  // Placeholder: Apply coupon logic
  const applyCoupon = () => {
    if (couponCode.trim().toLowerCase() === "save10") {
      // Example: 10% discount
      setDiscount(totalPrice * 0.1);
    } else {
      setDiscount(0);
      alert("Invalid coupon code");
    }
  };

  const subtotal = totalPrice;
  const total = subtotal + (shippingCost || 0) + salesTax - discount;

  // ...imports and hooks stay the same

return (
  <div className="container mx-auto p-4 mt-40">
    <h2 className="text-2xl font-bold text-center mt-10">Your Cart</h2>

    {cartItems.length === 0 ? (
      <div className="text-center mt-6">
        <p>Your cart is empty. Go back to shopping!</p>
        <Link href="/toyota" className="mt-4 text-blue-600">
          Continue Shopping
        </Link>
      </div>
    ) : (
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side: Cart Items and Coupon */}
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
                  className="object-cover"
                />

                <div className="flex-1 px-4 w-full md:w-auto">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>

                  <div className="flex items-center space-x-3 mt-2">
                    <button
                      onClick={() => handleQuantityChange(item.slug, -1)}
                      className="px-3 py-1 border border-gray-400 rounded disabled:opacity-50"
                      disabled={quantities[item.slug] <= 1}
                    >
                      -
                    </button>
                    <span className="font-semibold">{quantities[item.slug]}</span>
                    <button
                      onClick={() => handleQuantityChange(item.slug, 1)}
                      className="px-3 py-1 border border-gray-400 rounded"
                    >
                      +
                    </button>
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
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Coupon Input below the product list */}
          <div className="mt-8 mb-6 max-w-md">
            <label htmlFor="coupon" className="block mb-1 font-semibold">
              Coupon
            </label>
            <div className="flex">
              <input
                id="coupon"
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 px-3 py-2 border border-gray-400 rounded-l focus:outline-none"
              />
              <button
                onClick={applyCoupon}
                className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
            {discount > 0 && (
              <p className="text-green-600 mt-2">
                Coupon applied! You saved ${discount.toFixed(2)}.
              </p>
            )}
          </div>
        </div>

         
       
 
        {/* Right side: Cart Totals */}
        <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-xl mb-6">Cart Totals</h3>

          {/* Subtotal */}
          <div className="flex justify-between mb-3">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between mb-3">
            <span>Shipping</span>
            {shippingCost === null ? (
              <button
                className="text-red-600 underline"
                onClick={calculateShipping}
              >
                Calculate shipping
              </button>
            ) : (
              <span>${shippingCost.toFixed(2)}</span>
            )}
          </div>

          {/* Sales Tax */}
          <div className="flex justify-between mb-3">
            <span>Sales Tax</span>
            <span>${salesTax.toFixed(2)}</span>
          </div>

          {/* Total */}
          <div className="flex justify-between font-bold text-xl border-t pt-4">
            <span>Total</span>
            <span>${total.toFixed(2)} USD</span>
          </div>

          {/* Checkout Button */}
          <Link
            href="/checkout"
            className="block mt-6 bg-blue-600 text-white whitespace-nowrap text-center py-3 rounded hover:bg-blue-700"
          >
            PROCEED TO CHECKOUT
          </Link>
        </div>
      </div>
    )}
    
    <CartProduct />
  </div>
);
}

export default CartPage;
