"use client";

import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const toggleLang = () => {
    setLang(lang === "ar" ? "en" : "ar");
  };

  return (
    <button
      onClick={toggleLang}
      className="px-3 py-2 rounded-xl text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center gap-2"
      title={lang === "ar" ? "Switch to English" : "تبديل للعربية"}
    >
      <span className="text-base">🌐</span>
      <span>{lang === "ar" ? "EN" : "ع"}</span>
    </button>
  );
}