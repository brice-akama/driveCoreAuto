"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/context/LanguageContext";

const HeroImage = () => {
  const image = "/assets/hero.png";
  const { translate } = useLanguage();
  const [translatedTitle, setTranslatedTitle] = useState("Engineered to Perform");

  useEffect(() => {
    const translateTitle = async () => {
      try {
        const translated = await translate("Engineered to Perform");
        if (translated) {
          setTranslatedTitle(translated);
        }
      } catch (error) {
        // fallback to default title on error
        setTranslatedTitle("Engineered to Perform");
      }
    };

    translateTitle();
  }, [translate]);

  return (
    <div className="relative w-full h-[500px] sm:h-[500px] md:h-[600px] lg:h-[650px] xl:h-[750px] overflow-hidden">
      <Image
        src={image}
        alt="DriveCore Auto hero image"
        fill
        style={{ objectFit: "cover", objectPosition: "center" }}
        className="transition-all duration-1000"
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0  bg-opacity-60"></div>

      {/* Centered text */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <h1
          className="text-white font-extrabold text-center"
          style={{
            fontSize: "clamp(1.8rem, 5vw, 3.5rem)", // fluid scaling from ~29px to 56px
            letterSpacing: "0.2em",
            lineHeight: 1.1,
            maxWidth: "90vw",
            wordBreak: "break-word",
          }}
        >
          {translatedTitle}
        </h1>
      </div>
    </div>
  );
};

export default HeroImage;
