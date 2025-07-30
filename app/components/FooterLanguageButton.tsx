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
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-transparent border border-gray-300 px-4 py-2 rounded-full text-blue-500 shadow-md backdrop-blur-md flex items-center md:hidden"
      >
        <ReactWorldFlag code={langInfo.flag} style={{ width: 30, height: 20, marginRight: 8 }} />
        <span className="md:hidden whitespace-nowrap">Language</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white shadow-lg rounded-lg border p-2 w-40">
          <select
            id="language"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setIsOpen(false);
            }}
            className="w-full p-2 border rounded-md"
          >
            {languageOptions.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
