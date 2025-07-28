"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // Import the Link component

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

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
        <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white py-4 px-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left">
            <p className="text-sm sm:text-base mb-4 sm:mb-0">
              We use cookies to enhance your experience. Some are essential for the operation of our website, while others help analyze site usage. By clicking "Accept," you agree to the use of all cookies. See our{" "}
              <Link href="/cookie-policy" className="underline">Cookie Policy</Link> and{" "}
              <Link href="/Privacy Policy" className="underline">Privacy Policy</Link>.
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