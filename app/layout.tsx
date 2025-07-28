// app/layout.tsx or app/layout.jsx
"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { LanguageProvider } from "./context/LanguageContext"; // adjust path
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Footer from "./components/Footer";
import { usePathname } from "next/navigation";
import CookieConsent from "./components/CookieConsent";
import BackToTop from "./components/BackToTop";
import FooterLanguageButton from "./components/FooterLanguageButton";
import ScrollToTop from "./components/ScrollToTop";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  
  const isAdminLoginPage = pathname === "/admin/login";

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
         <WishlistProvider>
        <CartProvider>
        <LanguageProvider>
          {!isAdminRoute  && <Navbar />}

          <main>
                 <ScrollToTop /> {/* ✅ Add this here */}
                {children}
                {!isAdminRoute  && <BackToTop />}
              </main>

           {!isAdminRoute && <Footer />}
            {!isAdminRoute && <FooterLanguageButton />} {/* Render only on non-admin pages */}
           {!isAdminRoute  && <CookieConsent />}
        </LanguageProvider>
        </CartProvider>
       </WishlistProvider>
      </body>
    </html>
  );
}
