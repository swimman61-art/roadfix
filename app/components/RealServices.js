"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function RealServices() {
  const { t, lang } = useLanguage();
  const [showAllServices, setShowAllServices] = useState(false);

  const realServices = [
    {
      image: "/images/battery-service.jpg",
      title: t("realServices.battery.title"),
      desc: t("realServices.battery.desc"),
      service: "بطارية",
      icon: "🔋",
    },
    {
      image: "/images/flat-tire.jpg",
      title: t("realServices.tire.title"),
      desc: t("realServices.tire.desc"),
      service: "كاوتش",
      icon: "🛞",
    },
    {
      image: "/images/hero-roadside.jpg",
      title: t("realServices.roadside.title"),
      desc: t("realServices.roadside.desc"),
      service: "عطل",
      icon: "🚨",
    },
  ];

  // 🆕 4 صور للبطاقة الرابعة (نفس الصور + الصورة المتبقية)
  const collageImages = [
    "/images/battery-service.jpg",
    "/images/flat-tire.jpg",
    "/images/hero-roadside.jpg",
    "/images/car-on-road.jpg",
  ];

  // كل الخدمات المتاحة
  const allServices = [
    { name: lang === "ar" ? "بطارية" : "Battery", icon: "🔋", desc: lang === "ar" ? "شحن أو استبدال فوري" : "Instant charge or replacement", value: "بطارية" },
    { name: lang === "ar" ? "كاوتش" : "Tire", icon: "🛞", desc: lang === "ar" ? "تغيير الإطار في مكانك" : "Tire change at your location", value: "كاوتش" },
    { name: lang === "ar" ? "بنزين" : "Fuel", icon: "⛽", desc: lang === "ar" ? "توصيل وقود لموقعك" : "Fuel delivery to your location", value: "بنزين" },
    { name: lang === "ar" ? "كهرباء" : "Electrical", icon: "⚡", desc: lang === "ar" ? "تشخيص وإصلاح كهربائي" : "Diagnosis and electrical repair", value: "كهرباء" },
    { name: lang === "ar" ? "ميكانيكا" : "Mechanic", icon: "🔧", desc: lang === "ar" ? "فني ميكانيكا متخصص" : "Specialist mechanic technician", value: "ميكانيكا" },
    { name: lang === "ar" ? "صيانة دورية" : "Maintenance", icon: "🛠️", desc: lang === "ar" ? "صيانة شاملة في مكانك" : "Comprehensive maintenance", value: "صيانة دورية" },
    { name: lang === "ar" ? "عطل مفاجئ" : "Sudden Breakdown", icon: "🚨", desc: lang === "ar" ? "تشخيص فوري لأي عطل" : "Instant diagnosis of any issue", value: "عطل" },
  ];

  return (
    <>
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">{t("realServices.badge")}</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4">{t("realServices.title")}</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {t("realServices.subtitle")}
            </p>
          </div>

          {/* 4 بطاقات (3 صور + بطاقة "خدمات تانية" بـ 4 صور صغيرة) */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* الـ 3 بطاقات بالصور */}
            {realServices.map((item) => (
              <Link
                key={item.title}
                href={`/request?service=${item.service}`}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-lg">
                    {item.icon}
                  </div>
                  <div className="absolute bottom-4 right-4 left-4">
                    <h3 className="text-white text-xl font-black drop-shadow-lg">{item.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 leading-relaxed text-sm mb-3 line-clamp-2">{item.desc}</p>
                  <span className="text-red-500 font-bold text-sm group-hover:gap-3 transition-all inline-flex items-center gap-2">
                    {t("realServices.requestService")}
                    <span className="transition-transform group-hover:-translate-x-1">←</span>
                  </span>
                </div>
              </Link>
            ))}

            {/* 🆕 البطاقة الرابعة: 4 صور صغيرة + خدمات تانية */}
            <button
              onClick={() => setShowAllServices(true)}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-right"
            >
              {/* الـ 4 صور كولاج */}
              <div className="relative h-56 overflow-hidden grid grid-cols-2 gap-0.5 bg-gray-100">
                {collageImages.map((img, idx) => (
                  <div key={idx} className="relative overflow-hidden">
                    <img
                      src={img}
                      alt={`Service ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}

                {/* overlay غامق فوق الـ 4 صور */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/80 via-red-500/70 to-red-700/80 flex items-center justify-center">
                  {/* المحتوى فوق الـ overlay */}
                  <div className="text-center text-white px-4">
                    <div className="text-5xl mb-2">⚡</div>
                    <p className="text-2xl font-black drop-shadow-lg">
                      {lang === "ar" ? "+ خدمات تانية" : "+ More services"}
                    </p>
                  </div>
                </div>
              </div>

              {/* النص تحت */}
              <div className="p-5">
                <p className="text-gray-600 leading-relaxed text-sm mb-3 line-clamp-2">
                  {lang === "ar"
                    ? "بنزين، كهرباء، ميكانيكا، صيانة دورية وأكتر"
                    : "Fuel, electrical, mechanic, maintenance & more"}
                </p>
                <span className="text-red-500 font-bold text-sm group-hover:gap-3 transition-all inline-flex items-center gap-2">
                  {lang === "ar" ? "اكتشف الكل" : "Discover all"}
                  <span className="transition-transform group-hover:-translate-x-1">←</span>
                </span>
              </div>
            </button>

          </div>
        </div>
      </section>

      {/* Modal لكل الخدمات */}
      {showAllServices && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] animate-fadeIn"
            onClick={() => setShowAllServices(false)}
          />

          <div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setShowAllServices(false)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between rounded-t-3xl">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">
                    {lang === "ar" ? "🚗 كل خدمات RoadFix" : "🚗 All RoadFix Services"}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {lang === "ar" ? "اختار الخدمة اللي محتاجها" : "Choose the service you need"}
                  </p>
                </div>
                <button
                  onClick={() => setShowAllServices(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-10 h-10 rounded-full font-bold transition flex-shrink-0"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  {allServices.map((svc) => (
                    <Link
                      key={svc.value}
                      href={`/request?service=${svc.value}`}
                      onClick={() => setShowAllServices(false)}
                      className="group flex items-center gap-4 bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-200 rounded-2xl p-4 transition-all"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {svc.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-gray-900 mb-1">{svc.name}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{svc.desc}</p>
                      </div>
                      <span className="text-red-500 font-black text-xl group-hover:translate-x-1 transition-transform flex-shrink-0">
                        ←
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="mt-6 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-4 text-center">
                  <p className="text-amber-800 text-sm leading-7">
                    {lang === "ar"
                      ? "💡 مش لاقي الخدمة اللي محتاجها؟ كلمنا على واتساب"
                      : "💡 Can't find what you need? Contact us on WhatsApp"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}