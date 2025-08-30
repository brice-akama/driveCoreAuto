// components/ScrollToTop.tsx
// components/ScrollToTop.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Always scroll to top when pathname changes
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // can also use "smooth"
      });
    }
  }, [pathname]);

  return null;
}

