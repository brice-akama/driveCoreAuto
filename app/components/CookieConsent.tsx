"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // Import the Link component
import { useLanguage } from "../context/LanguageContext";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const {  language } = useLanguage();

  useEffect(() => {
    // Check if the user has already accepted cookies
    const cookieConsent = localStorage.getItem("cookie-consent");

    if (!cookieConsent) {
      setIsVisible(true); // Show popup if not accepted
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <div
  className="
    fixed inset-0 flex items-center justify-center px-4
    md:inset-auto md:bottom-0 md:left-0 md:w-full md:flex-none
    text-white py-4 shadow-lg w-full
  "
>
  <div className="max-w-2xl  bg-gray-600 w-full md:max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left px-4">
    <p className="text-sm sm:text-base mb-4 sm:mb-0  bg-gray-600">
      We use cookies to enhance your experience. Some are essential for the operation of our website, while others help analyze site usage. By clicking "Accept," you agree to the use of all cookies. See our{" "}
      <Link href={`/${language}/cookie-policy`} className="underline">Cookie Policy</Link> and{" "}
      <Link href={`/${language}/privacy-policy`} className="underline">Privacy Policy</Link>.
    </p>
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
      <button
        onClick={handleAccept}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
      >
        Accept
      </button>
      <button
        onClick={handleDecline}
        className="bg-transparent border border-gray-500 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-700 transition w-full sm:w-auto"
      >
        Decline
      </button>
    </div>
  </div>
</div>

      )}
    </>
  );
}