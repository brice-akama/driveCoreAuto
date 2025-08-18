"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string, namespace?: string) => void; // <-- allow optional second arg
  translate: (text: string) => Promise<string>;
  fetchTranslatedProducts: () => Promise<any[]>;
  fetchTranslatedBlogPosts: () => Promise<any[]>;
  fetchStaticTranslation: (key: string, namespace?: string) => any;
  translations?: Record<string, any>;
}


const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLanguage = "en",
  initialTranslations = {},
}: {
  children: React.ReactNode;
  initialLanguage?: string;
  initialTranslations?: Record<string, any>;
}) {
  const [language, setLanguageState] = useState<string>(initialLanguage);
  const [translations, setTranslations] = useState<Record<string, any>>(initialTranslations);

  // Load from localStorage if no SSR lang provided
  useEffect(() => {
    if (!initialLanguage) {
      const savedLang = localStorage.getItem("preferredLang");
      if (savedLang) setLanguageState(savedLang);
    }
  }, [initialLanguage]);

  

  // Save selected language to localStorage
 // Updated setLanguage with namespace support
const setLanguage = async (lang: string, namespace: string = "") => {
  setLanguageState(lang);
  localStorage.setItem("preferredLang", lang);

  try {
    // Use namespace if provided, otherwise fallback to root translations
    const path = namespace
      ? `/translations/${namespace}/${lang}.json`
      : `/translations/${lang}.json`;

    const res = await fetch(path);
    const data = await res.json();
    setTranslations(data);
  } catch (err) {
    console.error("Failed to fetch translations for", lang, err);
  }
};


  

  // ✅ Uses SSR translations if available
  const fetchStaticTranslation = (key: string, namespace?: string): any => {
  if (!translations) return key;

  if (namespace && translations[namespace]) {
    return translations[namespace][key] || key;
  }

  return translations[key] || key;
};


  // Dynamic translation via API (still available for runtime)
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

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translate,
        fetchTranslatedProducts,
        fetchTranslatedBlogPosts,
        fetchStaticTranslation,
        translations,
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
