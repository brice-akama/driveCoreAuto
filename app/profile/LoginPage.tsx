'use client';

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import Breadcrumb from "../components/Breadcrumbs";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const router = useRouter();
  const { language, translate } = useLanguage();

  const [labels, setLabels] = useState({
    myAccount: "MY ACCOUNT",
    newCustomer: "New Customer",
    registerAccount: "Register Account",
    registerDescription: "By creating an account you will be able to shop faster, be up to date on an order's status, and keep track of the orders you have previously made.",
    continue: "Continue",
    createAccount: "Create Account",
    returningCustomer: "Returning Customer",
    returningCustomerDesc: "I am a returning customer.",
    email: "Email",
    password: "Password",
    enterEmail: "Enter your email",
    enterPassword: "Enter your password",
    createPassword: "Create a password",
    forgotPassword: "Forgot Password?",
    login: "Login",
  });

  useEffect(() => {
    async function loadTranslations() {
      setLabels({
        myAccount: await translate("MY ACCOUNT"),
        newCustomer: await translate("New Customer"),
        registerAccount: await translate("Register Account"),
        registerDescription: await translate("By creating an account you will be able to shop faster, be up to date on an order's status, and keep track of the orders you have previously made."),
        continue: await translate("Continue"),
        createAccount: await translate("Create Account"),
        returningCustomer: await translate("Returning Customer"),
        returningCustomerDesc: await translate("I am a returning customer."),
        email: await translate("Email"),
        password: await translate("Password"),
        enterEmail: await translate("Enter your email"),
        enterPassword: await translate("Enter your password"),
        createPassword: await translate("Create a password"),
        forgotPassword: await translate("Forgot Password?"),
        login: await translate("Login"),
      });
    }
    loadTranslations();
  }, [translate]);

  const handleContinueClick = () => setShowRegistration(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;

    try {
      const response = await fetch("/api/secure-login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        router.push(`/?lang=${language}`);
      } else {
        toast.error(data.error || await translate("Something went wrong"));
      }
    } catch (error) {
      console.error(error);
      toast.error(await translate("Failed to parse response, please try again."));
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setShowRegistration(false);
      } else {
        toast.error(data.error || await translate("Something went wrong"));
      }
    } catch (error) {
      console.error(error);
      toast.error(await translate("Failed to parse response, please try again."));
    }
  };

  return (
    <div className="mt-20 lg:mt-40">
      {/* Full-width black section */}
      <div className="bg-black text-white py-8 text-center w-full">
        <h1 className="text-4xl font-black">{labels.myAccount}</h1>
        <Breadcrumb />
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
          {/* New Customer Section */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{labels.newCustomer}</h2>
            {!showRegistration ? (
              <>
                <h3 className="text-lg text-gray-700 mb-2">{labels.registerAccount}</h3>
                <p className="text-gray-600 mb-6">{labels.registerDescription}</p>
                <button
                  onClick={handleContinueClick}
                  className="w-full bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                  {labels.continue}
                </button>
              </>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="mb-6">
                  <label htmlFor="reg-email" className="block text-lg font-medium text-gray-700 mb-2">{labels.email}</label>
                  <input
                    type="email"
                    id="reg-email"
                    name="email"
                    className="w-full p-4 border border-gray-300 rounded-lg"
                    placeholder={labels.enterEmail}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="reg-password" className="block text-lg font-medium text-gray-700 mb-2">{labels.password}</label>
                  <input
                    type="password"
                    id="reg-password"
                    name="password"
                    className="w-full p-4 border border-gray-300 rounded-lg"
                    placeholder={labels.createPassword}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                  {labels.createAccount}
                </button>
              </form>
            )}
          </div>

          {/* Returning Customer Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{labels.returningCustomer}</h2>
            <p className="text-gray-600 mb-6">{labels.returningCustomerDesc}</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">{labels.email}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-4 border border-gray-300 rounded-lg"
                  placeholder={labels.enterEmail}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">{labels.password}</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full p-4 border border-gray-300 rounded-lg"
                  placeholder={labels.enterPassword}
                  required
                />
              </div>
              {/* Forgot Password link */}
              <div className="text-right mt-2">
                <Link
                  href="/forgot-password"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {labels.forgotPassword}
                </Link>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                {labels.login}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
