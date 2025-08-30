"use client";

import { FaHome, FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

export default function BottomNav() {
  const { cartCount, openCart } = useCart();
  const { wishlist } = useWishlist();
  const pathname = usePathname();
  const { language } = useLanguage();

  const navItems = [
    { label: "Shop", href: "/toyota", icon: <FaHome className="text-xl" /> },
    {
      label: "Cart",
      href: "/cart",
      icon: <FaShoppingCart className="text-xl" />,
      onClick: openCart,
      badge: cartCount,
    },
    {
      label: "Wishlist",
      href: `/${language}/wishlist`,
      icon: <FaHeart className="text-xl" />,
      badge: wishlist.length,
    },
    { label: "Profile", href: "/profile", icon: <FaUser className="text-xl" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <div className="flex justify-around items-center py-2 px-1 safe-area-inset-bottom mt5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isCart = item.label === "Cart";

          const content = (
            <div
              id={isCart ? "cart-icon" : undefined}
              className={`flex flex-col items-center relative cursor-pointer transition-transform duration-200 hover:scale-105 ${
                isActive ? "text-blue-600 font-semibold" : "text-gray-600"
              }`}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>

              {item.badge !== undefined && (
                <span
                  className={`absolute -top-2 -right-2 flex items-center justify-center rounded-full transition-all duration-300 ${
                    item.badge === 0
                      ? "bg-red-200 text-red-700 text-[8px] px-1"
                      : "bg-red-500 text-white text-[10px] px-1"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </div>
          );

          return item.onClick ? (
            <div key={item.label} onClick={item.onClick}>
              {content}
            </div>
          ) : (
            <Link key={item.label} href={item.href}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
