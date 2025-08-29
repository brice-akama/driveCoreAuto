"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";  // import next/image for optimized image handling
import {
  FaBitcoin,
  FaTwitter, FaLinkedinIn, 
  FaPaypal,
  
} from "react-icons/fa";
import { SiCashapp } from "react-icons/si";

import { useLanguage } from "@/app/context/LanguageContext";

// Import your logo - adjust path to your actual logo file

const Footer: React.FC = () => {
  const { translate } = useLanguage();
  const [email, setEmail] = useState("");
  const [translatedTexts, setTranslatedTexts] = useState({
    newsletter: "Newsletter",
    newsletterDesc: "Get updates on new products and special offers.",
    placeholder: "Enter your email",
    subscribe: "Subscribe",
    quickLinks: "Quick Links",
    home: "Home",
    login: "LOGIN",
    transmissions: "Transmissions",
    trackOrder: "Track Order",
     engines: "Engines",
    swaps: "Swaps",
    accessories: "Accessories",
    customerSupport: "CUSTOMER SUPPORT",
    weAccept: "We Accept",   // Accessories
    buyerServices: "Buyer Services",
    description: " DriveCore Auto is your trusted source for high-quality automotive parts and expert swaps.",
    privacyPolicy: "Privacy Policy",
    warranty: "Warranty",
    fAQs: "FAQs",
    sHOP: "SHOP",
    returPolicy: "Reture Policy",
    terms: "Terms & Conditions",
    refundPolicy: "Refund Policy",
    shippingInfo: "Shipping Info",
    followUs: "Follow Us",
    contactUs: "Contact Us",
    copyright: `© ${new Date().getFullYear()} drivecoreauto.com. All rights reserved.`,
  });

  const { language } = useLanguage();

  useEffect(() => {
    async function translateTexts() {
      setTranslatedTexts({
        newsletter: await translate("Newsletter"),
        newsletterDesc: await translate("Get updates on new products and special offers."),
        placeholder: await translate("Enter your email"),
        subscribe: await translate("Subscribe"),
        quickLinks: await translate("Quick Links"),  // Accessories
        home: await translate("Home"),
         accessories: await translate("Accessories"),
        swaps: await translate("Swaps"),
        transmissions: await translate("Transmissions"),
        sHOP: await translate("SHOP"),
        engines: await translate("Engines"),
        returPolicy: await translate("Return Policy"),
         fAQs: await translate("FAQs"),
         warranty: await translate("Warranty"),
         description: await translate("DriveCore Auto is your trusted source for high-quality automotive parts and expert swaps."),
        login: await translate("LOGIN"),
         customerSupport: await translate("CUSTOMER SUPPORT"),
        buyerServices: await translate("Buyer Services"),
        privacyPolicy: await translate("Privacy Policy"),
        weAccept: await translate("We Accept"),
        trackOrder: await translate("Track Order"),
        terms: await translate("Terms & Conditions"),
        refundPolicy: await translate("Refund Policy"),
        shippingInfo: await translate("Shipping Info"),
        followUs: await translate("Follow Us"),
        contactUs: await translate("Contact Us"),
        copyright: await translate(
          `© ${new Date().getFullYear()} drivecoreauto.com. All rights reserved.`
        ),
      });
    }
    translateTexts();
  }, [translate]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setEmail(""); // Clear input after success
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to subscribe. Please try again.");
    }
  };

  return (
    <footer className="bg-blue-900 text-white px-6 py-12">
  <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center sm:text-left">

    {/* Company Logo */}
    {/* Company Logo */}
<div className="flex flex-col items-center sm:items-start">
  <Link href="/">
    <div className="relative w-[250px] h-[120px] mb-4">
      <Image
        src="/assets/logos.png"
        alt="DriveCore Auto Logo"
        fill
        style={{ objectFit: "contain" }}
        priority
      />
    </div>
  </Link>

  <div className="text-gray-300 text-sm mb-4"> 
    <p className="text-gray-300 text-sm mb-10">
      {translatedTexts.description}
    </p>
  </div>
</div>



    {/* Customer Support */}
    <div>
      <h3 className="font-semibold text-lg mb-4  pb-2">  {translatedTexts.customerSupport}</h3>
      <ul className="space-y-3 text-sm">
        <li><Link href={`/${language}/track-order`} className="hover:underline"> {translatedTexts.trackOrder }</Link></li>
        <li><Link  href={`/${language}/warranty`}className="hover:underline">
        {translatedTexts.warranty} </Link></li>
        <li><Link href={`/${language}/support/faqs`}className="hover:underline"> {translatedTexts.fAQs}</Link></li>
        
        <li><Link href={`/${language}/shipping`} className="hover:underline">{translatedTexts.shippingInfo}</Link></li>
         <li><Link href={`/${language}/refund-policy`} className="hover:underline"> {translatedTexts.returPolicy}</Link></li>
        <li><a href="mailto:support@drivecoreauto.com" className="hover:underline">support@drivecoreauto.com</a></li>
      </ul>
    </div>

    {/* Shop Links */}
    <div>
      <h3 className="font-semibold text-lg mb-4 pb-2"> {translatedTexts.sHOP}</h3>
      <ul className="space-y-3 text-sm">
        <li><Link href="/toyota" className="hover:underline"> {translatedTexts.engines}</Link></li>
        <li><Link href="/transmissions/nissan/automatic" className="hover:underline"> {translatedTexts.transmissions}</Link></li>
        <li><Link href="/swaps/toyota" className="hover:underline"> {translatedTexts.swaps}</Link></li>
        
        <li><Link href="/accessories" className="hover:underline"> {translatedTexts.accessories}</Link></li>
       
        
      </ul>
    </div>

    

    {/* Newsletter Subscription */}
    <div>
      <h3 className="font-semibold text-lg mb-4  pb-2">{translatedTexts.newsletter}</h3>
      <p className="text-sm mb-4">{translatedTexts.newsletterDesc}</p>
      <form onSubmit={handleSubscribe} className="flex max-w-xs mx-auto sm:mx-0">
        <input
          type="email"
          placeholder={translatedTexts.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 w-full rounded-l-md border border-gray-300 text-white bg-blue-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 px-5 rounded-r-md hover:bg-blue-700 transition"
        >
          {translatedTexts.subscribe}
        </button>
      </form>
    </div>
  </div>

  {/* Social Media & Payment Methods */}
  <div className="mt-12 flex flex-col md:flex-row items-center justify-between  pt-6">
    {/* Social Icons */}
    {/* Social Icons */}
<div className="flex space-x-6 mb-6 md:mb-0">
  <Link
    href="https://x.com/Drivecoreauto"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Twitter"
    className="text-white hover:text-blue-400 transition"
  >
    <FaTwitter size={22} />
  </Link>
  <Link
    href="https://www.linkedin.com/in/drivecore-auto-613a2a380/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    className="text-white hover:text-blue-700 transition"
  >
    <FaLinkedinIn size={22} />
  </Link>
</div>

{/* Payment Methods */}
<div className="mt-10 text-center">
  <h4 className="text-sm font-semibold mb-4 text-gray-100"> {translatedTexts.weAccept}</h4>
  <div className="flex justify-center items-center flex-wrap gap-3">
    {/* PayPal */}
    <div className="w-12 h-12 flex flex-col items-center justify-center rounded-full bg-blue-50 shadow">
      <FaPaypal size={16} className="text-blue-600" />
      <span className="text-[8px] mt-0.5 text-blue-800 font-medium">PayPal</span>
    </div>

    {/* Cash App */}
    <div className="w-12 h-12 flex flex-col items-center justify-center rounded-full bg-green-50 shadow">
      <SiCashapp size={16} className="text-green-500" />
      <span className="text-[8px] mt-0.5 text-green-800 font-medium">Cash App</span>
    </div>

    {/* Bitcoin */}
    <div className="w-12 h-12 flex flex-col items-center justify-center rounded-full bg-yellow-50 shadow">
      <FaBitcoin size={16} className="text-yellow-500" />
      <span className="text-[8px] mt-0.5 text-yellow-800 font-medium">Bitcoin</span>
    </div>
  </div>
</div>


   
  </div>

  {/* Copyright */}
  <div className="mt-6 text-center text-sm text-gray-300">
    {translatedTexts.copyright}
  </div>
</footer>

  );
};

export default Footer;
