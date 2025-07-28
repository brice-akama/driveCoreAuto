// At the top, after installing
import ReactWorldFlag from "react-world-flags";
import { useLanguage } from "../context/LanguageContext";

const languageOptions = [
  { code: "en", name: "English", flag: "GB" },
  { code: "de", name: "German", flag: "DE" },
  { code: "fr", name: "French", flag: "FR" },
  { code: "es", name: "Spanish", flag: "ES" },
];


export default function SelectLanguageButton() {
  const { language, setLanguage } = useLanguage();

  const langInfo = languageOptions.find(l => l.code === language) || languageOptions[0];

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="language" className="font-medium whitespace-nowrap mt-1"></label>
      <select
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border rounded-md p-2"
      >
        {languageOptions.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <ReactWorldFlag code={langInfo.flag} style={{ width: 30, height: 20 }} />
    </div>
  );
}



 