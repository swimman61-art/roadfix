"use client";

import { useLanguage } from "./LanguageProvider";

export default function Coverage() {
  const { t, lang } = useLanguage();

  const cities = [
    {
      city: lang === "ar" ? "القاهرة — كل المناطق" : "Cairo — All areas",
      status: lang === "ar" ? "متاح الآن ✅" : "Available now ✅",
      color: "bg-green-50 border-green-200 text-green-700"
    },
    {
      city: lang === "ar" ? "الجيزة — كل المناطق" : "Giza — All areas",
      status: lang === "ar" ? "متاح الآن ✅" : "Available now ✅",
      color: "bg-green-50 border-green-200 text-green-700"
    },
    {
      city: lang === "ar" ? "الإسكندرية" : "Alexandria",
      status: lang === "ar" ? "قريباً 🔜" : "Coming soon 🔜",
      color: "bg-yellow-50 border-yellow-200 text-yellow-700"
    },
    {
      city: lang === "ar" ? "باقي المحافظات" : "Other governorates",
      status: lang === "ar" ? "في الخطة 📋" : "In the plan 📋",
      color: "bg-gray-100 border-gray-200 text-gray-500"
    },
  ];

  const stats = [
    {
      num: "+500",
      lbl: lang === "ar" ? "طلب مكتمل" : "Completed orders",
      icon: "✅"
    },
    {
      num: lang === "ar" ? "أسرع وقت" : "Fastest",
      lbl: lang === "ar" ? "بنوصلك بسرعة" : "Fast arrival",
      icon: "⚡"
    },
    {
      num: "98%",
      lbl: lang === "ar" ? "رضا العملاء" : "Customer satisfaction",
      icon: "⭐"
    },
    {
      num: "24/7",
      lbl: lang === "ar" ? "خدمة مستمرة" : "Always available",
      icon: "🕐"
    },
  ];

  return (
    <section className="py-24 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">{t("coverage.badge")}</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6">
              {lang === "ar" ? "دلوقتي في القاهرة والجيزة" : "Now in Cairo & Giza"}
              <span className="block text-red-500">{lang === "ar" ? "وبنكبر معاك" : "and growing with you"}</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              {lang === "ar"
                ? "بدأنا بالقاهرة والجيزة وبنغطي كل مناطقهم. وعيننا على المستقبل — هنوصل لكل مصر قريباً."
                : "We started in Cairo & Giza covering all their areas. With our eye on the future — we'll reach all of Egypt soon."}
            </p>
            <div className="space-y-3">
              {cities.map((c) => (
                <div key={c.city} className={`flex items-center justify-between border rounded-2xl px-5 py-3 ${c.color}`}>
                  <span className="font-bold">{c.city}</span>
                  <span className="text-sm font-bold">{c.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.lbl} className="bg-white border border-gray-100 rounded-3xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-3xl font-black text-slate-900">{s.num}</p>
                <p className="text-gray-500 text-sm mt-1">{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}