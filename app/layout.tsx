// app/layout.tsx or app/layout.jsx
// app/layout.tsx
import React from "react";
import { cookies } from "next/headers"; // SSR cookie reader
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { LanguageProvider } from "./context/LanguageContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CurrencyProvider } from "./context/CurrencyContext";

import ClientWrapper from "./components/ClientWrapper";
import BottomNav from "./components/BottomNav";
import { Toaster } from "react-hot-toast";

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read language from cookies (SSR)
  const cookieStore = cookies();
  const lang = (await cookieStore).get("lang")?.value || "en";

  return (
    <html lang={lang}>
       <link rel="icon" href="/favicon.png" type="image/png" />
       
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CurrencyProvider>
          <WishlistProvider>
            <LanguageProvider initialLanguage={lang}>
              <CartProvider>
                <ClientWrapper>
                  {children}
                  {/* ✅ Global Toast Notifications */}
                  <Toaster
                    position="top-right"
                    reverseOrder={false}
                    toastOptions={{
                      style: { fontWeight: "500", borderRadius: "8px" },
                      duration: 4000,
                    }}
                  />
                  <BottomNav /> {/* <-- Insert here */}

                </ClientWrapper>
              </CartProvider>
            </LanguageProvider>
          </WishlistProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
