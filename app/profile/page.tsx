// page.tsx
import { Metadata } from "next";
import LoginPage from "./LoginPage";
import React from "react";

// Define metadata for the Login page
export const metadata: Metadata = {
  title: "Login - DriveCore Auto",
  description:
    "Access your DriveCore Auto account to manage orders, track deliveries, and enjoy a personalized automotive experience.",
  keywords:
    "DriveCore Auto login, customer login, automotive account access, car order tracking, vehicle product dashboard, auto customer area",
  robots: "index, follow",
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Login - DriveCore Auto",
    url: "https://www.drivecoreauto.com/login",
    description:
      "Login to your DriveCore Auto account for a personalized experience, order tracking, and access to premium automotive products.",
    publisher: {
      "@type": "Organization",
      name: "DriveCore Auto",
      url: "https://www.drivecoreauto.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LoginPage />
    </>
  );
}
