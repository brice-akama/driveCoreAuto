"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";  // import next/image for optimized image handling
import {
  FaFacebookF,
  FaInstagram,
  FaPaypal,
  FaBitcoin,
  FaCcVisa,
  FaCcMastercard,
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
    weAccept: "We Accept",
    buyerServices: "Buyer Services",
    privacyPolicy: "Privacy Policy",
    terms: "Terms & Conditions",
    refundPolicy: "Refund Policy",
    shippingInfo: "Shipping Info",
    followUs: "Follow Us",
    contactUs: "Contact Us",
    copyright: `© ${new Date().getFullYear()} drivecoreauto.com. All rights reserved.`,
  });

  useEffect(() => {
    async function translateTexts() {
      setTranslatedTexts({
        newsletter: await translate("Newsletter"),
        newsletterDesc: await translate("Get updates on new products and special offers."),
        placeholder: await translate("Enter your email"),
        subscribe: await translate("Subscribe"),
        quickLinks: await translate("Quick Links"),
        home: await translate("Home"),
        login: await translate("LOGIN"),
        buyerServices: await translate("Buyer Services"),
        privacyPolicy: await translate("Privacy Policy"),
        weAccept: await translate("We Accept"),
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
    <footer className="bg-blue-900 text-white px-6 py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">

        {/* Company Logo */}
          {/* Company Logo + Short Description */}
<div className="flex flex-col items-center md:items-start">
  <Link href="/">
    <Image
      src="/assets/logos.png"
      alt="DriveCore Auto Logo"
      width={150}
      height={50}
      className="object-contain"
      priority
    />
  </Link>
  <p className=" text-sm max-w-xs text-center md:text-left text-gray-300">
    {/* Your very short description here */}
    Quality automotive parts and expert swaps for your vehicle.
  </p>
</div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-lg">{translatedTexts.contactUs}</h3>
          <address className="mt-2 not-italic text-sm space-y-2">
            <p>1234 DriveCore Street</p>
            <p>Auto City, AC 56789</p>
            <p>
              Phone:{" "}
              <a
                href="tel:+1234567890"
                className="underline hover:text-blue-300"
              >
                +1 (234) 567-890
              </a>
            </p>
            <p>
              Email:{" "}
              <a
                href="mailto:support@drivecoreauto.com"
                className="underline hover:text-blue-300"
              >
                support@drivecoreauto.com
              </a>
            </p>
          </address>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h3 className="font-semibold text-lg">{translatedTexts.newsletter}</h3>
          <p className="text-sm mt-2">{translatedTexts.newsletterDesc}</p>
          <form
            onSubmit={handleSubscribe}
            className="flex mt-4 max-w-xs mx-auto md:mx-0"
          >
            <input
              type="email"
              placeholder={translatedTexts.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 w-full rounded-l-md border border-gray-300 text-white"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 px-4 rounded-r-md hover:bg-blue-700 transition"
            >
              {translatedTexts.subscribe}
            </button>
          </form>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold text-lg">{translatedTexts.followUs}</h3>
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            <Link
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-300"
              aria-label="Facebook"
            >
              <FaFacebookF size={20} />
            </Link>

            <Link
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#c32aa3] hover:text-[#7232bd]"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-10 text-center">
        <h4 className="text-sm font-semibold mb-4 text-gray-200">
          {translatedTexts.weAccept}
        </h4>
        <div className="flex justify-center items-center flex-wrap gap-3">
          <div className="w-12 h-12 flex flex-col items-center justify-center rounded-full bg-blue-50 shadow">
            <FaPaypal size={16} className="text-blue-600" />
            <span className="text-[8px] mt-0.5 text-blue-800 font-medium">PayPal</span>
          </div>

          <div className="w-12 h-12 flex flex-col items-center justify-center rounded-full bg-green-50 shadow">
            <SiCashapp size={16} className="text-green-500" />
            <span className="text-[8px] mt-0.5 text-green-800 font-medium">Cash App</span>
          </div>

          <div className="w-12 h-12 flex flex-col items-center justify-center rounded-full bg-yellow-50 shadow">
            <FaBitcoin size={16} className="text-yellow-500" />
            <span className="text-[8px] mt-0.5 text-yellow-800 font-medium">Bitcoin</span>
          </div>

          <div className="w-12 h-12 flex flex-col items-center justify-center rounded-full bg-indigo-50 shadow">
            <FaCcVisa size={16} className="text-indigo-600" />
            <span className="text-[8px] mt-0.5 text-indigo-800 font-medium">Visa</span>
          </div>

          <div className="w-12 h-12 flex flex-col items-center justify-center rounded-full bg-red-50 shadow">
            <FaCcMastercard size={16} className="text-red-600" />
            <span className="text-[8px] mt-0.5 text-red-800 font-medium">MasterCard</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-4 text-center text-sm text-gray-300">
        {translatedTexts.copyright}
      </div>
    </footer>
  );
};

export default Footer;
