"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function Comparison() {
  const { t } = useLanguage();

  const comparison = [
    { feature: t("comparison.features.toYou"), roadfix: true, garage: false },
    { feature: t("comparison.features.available24"), roadfix: true, garage: false },
    { feature: t("comparison.features.waitTime"), roadfix: t("comparison.features.waitFast"), garage: t("comparison.features.waitHours") },
    { feature: t("comparison.features.priceUpfront"), roadfix: true, garage: false },
    { feature: t("comparison.features.tracking"), roadfix: true, garage: false },
    { feature: t("comparison.features.noCrowd"), roadfix: true, garage: false },
  ];

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">

        <div className="grid md:grid-cols-2 gap-8 items-center mb-16 bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 md:p-10 border border-red-100">
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/images/customer-checking.jpg"
              alt="Customer checking car"
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          <div className="text-center md:text-right">
            <span className="bg-white text-red-500 font-bold text-xs px-3 py-1.5 rounded-full inline-block mb-4 shadow-sm">
              {t("comparison.sectionBadge")}
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 leading-snug">
              {t("comparison.sectionTitle")}
            </h3>
            <p className="text-gray-600 leading-8 mb-5">
              {t("comparison.sectionDesc")}
            </p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="bg-white text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200">
                {t("comparison.tag1")}
              </span>
              <span className="bg-white text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200">
                {t("comparison.tag2")}
              </span>
              <span className="bg-white text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200">
                {t("comparison.tag3")}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">{t("comparison.badge")}</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4">{t("comparison.title")}</h2>
          <p className="text-gray-500 text-lg">{t("comparison.subtitle")}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="grid grid-cols-3 bg-slate-900 text-white">
              <div className="p-4 font-bold text-gray-400 text-sm">{t("comparison.tableFeature")}</div>
              <div className="p-4 text-center font-black text-red-400 border-x border-white/10">
                Road<span className="text-white">Fix</span>
              </div>
              <div className="p-4 text-center font-bold text-gray-400 text-sm">{t("comparison.tableRoadfix")}</div>
            </div>

            {comparison.map((row, i) => (
              <div key={i}
                className={`grid grid-cols-3 border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="p-4 font-bold text-gray-700 text-sm flex items-center">{row.feature}</div>
                <div className="p-4 text-center border-x border-gray-100 flex items-center justify-center">
                  {row.roadfix === true
                    ? <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-black text-lg">✓</span>
                    : <span className="font-black text-red-500">{row.roadfix}</span>}
                </div>
                <div className="p-4 text-center flex items-center justify-center">
                  {row.garage === false
                    ? <span className="w-8 h-8 rounded-full bg-red-100 text-red-400 flex items-center justify-center font-black text-lg">✗</span>
                    : <span className="font-bold text-gray-500 text-sm">{row.garage}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/request"
              className="bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-lg shadow-red-500/20 inline-block">
              {t("comparison.tryNow")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}