"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface WishlistItem {
  _id?: string;
  slug: string;
  name: string;
  price: number;
  discountPrice?: number;      // ✅ added
  discountPercent?: number;    // ✅ added
  mainImage: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (slug: string, language: string) => Promise<void>;
  removeFromWishlist: (slug: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist");
      const data = await response.json();
      setWishlist(Array.isArray(data.wishlist?.items) ? data.wishlist.items : []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist([]);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const refreshWishlist = fetchWishlist;

  const addToWishlist = async (slug: string, language: string) => {
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, language }),
      });

      if (response.ok) {
        const data = await response.json();
        // map discount info from backend
        if (data.wishlist?.items) {
          setWishlist(
            data.wishlist.items.map((item: any) => ({
              slug: item.slug,
              name: item.name,
              price: item.price,
              discountPrice: item.discountPrice,
              discountPercent: item.discountPercent,
              mainImage: item.mainImage,
            }))
          );
        }
      } else {
        console.error("Failed to add to wishlist:", await response.text());
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = async (slug: string) => {
    try {
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (response.ok) {
        const data = await response.json();
        setWishlist(Array.isArray(data.wishlist?.items) ? data.wishlist.items : []);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, refreshWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
