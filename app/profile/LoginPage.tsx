"use client";

import React, { useState } from "react";
import toast from "react-hot-toast"; // Import toast
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";

const LoginPage: React.FC = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const router = useRouter(); // If you want to redirect after login or registration
  const { language } = useLanguage();

  const handleContinueClick = () => {
    setShowRegistration(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Type casting for form elements
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;
  
    const response = await fetch("/api/secure-login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    try {
      // Check if the response is valid JSON
      const data = await response.json();
  
      if (response.ok) {
        toast.success(data.message);
        router.push(`/?lang=${language}`);
// Redirect to dashboard or home
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      toast.error("Failed to parse response, please try again.");
    }
  };
  
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Type casting for form elements
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;
  
    const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    try {
      // Check if the response is valid JSON
      const data = await response.json();
  
      if (response.ok) {
        toast.success(data.message);
        setShowRegistration(false); // Optionally reset registration form
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      toast.error("Failed to parse response, please try again.");
    }
  };
  
  return (
    <div className="container mx-auto px-6 py-16 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
        {/* New Customer Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">New Customer</h2>
          {!showRegistration ? (
            <>
              <h3 className="text-lg text-gray-700 mb-2">Register Account</h3>
              <p className="text-gray-600 mb-6">
                By creating an account you will be able to shop faster, be up to date on an order&apos;s status, and keep
                track of the orders you have previously made.
              </p>
              <button
                onClick={handleContinueClick}
                className="w-full bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Continue
              </button>
            </>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="mb-6">
                <label htmlFor="reg-email" className="block text-lg font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="reg-email"
                  name="email"
                  className="w-full p-4 border border-gray-300 rounded-lg"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="reg-password" className="block text-lg font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="reg-password"
                  name="password"
                  className="w-full p-4 border border-gray-300 rounded-lg"
                  placeholder="Create a password"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Create Account
              </button>
            </form>
          )}
        </div>

        {/* Returning Customer Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Returning Customer</h2>
          <p className="text-gray-600 mb-6">I am a returning customer.</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-4 border border-gray-300 rounded-lg"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full p-4 border border-gray-300 rounded-lg"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
      {/* Toast Notifications */}
    </div>
  );
};

export default LoginPage;