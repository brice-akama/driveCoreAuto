'use client';

import { useWishlist } from '@/app/context/WishlistContext';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';
import Breadcrumb from '../components/Breadcrumbs';

interface WishlistItem {
  _id: string;
  slug: string;
  name: string;
  price: number;
  mainImage: string;
  discountPercent?: number;
  discountPrice?: number;
}

// ✅ Helper to calculate discounted price
const getDiscountedPrice = (price: number, discountPercent?: number) => {
  if (!discountPercent || discountPercent <= 0) return price;
  return parseFloat((price - (price * discountPercent) / 100).toFixed(2));
};

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist() as {
    wishlist: WishlistItem[];
    removeFromWishlist: (slug: string) => void;
  };

  const { addToCart, openCart } = useCart();
  const pathname = usePathname();

  const possibleLang = pathname.split('/')[1] || '';
  const supportedLangs = ['en', 'fr', 'es', 'de'];
  const lang = supportedLangs.includes(possibleLang) ? possibleLang : 'en';

  const handleAddToCart = (
    _id: string,
    slug: string,
    name: string,
    price: number,
    mainImage: string,
    currentLang: string
  ) => {
    addToCart({
      slug,
      name,
      price,
      mainImage,
      quantity: 1,
      originalPrice: 0
    }, currentLang);
    openCart();
  };

  // ✅ Compute discount price for display
  const wishlistWithDiscounts = wishlist.map(item => ({
    ...item,
    discountPrice: getDiscountedPrice(item.price, item.discountPercent)
  }));

  // **Empty wishlist view**
  if (wishlist.length === 0) {
    return (
      <div className="mt-20 lg:mt-40">
        <div className="bg-black text-white py-8 text-center w-full">
          <h1 className="text-4xl font-black uppercase">Wishlist</h1>
          <Breadcrumb />
        </div>
        <div className="p-6 text-center">
          <p className="mb-4 text-lg font-semibold">Your wishlist is empty.</p>
          <Link
            href="/toyota"
            className="inline-block mt-2 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // **Wishlist with items**
  return (
    <div className="mt-20 lg:mt-40">
      <div className="bg-black text-white py-8 text-center w-full">
        <h1 className="text-4xl font-black uppercase">Wishlist</h1>
        <Breadcrumb />
      </div>

      <div className="wishlist-page p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>

        {/* Desktop / Tablet */}
        <div className="hidden md:block">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Actions</th>
                <th className="text-left py-3 px-4">Add to Cart</th>
              </tr>
            </thead>
            <tbody>
              {wishlistWithDiscounts.map((item, index) => (
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
                  <td className="py-4 px-4">
                    ${ (item.discountPrice ?? item.price).toFixed(2) }
                  </td>

                  <td className="py-4 px-4">
                    <button
                      onClick={() => removeFromWishlist(item.slug)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() =>
                        handleAddToCart(item._id, item.slug, item.name, item.price, item.mainImage, lang)
                      }
                      className="bg-green-600 whitespace-nowrap text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="block md:hidden space-y-4">
          {wishlistWithDiscounts.map((item, index) => (
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
              <p className="text-gray-800 font-semibold">
                ${ (item.discountPrice ?? item.price).toFixed(2) }
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => removeFromWishlist(item.slug)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Remove
                </button>
                <button
                  onClick={() =>
                    handleAddToCart(item._id, item.slug, item.name, item.price, item.mainImage, lang)
                  }
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
