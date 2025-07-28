"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define the product type
interface WishlistItem {
  _id: string;
  name: string;
  price: string;
  mainImage: string;
  slug: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (_id: string) => Promise<void>;
}

// Create the context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Provide the context
export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Fetch wishlist items from the API on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch("/api/wishlist");
        const data = await response.json();
        setWishlist(Array.isArray(data.wishlist) ? data.wishlist : []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlist([]); // Set an empty array on error
      }
    };
  
    fetchWishlist();
  }, []);
  

  // Function to add an item to the wishlist
  const addToWishlist = async (item: WishlistItem) => {
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      
      if (response.ok) {
        setWishlist((prev) => [...prev, item]);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  // Function to remove an item from the wishlist
  const removeFromWishlist = async (slug: string) => {
    try {
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
  
      if (response.ok) {
        setWishlist((prev) => prev.filter((item) => item.slug !== slug));
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };
  

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};