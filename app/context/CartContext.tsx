// CartContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname

interface CartItem {
  slug: string; // Ensure slug is the identifier
  name: string;
  price: string;
  quantity: number;
  mainImage: string;
  option?: string | null;

  
  
}

interface CartContextType {
  cartItems: CartItem[];
  totalPrice: number;
  cartCount: number;
  isCartOpen: boolean;
  addToCart: (item: CartItem) => void;
  updateQuantity: (slug: string, quantity: number) => void;  // Use slug instead of id
  removeFromCart: (slug: string) => void;  // Use slug instead of id
  openCart: () => void;
  closeCart: () => void;
  fetchCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalPrice = cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.cart) {
        setCartItems(data.cart.items);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (item: CartItem) => {
    // Use slug to identify items in the cart
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.slug === item.slug); // Use slug, not _id
      if (existingItem) {
        return prevItems.map((i) =>
          i.slug === item.slug ? { ...i, quantity: i.quantity + item.quantity } : i // Use slug here as well
        );
      }
      return [...prevItems, item];
    });

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: item.slug,
          quantity: item.quantity,
          price: item.price,
          option: item.option,
          name: item.name,
          mainImage: item.mainImage,
        }),
        
      });
      const data = await res.json();
      if (data.cart) {
        setCartItems(data.cart.items);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }

    setIsCartOpen(true);
  };

  const updateQuantity = async (slug: string, quantity: number) => {
    if (quantity <= 0) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.slug === slug ? { ...item, quantity } : item // Use slug instead of _id
      )
    );

    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, quantity }), // Use slug instead of _id
      });
      const data = await res.json();
      if (data.cart) {
        setCartItems(data.cart.items);
      }
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  const removeFromCart = async (slug: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.slug !== slug)); // Use slug instead of _id

    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }), // Use slug instead of _id
      });
      const data = await res.json();
      if (data.cart) {
        setCartItems(data.cart.items);
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const cartDrawer = document.getElementById('cart-drawer');
      if (isCartOpen && cartDrawer && !cartDrawer.contains(event.target as Node)) {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isCartOpen]);

  return (
    <CartContext.Provider value={{ cartItems, totalPrice, isCartOpen, addToCart, cartCount, removeFromCart, openCart, closeCart, fetchCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};