'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const brands = [
  { name: "Acura", background: "/assets/Acura-Thumb.png", url: "/acura" },
  { name: "Honda", background: "/assets/Honda-humb.png", url: "/honda" },
  { name: "Infiniti", background: "/assets/Infiniti-Thumb.png", url: "/infiniti" },
  { name: "Lexus", background: "/assets/Lexus-Thumb.png", url: "/lexus" },
  { name: "Subaru", background: "/assets/subaru-humb.jpg", url: "/subaru" },
  { name: "Nissan", background: "/assets/Nissan-humb.png", url: "/nissan" },
  { name: "Toyota", background: "/assets/toyota-humb.png", url: "/toyota" },
  { name: "Scion", background: "/assets/Scion-Thumb.png", url: "/scion" },
];

const EngineBrandGrid: React.FC = () => (
  <section className="max-w-7xl mx-auto py-8 px-2">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-10">
      {brands.map((brand) => (
        <motion.div
          key={brand.name}
          className="relative group rounded-md overflow-hidden aspect-square flex flex-col items-center justify-center cursor-pointer bg-gray-900"
          whileHover={{
            scale: 1.05,
            y: -5,
            transition: { type: "spring", stiffness: 300, damping: 20 }
          }}
        >
          <Link
            href={brand.url}
            className="absolute inset-0 z-20 flex items-center justify-center"
          >
            <div className="relative z-10 flex flex-col items-center justify-center">
              <span className="uppercase mt-4 font-bold text-sm md:text-base text-white text-center tracking-widest drop-shadow">
                {brand.name}
              </span>
            </div>
          </Link>

          {/* Background image with smooth scale and slight movement */}
          {brand.background && (
            <motion.div
              className="absolute top-0 left-0 w-full h-full"
              whileHover={{ scale: 1.08, rotate: [0, 1, -1, 0] }}
              transition={{ duration: 0.4 }}
            >
              <Image
  src={brand.background}
  alt={`${brand.name} background`}
  fill
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
  className="object-cover object-center absolute top-0 left-0 w-full h-full opacity-40"
  priority
/>

            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  </section>
);

export default EngineBrandGrid;
