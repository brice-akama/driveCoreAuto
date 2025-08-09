// page.tsx
import { Metadata } from "next";
import BlogPage from "./BlogPage";
import React from "react";


// Metadata for SEO
export const metadata: Metadata = {
  title: " Blog - 16Zips",
  description:
    "Explore cannabis insights, product highlights, usage tips, and industry news on the 16Zips blog. Stay informed and inspired on your cannabis journey.",
  keywords:
    "cannabis blog, 16Zips blog, marijuana education, THC guides, CBD tips, cannabis news, weed blog, cannabis lifestyle, cannabis articles, cannabis guides",
  robots: "index, follow",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "16Zips Blog",
    url: "https://www.16zip.com/blog",
    description:
      "16Zips Blog features cannabis news, product reviews, and education to support your cannabis lifestyle and knowledge.",
    publisher: {
      "@type": "Organization",
      name: "16Zips",
      url: "https://www.16zip.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPage />
    </>
  );
}