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
  'scion',
  'subframe',
  
  
  'free-shipping',
  'top-sellers',
  'accessories',
  
];

const TRANSMISSION_LINKS = [
  { href: '/transmissions/toyota/automatic', label: 'Toyota Transmissions Automatic' },
  { href: '/transmissions/toyota/manual', label: 'Toyota Transmissions Manual' },
  { href: '/transmissions/nissan/automatic', label: 'Nissan Transmissions Automatic' },
  { href: '/transmissions/nissan/manual', label: 'Nissan Transmissions Manual' },
  { href: '/transmissions/honda/automatic', label: 'Honda Transmissions Automatic' },
  { href: '/transmissions/honda/manual', label: 'Honda Transmissions Manual' },
  { href: '/transmissions/acura/automatic', label: 'Acura Transmissions Automatic' },
  { href: '/transmissions/acura/manual', label: 'Acura Transmissions Manual' },
  { href: '/transmissions/subaru/automatic', label: 'Subaru Transmissions Automatic' },
  { href: '/transmissions/subaru/manual', label: 'Subaru Transmissions Manual' },
  { href: '/transmissions/lexus/automatic', label: 'Lexus Transmissions Automatic' },
  { href: '/transmissions/lexus/manual', label: 'Lexus Transmissions Manual' },
  { href: '/transmissions/infiniti/automatic', label: 'Infiniti Transmissions Automatic' },
  { href: '/transmissions/infiniti/manual', label: 'Infiniti Transmissions Manual' },
  { href: '/transmissions/scion/automatic', label: 'Scion Transmissions Automatic' },
  { href: '/transmissions/scion/manual', label: 'Scion Transmissions Manual' },
];

type BrandLinksNavProps = {
  currentBrand: string;
  currentPath?: string;
};

export default function BrandLinksNav({ currentBrand, currentPath }: BrandLinksNavProps) {
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isTransmissionsOpen, setIsTransmissionsOpen] = useState(false);
  const { translate } = useLanguage();
  const [translatedBrands, setTranslatedBrands] = useState<Record<string, string>>({});
  const [translatedTransmissionHeading, setTranslatedTransmissionHeading] = useState('Transmissions');
  const [categoryLabel, setCategoryLabel] = useState("Categories");
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
const [mobileBrandToggles, setMobileBrandToggles] = useState<Record<string, boolean>>({});




  const getDefaultLabel = (brand: string): string => {
    switch (brand) {
      case 'wheels':
        
      case 'top-sellers':
        return 'Top Sellers';
      case 'free-shipping':
        return 'Free Shipping';
      case 'scion':
        return 'Scion';
      default:
        return brand.charAt(0).toUpperCase() + brand.slice(1);
    }
  };

  const toggleMobileBrand = (brand: string) => {
  setMobileBrandToggles((prev) => ({
    ...prev,
    [brand]: !prev[brand],
  }));
};


  useEffect(() => {
    async function loadTranslations() {
      const brandTranslations: Record<string, string> = {};
      for (const brand of BRANDS) {
        const label = getDefaultLabel(brand);
        const translated = await translate(label);
        brandTranslations[brand] = translated || label;
      }
      const transmissionHeading = await translate('Transmissions') || 'Transmissions';
      const categoryLabelTranslated = await translate('Categories') || 'Categories';

      setTranslatedBrands(brandTranslations);
      setTranslatedTransmissionHeading(transmissionHeading);
      setCategoryLabel(categoryLabelTranslated);
    }
    loadTranslations();
  }, [translate]);

  const isTransmissionActive = (href: string) => {
    if (!currentPath) return false;
    return currentPath.startsWith(href);
  };

  return (
    <section className="w-full bg-black mt-20 md:mt-40 rounded">
      {/* Brands section - always visible on md+ */}
      <div className="hidden md:flex flex-wrap justify-center items-center gap-6 px-4 py-12">
  {BRANDS.map((brand) => {
    const label = translatedBrands[brand] || getDefaultLabel(brand);
    const isCurrent = brand === currentBrand;
    const isCarBrand = ['toyota', 'honda', 'nissan', 'subaru', 'acura', 'lexus', 'infiniti', 'scion'].includes(brand);

    return (
      <div
  key={brand}
  className="relative"
  onMouseEnter={() => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setHoveredBrand(brand);
  }}
  onMouseLeave={() => {
    const timeout = setTimeout(() => setHoveredBrand(null), 200); // 200ms delay
    setHoverTimeout(timeout);
  }}
>

        <Link
          href={`/${brand}`}
          className={`text-lg font-semibold whitespace-nowrap transition 
            ${isCurrent ? 'text-blue-400 underline cursor-default' : 'text-gray-300 hover:text-blue-400'}`}
          aria-current={isCurrent ? 'page' : undefined}
        >
          {label}
        </Link>

        {isCarBrand && hoveredBrand === brand && (
  <div className="absolute left-0 mt-2 bg-black text-white rounded shadow-lg z-50 min-w-[180px]">

           <Link
  href={`/${brand}`}
  className="block px-4 py-2 hover:bg-gray-800 border-b border-gray-700"
>
  {label} Engines
</Link>

            <Link
              href={`/swaps/${brand}`}
              className="block px-4 py-2 hover:bg-gray-800"
            >
              {label} Swaps
            </Link>
          </div>
        )}
      </div>
    );
  })}
</div>


      {/* Transmission toggle button on md+ */}
      <div className="hidden md:flex justify-center border-t border-gray-700 py-4 cursor-pointer select-none">
        <button
          onClick={() => setIsTransmissionsOpen(!isTransmissionsOpen)}
          className="flex items-center gap-2 text-white font-semibold text-lg"
          aria-expanded={isTransmissionsOpen}
          aria-controls="transmission-links"
          type="button"
        >
          {translatedTransmissionHeading}
          <ChevronDown className={`w-5 h-5 transition-transform ${isTransmissionsOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Transmission links on md+ (collapsed by default) */}
      <div
        id="transmission-links"
        className={`hidden md:flex flex-wrap justify-center gap-4 px-4 pb-12 transition-max-height duration-300 ease-in-out overflow-hidden ${
          isTransmissionsOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ transitionProperty: 'max-height, opacity' }}
      >
        {TRANSMISSION_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-gray-300 hover:text-blue-400 whitespace-nowrap font-medium transition ${
              isTransmissionActive(href) ? 'text-blue-400 underline cursor-default' : ''
            }`}
            aria-current={isTransmissionActive(href) ? 'page' : undefined}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Mobile section */}
      <div className="md:hidden relative px-4 py-6">
        {/* Brands toggle */}
        <button
          onClick={() => setIsBrandsOpen(!isBrandsOpen)}
          className="flex items-center justify-center gap-2 text-white w-full mb-4"
          aria-expanded={isBrandsOpen}
          aria-controls="brand-links-mobile"
          type="button"
        >
          <span className="font-semibold text-lg">{categoryLabel}</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${isBrandsOpen ? 'rotate-180' : ''}`} />
        </button>
        {isBrandsOpen && (
          <ul
            id="brand-links-mobile"
            className="rounded text-white shadow z-50 bg-black mb-6"
          >
            {BRANDS.map((brand) => {
  const label = translatedBrands[brand] || getDefaultLabel(brand);
  const isCurrent = brand === currentBrand;
  const isCarBrand = ['toyota', 'honda', 'nissan', 'subaru', 'acura', 'lexus', 'infiniti', 'scion'].includes(brand);
  const isOpen = mobileBrandToggles[brand] || false;

  return (
    <li key={brand} className="border-b border-gray-700">
      <div className="flex justify-between items-center px-4 py-2">
        <Link
          href={`/${brand}`}
          onClick={() => setIsBrandsOpen(false)}
          className={`flex-1 ${isCurrent ? 'text-blue-500 font-semibold' : ''}`}
        >
          {label}
        </Link>
        {isCarBrand && (
          <button
            onClick={() => toggleMobileBrand(brand)}
            className="text-white"
            aria-expanded={isOpen}
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {isCarBrand && isOpen && (
        <div className="pl-6 pb-2 space-y-1">
          <Link
            href={`/${brand}`}
            onClick={() => setIsBrandsOpen(false)}
            className="block text-white hover:underline transition"
          >
            {label} Engines
          </Link>
          <Link
            href={`/swaps/${brand}`}
            onClick={() => setIsBrandsOpen(false)}
            className="block text-white hover:underline transition"
          >
            {label} Swaps
          </Link>
        </div>
      )}
    </li>
  );
})}

          </ul>
        )}

        {/* Transmissions toggle */}
        <button
          onClick={() => setIsTransmissionsOpen(!isTransmissionsOpen)}
          className="flex items-center justify-center gap-2 text-white w-full"
          aria-expanded={isTransmissionsOpen}
          aria-controls="transmission-links-mobile"
          type="button"
        >
          <span className="font-semibold text-lg">{translatedTransmissionHeading}</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${isTransmissionsOpen ? 'rotate-180' : ''}`} />
        </button>
        {isTransmissionsOpen && (
          <ul
            id="transmission-links-mobile"
            className="rounded text-white shadow z-50 bg-black mt-4"
          >
            {TRANSMISSION_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsTransmissionsOpen(false)}
                  className={`block px-4 py-2 border-b border-gray-700 ${
                    isTransmissionActive(href) ? 'text-blue-500 font-semibold' : ''
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
