"use client";
import ReactWorldFlag from "react-world-flags";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const languageOptions = [
  { code: "en", name: "English", flag: "GB" },
  { code: "de", name: "German", flag: "DE" },
  { code: "fr", name: "French", flag: "FR" },
  { code: "es", name: "Spanish", flag: "ES" },
];

export default function FooterLanguageButton() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const langInfo = languageOptions.find((l) => l.code === language) || languageOptions[0];

  return (
    <div className="block md:block lg:hidden fixed bottom-16 left-1/2 transform -translate-x-1/2 md:left-5 md:translate-x-0 z-50">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-transparent border border-gray-300 px-4 py-2 rounded-full text-black shadow-md backdrop-blur-md flex items-center"
      >
        <ReactWorldFlag code={langInfo.flag} style={{ width: 30, height: 20, marginRight: 8 }} />
        <span className="whitespace-nowrap">Select Language</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white shadow-lg rounded-lg border w-48">
          {languageOptions.map((lang) => (
            <div
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
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
