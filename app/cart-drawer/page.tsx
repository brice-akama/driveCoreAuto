
"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext"; // Ensure the path is correct
import Image from "next/image";
import Link from "next/link";

const CartPage: React.FC = () => {
  const { cartItems, totalPrice, removeFromCart, updateQuantity } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const initialQuantities = cartItems.reduce((acc, item) => {
      acc[item.slug] = item.quantity || 1;
      return acc;
    }, {} as { [key: string]: number });
    setQuantities(initialQuantities);
  }, [cartItems]);

  const handleQuantityChange = (slug: string, change: number) => {
    const newQuantity = (quantities[slug] || 1) + change;
    if (newQuantity >= 1) {
      setQuantities((prev) => ({ ...prev, [slug]: newQuantity }));
      updateQuantity(slug, change); // Update global state
    }
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      <h2 className="text-2xl font-bold text-center mt-20">Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center mt-6">
          <p>Your cart is empty. Go back to shopping!</p>
          <Link href="/shop" className="mt-4 text-blue-600">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div>
          <ul>
            {cartItems.map((item) => (
              <li key={item.slug} className="flex justify-between items-center border-b py-4">
                <Image
                  src={item.mainImage}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="object-cover"
                />

                <div className="flex-1 px-4">
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

                <div className="text-right">
                  <span className="font-semibold">
  ${(item.price * quantities[item.slug]).toFixed(2)}
</span>

                  <button
                    onClick={() => removeFromCart(item.slug)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="font-bold text-xl mt-6">
            Total: ${totalPrice.toFixed(2)}
          </h3>
          <Link
            href="/checkout"
            className="block mt-4 bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
          >
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartPage;