"use client";

import Image from "next/image";
import Link from "next/link";

const brands = [
  {
    name: "Acura",
    background: "/assets/Acura-Thumb.png",
    url: "/acura?category=k20a",
  },
  {                 
    name: "Honda",
    background: "/assets/Honda-humb.png",
    url: "/honda?category=k20a",
  },
  {
    name: "Infiniti",
    background: "/assets/Infiniti-Thumb.png",
    url: "/infiniti?category=vq35de",
  },
  {
    name: "Lexus",
    background: "/assets/Lexus-Thumb.png",
    url: "/lexus?category=es-250",
  },
  {
    name: "Subaru",
    background: "/assets/subaru-humb.jpg",
    url: "/subaru?category=ej20",
  },
  {
    name: "Nissan",
    background: "/assets/Nissan-humb.png",
    url: "/nissan?category=qr20de",
  },
  {
    name: "Toyota",
    background: "/assets/toyota-humb.png",
    url: "/toyota?category=1kd-ftv",
  },
  {
    name: "Other",
    background: "/assets/Scion-Thumb.png",
    url: "/mercedes?category=m274",
    customIcon: true,
  },
];

const EngineBrandGrid: React.FC = () => (
  <section className="max-w-7xl mx-auto py-8 px-2">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-10">
      {brands.map((brand) => (
        <Link
          key={brand.name}
          href={brand.url}
          className="relative group rounded-md overflow-hidden aspect-square flex flex-col items-center justify-center bg-gray-900"
        >
          {/* Background image */}
          {brand.background && (
            <Image
              src={brand.background}
              alt={`${brand.name} background`}
              fill
              className="object-cover object-center absolute top-0 left-0 w-full h-full opacity-40"
              priority
            />
          )}

          {/* Content overlay */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {brand.customIcon ? (
              <div className="flex flex-col items-center mb-2 space-y-1">
                <span className="block w-4 h-4 bg-red-600 rounded-full"></span>
                <span className="block w-4 h-4 bg-red-600 rounded-full"></span>
                <span className="block w-4 h-4 bg-red-600 rounded-full"></span>
              </div>
            ) : null}

            {/* Removed productsCount rendering */}

            <span className="uppercase mt-4 font-bold text-sm md:text-base text-white text-center tracking-widest drop-shadow">
              {brand.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

export default EngineBrandGrid;
