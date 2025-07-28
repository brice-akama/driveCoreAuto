"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (text: string) => Promise<string>;
  fetchTranslatedProducts: () => Promise<any[]>;
  fetchTranslatedBlogPosts: () => Promise<any[]>;
  fetchStaticTranslation: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<string>("en");

  // Load language from localStorage on first mount
  useEffect(() => {
    const savedLang = localStorage.getItem("preferredLang");
    if (savedLang) {
      setLanguageState(savedLang);
    }
  }, []);

  // Save selected language to localStorage
  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem("preferredLang", lang);
  };

  // Translate function
  const translate = async (text: string): Promise<string> => {
    if (language === "en") return text;

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, source: "en", target: language }),
      });

      const data = await res.json();
      return data.translatedText || text;
    } catch (error) {
      console.error("Translation failed", error);
      return text;
    }
  };

  const fetchTranslatedProducts = async (): Promise<any[]> => {
    try {
      const res = await fetch(`/api/product?lang=${language}`);
      const data = await res.json();
      return data.products || [];
    } catch (error) {
      console.error("Failed to fetch products", error);
      return [];
    }
  };

  const fetchTranslatedBlogPosts = async (): Promise<any[]> => {
    try {
      const res = await fetch(`/api/blog?lang=${language}`);
      const data = await res.json();
      return data || [];
    } catch (error) {
      console.error("Failed to fetch blog posts", error);
      return [];
    }
  };

  const fetchStaticTranslation = async (text: string): Promise<string> => {
    if (language === "en") return text;

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, source: "en", target: language }),
      });

      const data = await res.json();
      return data.translatedText || text;
    } catch (error) {
      console.error("Static translation failed", error);
      return text;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translate,
        fetchTranslatedProducts,
        fetchStaticTranslation,
        fetchTranslatedBlogPosts,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
