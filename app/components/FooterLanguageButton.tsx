"use client";
import React, { useState } from "react";
import ReactWorldFlag from "react-world-flags";
import { useLanguage } from "../context/LanguageContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const languageOptions = [
  { code: "en", name: "English", flag: "GB" },
  { code: "de", name: "German", flag: "DE" },
  { code: "fr", name: "French", flag: "FR" },
  { code: "es", name: "Spanish", flag: "ES" },
];

export default function FooterLanguageButton() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const langInfo = languageOptions.find((l) => l.code === language) || languageOptions[0];

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setIsOpen(false);

    if (searchParams?.has("lang")) {
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("lang", newLang);
      router.replace(`${pathname}?${params.toString()}`);
    } else {
      const pathSegments = pathname.split("/");
      const firstSegment = pathSegments[1];
      if (["en", "fr", "de", "es"].includes(firstSegment)) {
        pathSegments[1] = newLang;
        router.replace(pathSegments.join("/"));
      } else {
        const params = new URLSearchParams(searchParams?.toString() || "");
        params.set("lang", newLang);
        router.replace(`${pathname}?${params.toString()}`);
      }
    }
  };

  return (
   <div
  className="
    fixed bottom-16 z-50  md:bottom-4
    left-1/2 transform -translate-x-1/2     /* default (phones): centered */
    md:left-25 md:transform-none             /* tablets: move to bottom-left */
                               /* hide on desktop */
  "
>
  {/* Trigger Button */}
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="bg-white border border-gray-300 px-4 py-2 rounded-full text-black shadow-md flex items-center"
  >
    <ReactWorldFlag code={langInfo.flag} style={{ width: 30, height: 20, marginRight: 8 }} />
    <span className="whitespace-nowrap">{langInfo.name}</span>
  </button>

  {/* Dropdown Menu */}
  {isOpen && (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white shadow-lg rounded-lg border w-48">
      {languageOptions.map((lang) => (
        <div
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100 ${
            language === lang.code ? "bg-gray-200 font-semibold" : ""
          }`}
        >
          <ReactWorldFlag code={lang.flag} style={{ width: 20, height: 14 }} />
          <span className="ml-2 text-sm">{lang.name}</span>
        </div>
      ))}
    </div>
  )}
</div>

  );
}
