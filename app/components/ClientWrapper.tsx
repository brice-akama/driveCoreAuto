"use client"; // client-side only

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";
import BackToTop from "./BackToTop";

import ScrollToTop from "./ScrollToTop";
import CurrencySelector from "./CurrencySelector";
import CartDrawer from "./CartDrawer";

import SmartsuppChat from "./ClientSideTawk";

const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <CartDrawer />}
      {!isAdminRoute && <CurrencySelector />}

      <main>
        <ScrollToTop />
         
        {children}
        {!isAdminRoute && <BackToTop />}
      </main>

      {!isAdminRoute && <Footer />}
      
      {!isAdminRoute && <CookieConsent />}
          <SmartsuppChat />
    </>
  );
};

export default ClientWrapper;
