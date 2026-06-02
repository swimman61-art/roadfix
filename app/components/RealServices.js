"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function RealServices() {
  const { t } = useLanguage();

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

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">{t("realServices.badge")}</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4">{t("realServices.title")}</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {t("realServices.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {realServices.map((item) => (
            <Link
              key={item.title}
              href={`/request?service=${item.service}`}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  {item.icon}
                </div>
                <div className="absolute bottom-4 right-4 left-4">
                  <h3 className="text-white text-2xl font-black drop-shadow-lg">{item.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed text-sm mb-4">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-red-500 font-bold text-sm group-hover:gap-3 transition-all inline-flex items-center gap-2">
                    {t("realServices.requestService")}
                    <span className="transition-transform group-hover:-translate-x-1">←</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}