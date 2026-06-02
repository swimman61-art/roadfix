"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function Services() {
  const { t } = useLanguage();

  const services = [
    { key: "battery", name: t("services.list.battery.name"), icon: "🔋", desc: t("services.list.battery.desc"), serviceParam: "بطارية" },
    { key: "tire", name: t("services.list.tire.name"), icon: "🛞", desc: t("services.list.tire.desc"), serviceParam: "كاوتش" },
    { key: "fuel", name: t("services.list.fuel.name"), icon: "⛽", desc: t("services.list.fuel.desc"), serviceParam: "بنزين" },
    { key: "electric", name: t("services.list.electric.name"), icon: "⚡", desc: t("services.list.electric.desc"), serviceParam: "كهرباء" },
    { key: "mechanic", name: t("services.list.mechanic.name"), icon: "🔧", desc: t("services.list.mechanic.desc"), serviceParam: "ميكانيكا" },
    { key: "maintenance", name: t("services.list.maintenance.name"), icon: "🛠️", desc: t("services.list.maintenance.desc"), serviceParam: "صيانة دورية" },
    { key: "breakdown", name: t("services.list.breakdown.name"), icon: "🚨", desc: t("services.list.breakdown.desc"), serviceParam: "عطل" },
  ];

  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">{t("services.badge")}</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4">{t("services.title")}</h2>
          <p className="text-gray-500 text-lg">{t("services.subtitle")}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {services.map((svc) => (
            <Link key={svc.key} href={`/request?service=${svc.serviceParam}`}
              className="group bg-white hover:bg-red-500 border-2 border-gray-100 hover:border-red-500 rounded-3xl p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/20">
              <span className="text-4xl mb-3 block">{svc.icon}</span>
              <p className="font-black text-gray-900 group-hover:text-white transition-colors">{svc.name}</p>
              <p className="text-xs text-gray-400 group-hover:text-red-100 mt-1 leading-relaxed transition-colors">{svc.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}