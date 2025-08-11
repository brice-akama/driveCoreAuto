"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface WishlistItem {
  _id: string;
  slug: string;
  name: string;
  price?: number;
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
      // your backend returns { wishlist: { items: [...] } } or similar
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
        // refresh wishlist after add
        await fetchWishlist();
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
        // refresh wishlist after remove
        await fetchWishlist();
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
