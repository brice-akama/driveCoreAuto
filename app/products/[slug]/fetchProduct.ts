// app/product[slug]/fetchProduct.ts

import 'server-only';


export const fetchProduct = async (slug: string, language: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?slug=${slug}`, {
      cache: 'no-store' // Ensures fresh data
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const data = await response.json();
    return data.data; // Assuming backend responds with { data: { ...product } }
  } catch (error) {
    console.error("Error in fetchProduct.ts:", error);
    throw error;
  }
};