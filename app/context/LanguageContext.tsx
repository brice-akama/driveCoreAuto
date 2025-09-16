"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string, namespace?: string) => void;
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
  const searchParams = useSearchParams();

  // ✅ Detect ?lang= in URL on first load
  useEffect(() => {
  // 1️⃣ Detect path-based language segment: /en/... or /es/...
  const pathLang = window.location.pathname.split("/")[1];

  // 2️⃣ Detect ?lang= query
  const urlLang = searchParams.get("lang");

  // 3️⃣ Determine which language to use
  const detectedLang =
    pathLang && ["en", "fr", "de", "es"].includes(pathLang)
      ? pathLang
      : urlLang || language;

  if (detectedLang && detectedLang !== language) {
    setLanguage(detectedLang);
  }
}, [searchParams, language]);


  // Load from localStorage if no SSR lang provided
  useEffect(() => {
    if (!initialLanguage) {
      const savedLang = localStorage.getItem("preferredLang");
      if (savedLang) setLanguageState(savedLang);
    }
  }, [initialLanguage]);

  // ✅ Updated setLanguage with namespace & fallback logic
  const setLanguage = async (lang: string, namespace: string = "") => {
    setLanguageState(lang);
    localStorage.setItem("preferredLang", lang);

    const path = namespace
      ? `/translations/${namespace}/${lang}.json`
      : `/translations/${lang}.json`;

    try {
      const res = await fetch(path);

      // Handle missing file
      if (!res.ok) {
        console.warn(`Translation file not found: ${path}`);
        setTranslations({}); // fallback to empty
        return;
      }

      const data = await res.json();
      setTranslations(data);
    } catch (err) {
      console.error(`Failed to fetch translations for ${lang} (${namespace})`, err);
      setTranslations({}); // fallback
    }
  };

  // Fetch translation from loaded JSON
  const fetchStaticTranslation = (key: string, namespace?: string): any => {
    if (!translations) return key;

    if (namespace && translations[namespace]) {
      return translations[namespace][key] || key;
    }

    return translations[key] || key;
  };

  // Dynamic translation via API (runtime)
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
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
