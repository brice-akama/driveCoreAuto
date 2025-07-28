'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from "@/app/context/LanguageContext";

const BRANDS = [
  'toyota',
  'honda',
  'acura',
  'nissan',
  'subaru',
  'lexus',
  'infiniti',
  'wheels',
  'subframe',
  'accessories',
  'bumpers',
  'transmission',
  'free-shipping',
  'top-sellers',
  'mercedes',
];

type BrandLinksNavProps = {
  currentBrand: string;
};

export default function BrandLinksNav({ currentBrand }: BrandLinksNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { translate } = useLanguage();
  const [translatedBrands, setTranslatedBrands] = useState<Record<string, string>>({});
  const [categoryLabel, setCategoryLabel] = useState("Categories");

  // Map brand key to readable label before translation
  const getDefaultLabel = (brand: string): string => {
    switch (brand) {
      case 'wheels':
        return 'Wheels and Tires';
      case 'mercedes':
        return 'Mercedes Benz';
      case 'top-sellers':
        return 'Top Sellers';
      case 'free-shipping':
        return 'Free Shipping';
      default:
        return brand.charAt(0).toUpperCase() + brand.slice(1);
    }
  };

  useEffect(() => {
    const loadTranslations = async () => {
      const result: Record<string, string> = {};

      for (const brand of BRANDS) {
        const label = getDefaultLabel(brand);
        const translated = await translate(label);
        result[brand] = translated;
      }

      const translatedCategory = await translate("Categories");

      setTranslatedBrands(result);
      setCategoryLabel(translatedCategory);
    };

    loadTranslations();
  }, [translate]);

  return (
    <section className="w-full bg-black mt-20 md:mt-40 rounded">
      {/* Desktop */}
      <div className="hidden md:flex flex-wrap justify-center items-center gap-4 px-4 py-12">
        {BRANDS.map((brand) => {
          const label = translatedBrands[brand] || getDefaultLabel(brand);
          const isCurrent = brand === currentBrand;

          return (
            <Link
              key={brand}
              href={`/${brand}`}
              className={`text-lg font-semibold whitespace-nowrap transition 
                ${isCurrent ? 'text-blue-400 underline cursor-default' : 'text-gray-300 hover:text-blue-400'}
              `}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden relative px-4 py-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center gap-2 text-white w-full"
        >
          <span className="font-semibold text-lg mt-2">{categoryLabel}</span>
          <ChevronDown className={`w-5 h-5 transition-transform mt-2 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <ul className="mt-4 rounded text-white shadow z-50 bg-black">
            {BRANDS.map((brand) => {
              const label = translatedBrands[brand] || getDefaultLabel(brand);
              const isCurrent = brand === currentBrand;

              return (
                <li key={brand}>
                  <Link
                    href={`/${brand}`}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 border-b border-gray-700 ${
                      isCurrent ? 'text-blue-500 font-semibold' : ''
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
