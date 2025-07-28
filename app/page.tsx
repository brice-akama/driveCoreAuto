// Import necessary modules
import { Metadata } from "next";
import React from "react";
import Head from "next/head";
import HeroImage from "./components/HeroImage";
import AboutEnginesSection from "./components/AboutEnginesSection";
import EngineBrandGrid from "./components/EngineBrandGrid";
import BestSeller from "./components/BestSeller";
import BlogPost from "./components/BlogPost";


export const metadata: Metadata = {
  title: "Home - 16Zips",
  description: "Discover premium cannabis products at 16Zips. From flower to edibles and concentrates, we offer top-shelf quality, fast shipping, and a discreet shopping experience.",
  keywords: "cannabis, weed, marijuana, THC, CBD, cannabis flower, cannabis edibles, cannabis concentrates, 16Zips, premium weed, online cannabis store",
  robots: "index, follow",
};


const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Head>
        {/* Canonical URL */}
        <link rel="canonical" href="https://yourwebsite.com" />
      </Head>
      {/* Navbar will stay at the top */}
      <HeroImage />
      <AboutEnginesSection />
      <EngineBrandGrid  />
      <BestSeller />
      <BlogPost  />
      
    </div>
  );
};

export default Home;