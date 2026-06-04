"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function Comparison() {
  const { t, lang } = useLanguage();

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">

        {/* قسم الصورة + الجملة التأثيرية فقط */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 md:p-10 border border-red-100">

          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/images/customer-checking.jpg"
              alt="Customer checking car"
              className="w-full h-72 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          <div className={lang === "ar" ? "text-center md:text-right" : "text-center md:text-left"}>
            <span className="bg-white text-red-500 font-bold text-xs px-3 py-1.5 rounded-full inline-block mb-4 shadow-sm">
              {t("comparison.sectionBadge")}
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-snug">
              {t("comparison.sectionTitle")}
            </h3>
            <p className="text-gray-600 leading-8 mb-6 text-base md:text-lg">
              {t("comparison.sectionDesc")}
            </p>

            <div className={`flex flex-wrap gap-2 mb-6 ${lang === "ar" ? "justify-center md:justify-start" : "justify-center md:justify-start"}`}>
              <span className="bg-white text-gray-700 text-sm font-bold px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                {t("comparison.tag1")}
              </span>
              <span className="bg-white text-gray-700 text-sm font-bold px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                {t("comparison.tag2")}
              </span>
              <span className="bg-white text-gray-700 text-sm font-bold px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                {t("comparison.tag3")}
              </span>
            </div>

            <Link href="/request"
              className="inline-block bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-lg shadow-red-500/20">
              {t("comparison.tryNow")}
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}