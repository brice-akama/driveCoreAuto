import ReactWorldFlag from "react-world-flags";
import { useLanguage } from "../context/LanguageContext";
import { useState, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation"; // Next.js 13+ client hooks

const languageOptions = [
  { code: "en", name: "English", flag: "GB" },
  { code: "de", name: "German", flag: "DE" },
  { code: "fr", name: "French", flag: "FR" },
  { code: "es", name: "Spanish", flag: "ES" },
];

export default function SelectLanguageButton() {
  const { language, setLanguage } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Next.js router & helpers
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const langInfo =
    languageOptions.find((l) => l.code === language) || languageOptions[0];

  const handleMouseEnter = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsHovered(false);
    }, 400);
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);

    // Build new URLSearchParams object to update lang param
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("lang", newLang);

    // Push new URL with updated lang param — this triggers page reload & re-render
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className="relative inline-block text-left z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Selected Language Button */}
      <div className="flex items-center cursor-pointer px-2 py-2 border rounded-md hover:bg-gray-100">
        <ReactWorldFlag code={langInfo.flag} style={{ width: 24, height: 16 }} />
        <span className="ml-2 font-medium text-sm">{langInfo.name}</span>
      </div>

      {/* Hover Dropdown */}
      {isHovered && (
        <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow-lg">
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
