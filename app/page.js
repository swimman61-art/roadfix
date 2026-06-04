"use client";

import { useLanguage } from "./components/LanguageProvider";
import WhatsAppButton from "./components/WhatsAppButton";
import Hero from "./components/Hero";
import RealServices from "./components/RealServices";
import Features from "./components/Features";
import Comparison from "./components/Comparison";
import HowItWorks from "./components/HowItWorks";
import Reviews from "./components/Reviews";
import Coverage from "./components/Coverage";
import CTA from "./components/CTA";

export default function HomePage() {
  const { dir } = useLanguage();

  return (
    <main dir={dir} className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <WhatsAppButton />
      <Hero />
      <RealServices />
      <Features />
      <Comparison />
      <HowItWorks />
      <Reviews />
      <Coverage />
      <CTA />
    </main>
  );
}