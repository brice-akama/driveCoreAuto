"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";
import { useEffect, useState } from "react";

interface BreadcrumbProps {
  separator?: string;
}

const CHECKOUT_STEPS = [
  { path: 'cart-drawer', label: 'Shopping Cart' },
  { path: 'checkout', label: 'Checkout' },
  { path: 'order-complete', label: 'Order Complete' },
];

const Breadcrumb: React.FC<BreadcrumbProps> = ({ separator = " / " }) => {
  const { language } = useLanguage();
  const pathname = usePathname(); // e.g., /de/checkout
  const segments = pathname.split("/").filter(Boolean); // ['de', 'checkout']

  const pathSegments = segments.slice(1); // remove language
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // Determine steps to show for multi-step pages
  let displaySegments = pathSegments;

  if (!isMobile) {
    // If page is part of checkout flow, show all steps
    const stepIndex = CHECKOUT_STEPS.findIndex(step => step.path === pathSegments[0]);
    if (stepIndex >= 0) {
      displaySegments = CHECKOUT_STEPS.slice(0, stepIndex + 1).map(step => step.path);
    }
  } else {
    // Mobile: only show current
    const stepIndex = CHECKOUT_STEPS.findIndex(step => step.path === pathSegments[0]);
    if (stepIndex >= 0) displaySegments = [CHECKOUT_STEPS[stepIndex].path];
  }

  // JSON-LD
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `/?lang=${language}` },
      ...displaySegments.map((segment, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name: CHECKOUT_STEPS.find(s => s.path === segment)?.label || capitalize(segment.replace("-", " ")),
        item: `/${segments[0]}/${displaySegments.slice(0, idx + 1).join("/")}`,
      })),
    ],
  };

  return (
    <>
      <nav className="text-sm text-gray-500">
        <Link href={`/?lang=${language}`}>Home</Link>
        {displaySegments.map((segment, idx) => {
          const path = `/${segments[0]}/${displaySegments.slice(0, idx + 1).join("/")}`;
          const isLast = idx === displaySegments.length - 1;
          const label = CHECKOUT_STEPS.find(s => s.path === segment)?.label || capitalize(segment.replace("-", " "));
          return (
            <span key={idx}>
              {separator}
              {isLast ? <span className="font-semibold">{label}</span> : <Link href={path}>{label}</Link>}
            </span>
          );
        })}
      </nav>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
};

export default Breadcrumb;
