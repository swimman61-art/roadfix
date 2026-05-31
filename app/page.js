import WhatsAppButton from "./components/WhatsAppButton";
import Hero from "./components/Hero";
import RealServices from "./components/RealServices";
import Features from "./components/Features";
import Comparison from "./components/Comparison";
import Services from "./components/Services";
import HowItWorks from "./components/HowItWorks";
import Reviews from "./components/Reviews";
import Coverage from "./components/Coverage";
import CTA from "./components/CTA";

export const metadata = {
  title: "RoadFix — فني السيارات جاي ليك",
  description: "مساعدة سيارتك في مكانك. بطارية، كاوتش، بنزين، ميكانيكا — فني متخصص يوصلك في أسرع وقت في القاهرة.",
};

export default function HomePage() {
  return (
    <main dir="rtl" className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <WhatsAppButton />
      <Hero />
      <RealServices />
      <Features />
      <Comparison />
      <Services />
      <HowItWorks />
      <Reviews />
      <Coverage />
      <CTA />
    </main>
  );
}