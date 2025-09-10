'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiFacebook, FiTwitter } from "react-icons/fi";
import { useCurrency } from "@/app/context/CurrencyContext";

interface Product {
  _id: string;
  slug: { [key: string]: string };
  name: { [key: string]: string };
  price: number;
  mainImage: string;
  category: string;
  description: { [key: string]: string };
  Specifications: Record<string, string>;
  Shipping: Record<string, string>;
  Warranty: Record<string, string>;
  discountPercent?: number;
}

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  currentLang: string;
  handleAddToCart: (product: Product, quantity: number) => void; 
  handleAddToWishlist: (product: Product) => void;
  translatedTexts: {
    addtoCart: string;
    addToWishlist: string;
  };
  symbol?: string;
}

function getDiscountedPrice(price: number, discountPercent?: number) {
  return discountPercent ? price - price * (discountPercent / 100) : price;
}

export default function QuickViewModal({
  product,
  onClose,
  currentLang,
  handleAddToCart,
  handleAddToWishlist,
  translatedTexts,
  symbol: propSymbol,
}: QuickViewModalProps) {
  const { symbol } = useCurrency();
  const currencySymbol = propSymbol || symbol || "$";

  const [labels, setLabels] = useState({
    specifications: "Specifications",
    shipping: "Shipping & Delivery",
    warranty: "Warranty",
    viewDetails: "View Details",
  });

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function loadLabels() {
      setLabels({
        specifications: "Specifications",
        shipping: "Shipping & Delivery",
        warranty: "Warranty",
        viewDetails: "View Details",
      });
    }
    loadLabels();
  }, []);

  const discountedPrice = getDiscountedPrice(product.price, product.discountPercent);
  const totalPrice = discountedPrice * quantity;

  const domain =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://www.drivecoreauto.com");

  const productUrl = `${domain}/products/${product.slug.en}?lang=${currentLang}`;
  const shareText = encodeURIComponent(`Check out this product: ${product.name[currentLang] || product.name.en}`);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${shareText}`;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl min-h-[500px] rounded-lg shadow-lg flex overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-6 text-gray-500 hover:text-black z-20"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Left: Image */}
        <div className="w-1/2 relative group">
          <Image
            src={product.mainImage}
            alt={product.name[currentLang] || product.name.en}
            fill
            className="object-cover"
            unoptimized
          />

          <Link
            href={`/products/${product.slug.en}?lang=${currentLang}`}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-800 text-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity w-full text-center"
          >
            {labels.viewDetails}
          </Link>
        </div>

        {/* Right: Details */}
        <div className="w-1/2 p-6 flex flex-col justify-between max-h-[500px] overflow-y-auto">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {product.name[currentLang] || product.name.en}
            </h2>

            {/* Price with discount */}
            {/* Price with discount */}
<p className="text-lg font-semibold mb-3">
  {product.discountPercent && product.discountPercent > 0 ? (
    <>
      {/* Original price */}
      <span className="line-through text-gray-500 mr-2">
        {symbol}{product.price.toFixed(2)}
      </span>
      {/* Discounted price */}
      <span className="text-blue-600">
        {symbol}{discountedPrice.toFixed(2)}
      </span>
      {/* Total for quantity */}
      <span className="ml-2 text-gray-700">
        x {quantity} = {symbol}{totalPrice.toFixed(2)}
      </span>
    </>
  ) : (
    /* No discount: price in blue and total in gray */
    <span>
      <span className="text-blue-600">{symbol}{product.price.toFixed(2)}</span>
      <span className="ml-2 text-gray-700">
        x {quantity} = {symbol}{totalPrice.toFixed(2)}
      </span>
    </span>
  )}
</p>


            

            {/* Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-black flex-1"
                onClick={() => {
                  handleAddToCart(product, quantity);
                  onClose();
                }}
              >
                {translatedTexts.addtoCart}
              </button>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2 flex-1 justify-center"
                onClick={() => {
                  handleAddToWishlist(product);
                  onClose();
                }}
                aria-label="Add to Wishlist"
              >
                <FiHeart />
                {translatedTexts.addToWishlist}
              </button>
            </div>

            {/* Share */}
            <div className="flex gap-4 mb-6">
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <FiFacebook size={24} />
              </a>
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                <FiTwitter size={24} />
              </a>
            </div>

            {/* Specifications */}
            <h3 className="font-semibold text-lg mb-1">{labels.specifications}</h3>
            <div
              className="product-details"
              dangerouslySetInnerHTML={{
                __html: product.Specifications[currentLang] || product.Specifications.en,
              }}
            />

            <h3 className="font-semibold text-lg mb-1">{labels.shipping}</h3>
            <div
              className="product-details"
              dangerouslySetInnerHTML={{
                __html: product.Shipping[currentLang] || product.Shipping.en,
              }}
            />

            <h3 className="font-semibold text-lg mb-1">{labels.warranty}</h3>
            <div
              className="product-details"
              dangerouslySetInnerHTML={{
                __html: product.Warranty[currentLang] || product.Warranty.en,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
