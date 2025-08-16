"use client";
import React, { useState, useEffect, useMemo } from "react";
import { SimpleForm, TextInput, SelectInput, useNotify, useRedirect } from "react-admin";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { useLanguage } from "@/app/context/LanguageContext"; // make sure you have this

const ReviewCreate: React.FC = (props) => {
  const [rating, setRating] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { language } = useLanguage();
  const notify = useNotify();
  const redirect = useRedirect();

  // Fetch products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error loading products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Map products to choices with unique string slugs
  const productChoices = useMemo(() => {
    return products.length > 0
      ? products.map((product) => ({
          slug: String(product.slug?.[language] || product.slug?.en || ""),
          name: String(product.name?.[language] || product.name?.en || "Unnamed Product"),
        }))
      : [{ slug: "", name: "No products available" }];
  }, [products, language]);

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  // Form submission
  const handleSubmit = async (data: any) => {
    try {
      const reviewPayload = {
        customerName: data.customerName,
        reviewContent: data.reviewContent,
        rating,
        slug: data.slug,
        location: data.location?.trim() || "",
      };

      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewPayload),
      });

      if (response.ok) {
        notify("Review submitted successfully!", { type: "success" });
        redirect("/review");
      } else {
        const errorText = await response.text();
        console.error("Error submitting review:", errorText);
        notify("Failed to submit review.", { type: "error" });
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      notify("Error submitting review. Please try again.", { type: "error" });
    }
  };

  return (
    <SimpleForm {...props} onSubmit={handleSubmit}>
      <TextInput label="Customer Name" source="customerName" required />

      <SelectInput
        label="Product"
        source="slug"
        choices={productChoices}
        optionText="name"
        optionValue="slug"
        disabled={products.length === 0}
        required
      />

      <TextInput label="Review Content" source="reviewContent" multiline required />

      <TextInput
        label="Location (State / Country)"
        source="location"
        placeholder="e.g., Brussels, Belgium"
      />

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Rating</label>
        <Rating value={rating} onChange={setRating} style={{ maxWidth: 150 }} />
      </div>
    </SimpleForm>
  );
};

export default ReviewCreate;
