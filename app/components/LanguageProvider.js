"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translations, getTranslation } from "./translations";

// ترجمة أسماء الخدمات (للعرض فقط - القيم في الـ Database تفضل عربي)
const SERVICE_LABELS_EN = {
  "بطارية": "Battery",
  "كاوتش": "Tire",
  "بنزين": "Fuel",
  "كهرباء": "Electrical",
  "ميكانيكا": "Mechanic",
  "صيانة دورية": "Maintenance",
  "عطل": "Breakdown",
  "عطل مفاجئ": "Sudden Breakdown",
};

const LanguageContext = createContext({
  lang: "ar",
  setLang: () => {},
  t: (key) => key,
  dir: "rtl",
  translateService: (s) => s,
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("ar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("roadfix-lang");
    if (saved === "en" || saved === "ar") {
      setLangState(saved);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang, mounted]);

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem("roadfix-lang", newLang);
  };

  const t = (key) => getTranslation(lang, key);
  const dir = lang === "ar" ? "rtl" : "ltr";

  // ترجمة اسم الخدمة للعرض فقط (لو إنجليزي يعرضه بالإنجليزي)
  const translateService = (arabicService) => {
    if (!arabicService) return "";
    if (lang === "ar") return arabicService;
    return SERVICE_LABELS_EN[arabicService] || arabicService;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir, translateService }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}