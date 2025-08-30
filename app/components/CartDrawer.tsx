"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext"; // Adjust the path as necessary
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

const CartDrawer: React.FC = () => {
  const { cartItems, totalPrice, removeFromCart, updateQuantity: contextUpdateQuantity, isCartOpen, closeCart } = useCart();
  const [quantities, setQuantities] = useState<{ [slug: string]: number }>({});
  const router = useRouter();
  const { language, translate } = useLanguage();


  // Initialize quantities when the cart items change
  useEffect(() => {
    const initialQuantities = cartItems.reduce((acc, item) => {
      // Use a language-specific slug (e.g., 'en') as key
      acc[item.slug] = item.quantity || 1;
      return acc;
    }, {} as { [slug: string]: number });
    setQuantities(initialQuantities);
  }, [cartItems]);

  const handleViewCartClick = () => {
  closeCart();
  router.push("/cart-drawer");
};

const [translatedTexts, setTranslatedTexts] = useState({
  yourCart: "Your Cart",
  emptyCartMessage: "Your cart is empty, continue shopping.",
  continueShopping: "Continue Shopping",
  remove: "Remove",
  total: "Total",
  viewCart: "View Cart",
  checkout: "Checkout",
});

useEffect(() => {
  async function translateTexts() {
    const yourCart = await translate("Your Cart");
    const emptyCartMessage = await translate("Your cart is empty, continue shopping.");
    const continueShopping = await translate("Continue Shopping");
    const remove = await translate("Remove");
    const total = await translate("Total");
    const viewCart = await translate("View Cart");
    const checkout = await translate("Checkout");

    setTranslatedTexts({
      yourCart,
      emptyCartMessage,
      continueShopping,
      remove,
      total,
      viewCart,
      checkout,
    });
  }

  translateTexts();
}, [language, translate]);


  // Update the quantity and recalculate the total price
  const updateQuantity = (slug: string, value: number) => {
  setQuantities((prev) => {
    const newQuantity = Math.max(1, (prev[slug] || 1) + value);

    // Update backend + global cart state
    contextUpdateQuantity(slug, newQuantity /*, pass language here if needed */);

    return { ...prev, [slug]: newQuantity };
  });
};

  // Function to handle closing the cart when a link is clicked
  const handleLinkClick = () => {
    closeCart();
  };

  if (!isCartOpen) return null;

  return (
    <div
      id="cart-drawer"
      className="fixed right-0 top-0 w-80 bg-white shadow-lg h-full p-4 z-20 overflow-hidden"
    >
      {/* Close Button */}
      <button onClick={closeCart} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl">
        ✖
      </button>

      <h2 className="text-xl font-bold mt-20 text-center">{translatedTexts.yourCart}</h2>

      {cartItems.length === 0 ? (
        <div className="text-center mt-6">
          <p>{translatedTexts.emptyCartMessage}</p>
          <Link href="/shop" className="block bg-blue-600 text-white text-center py-2 rounded mt-10" onClick={handleLinkClick}>
            {translatedTexts.continueShopping}
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          {/* Scrollable Cart Items */}
          <div className="h-72 overflow-y-auto">
            <ul>
              {cartItems.map((item, index) => {
                const slugKey = item.slug; // language-specific slug key
                const itemQuantity = quantities[slugKey] || 1;
                const itemTotalPrice = (item.price * itemQuantity).toFixed(2);

                return (
                  <React.Fragment key={slugKey}>
<li className="flex items-start space-x-4 my-4">
  <Image
    src={item.mainImage}
    alt={item.name}
    width={64}
    height={64}
    unoptimized
    className="object-cover flex-shrink-0 mt-5"
  />
  <div className="flex-1 flex flex-col">
    {/* Product Name */}
    <h3 className="text-sm font-semibold leading-tight mb-1 break-words">
      {item.name}
    </h3>

    {/* Price */}
    <span className="text-base font-bold mb-2">
      ${(item.price * itemQuantity).toFixed(2)}
    </span>

    {/* Quantity controls */}
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-3">
        <button
          className="bg-gray-200 rounded px-3 py-1"
          onClick={() => updateQuantity(slugKey, -1)}
        >
          -
        </button>
        <span className="text-lg font-bold">{itemQuantity}</span>
        <button
          className="bg-gray-200 rounded px-3 py-1"
          onClick={() => updateQuantity(slugKey, 1)}
        >
          +
        </button>
      </div>

      {/* Remove button below */}
      <button
        onClick={() => removeFromCart(slugKey)}
        className="text-red-500 underline text-sm self-start"
      >
        {translatedTexts.remove}
      </button>
    </div>
  </div>
</li>


                    {/* Add a horizontal line except after the last item */}
                    {index < cartItems.length - 1 && <hr className="my-3 border-t border-gray-300 opacity-50" />}
                  </React.Fragment>
                );
              })}
            </ul>
          </div>

          {/* Total and Buttons */}
          
          <div className="mt-10 text-center">
  <h3 className="font-bold">
    Total: ${cartItems.reduce(
      (acc, item) => acc + item.price * (quantities[item.slug] || 1),
      0
    ).toFixed(2)}
  </h3>
  <button
    onClick={handleViewCartClick}
    className="mt-4 w-full bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
  >
    {translatedTexts.viewCart}
  </button>
  <div className="mt-1">
     <Link href={`/${language}/checkout`} className="block  bg-blue-600 text-white text-center py-2 rounded" onClick={handleLinkClick}>
                {translatedTexts.checkout}
            </Link>
             </div>
</div>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;





