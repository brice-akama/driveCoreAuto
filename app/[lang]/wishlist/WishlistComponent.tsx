'use client';

import React, { useEffect } from 'react';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCart } from '@/app/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/app/components/Breadcrumbs';
import { useLanguage } from '@/app/context/LanguageContext';

interface WishlistItem {
  _id: string;
  slug: string;
  name: string;
  price: number;
  mainImage: string;
}

interface Props {
  initialLanguage?: string;
  initialTranslations?: Record<string, any>;
}

const WishlistInformation = ({ initialLanguage, initialTranslations }: Props) => {
  const { wishlist, removeFromWishlist } = useWishlist() as {
    wishlist: WishlistItem[];
    removeFromWishlist: (slug: string) => void;
  };
  const { addToCart, openCart } = useCart();

  const { language, translations, setLanguage } = useLanguage();

  // Set initial SSR language and translations
  useEffect(() => {
  if (initialLanguage) setLanguage(initialLanguage, 'wishlist');
}, [initialLanguage, setLanguage]);

  const t = translations || {};

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({ ...item, quantity: 1 }, language);
    openCart();
  };

  // Empty wishlist
  if (wishlist.length === 0) {
    return (
      <div className="mt-20 lg:mt-40">
        <div className="bg-black text-white py-8 text-center w-full">
          <h1 className="text-4xl font-black uppercase">{t.heroTitle || 'Wishlist'}</h1>
          <Breadcrumb />
        </div>
        <div className="p-6 text-center">
          <p className="mb-4 text-lg font-semibold">{t.emptyText || 'Your wishlist is empty.'}</p>
          <Link
            href="/toyota"
            className="inline-block mt-2 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition"
          >
            {t.continueShopping || 'Continue Shopping'}
          </Link>
        </div>
      </div>
    );
  }

  // Wishlist with items
  return (
    <div className="mt-20 lg:mt-40">
      <div className="bg-black text-white py-8 text-center w-full">
        <h1 className="text-4xl font-black uppercase">{t.heroTitle || 'Wishlist'}</h1>
        <Breadcrumb />
      </div>

      <div className="wishlist-page p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t.mainHeading || 'Your Wishlist'}</h1>

        {/* Desktop / Tablet */}
        <div className="hidden md:block">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-3 px-4">{t.product || 'Product'}</th>
                <th className="text-left py-3 px-4">{t.price || 'Price'}</th>
                <th className="text-left py-3 px-4">{t.actions || 'Actions'}</th>
                <th className="text-left py-3 px-4">{t.addToCart || 'Add to Cart'}</th>
              </tr>
            </thead>
            <tbody>
              {wishlist.map((item, index) => (
                <tr key={`${item._id}-${index}`} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="flex items-center py-4 px-4 gap-4">
                    <Image
                      src={item.mainImage}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded"
                    />
                    <span className="text-blue-600 font-medium">{item.name}</span>
                  </td>
                  <td className="py-4 px-4">${item.price.toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => removeFromWishlist(item.slug)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      {t.remove || 'Remove'}
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-green-600 whitespace-nowrap text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      {t.addToCart || 'Add to Cart'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="block md:hidden space-y-4">
          {wishlist.map((item, index) => (
            <div
              key={`${item._id}-${index}`}
              className="border border-gray-200 rounded-lg p-4 flex flex-col items-start gap-4"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={item.mainImage}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded"
                />
                <span className="text-blue-600 font-medium">{item.name}</span>
              </div>
              <p className="text-gray-800 font-semibold">${item.price.toFixed(2)}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => removeFromWishlist(item.slug)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  {t.remove || 'Remove'}
                </button>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  {t.addToCart || 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistInformation;
