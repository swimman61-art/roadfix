"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

const WHATSAPP_NUMBER = "201011174777";

export default function Hero() {
  const { t, lang } = useLanguage();

  const whatsappMsg = lang === "ar"
    ? "مرحبا، عندي عطل في سيارتي وعايز مساعدة"
    : "Hello, my car broke down and I need help";
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <section className="relative overflow-hidden text-white min-h-screen flex items-center">

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-service.jpg')" }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-red-950/90" />

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-red-500 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-orange-500 blur-[100px] translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* الجانب الأول: العنوان والأزرار */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 text-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-300 font-bold">{t("hero.badge")}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
              {t("hero.title1")}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-orange-400 to-red-400">
                {t("hero.title2")}
              </span>
              <br />
              <span className="text-3xl md:text-4xl font-bold text-white/70">{t("hero.title3")}</span>
            </h1>

            <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-lg">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/request"
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-lg shadow-red-500/30">
                {t("hero.ctaRequest")}
              </Link>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-lg shadow-green-500/30">
                {t("hero.ctaWhatsapp")}
              </a>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-white/50">
              <span>{t("hero.rating")}</span>
              <span>{t("hero.completedOrders")}</span>
              <span>{t("hero.fastDelivery")}</span>
            </div>
          </div>

          {/* 🆕 الجانب الثاني: الكارت التسويقي الجديد */}
          <div className="relative">
            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl border-2 border-red-400/30 rounded-3xl p-8 shadow-2xl">

              {/* أيقونة */}
              <div className="flex justify-center mb-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-5xl shadow-lg shadow-red-500/40">
                  🏠
                </div>
              </div>

              {/* العنوان */}
              <h3 className="text-2xl md:text-3xl font-black text-center mb-4 leading-tight">
                {lang === "ar"
                  ? "ليه تستنى الورشة في الأجازة؟"
                  : "Why wait for the garage on holidays?"}
              </h3>

              {/* الوصف */}
              <p className="text-white/80 text-center text-base md:text-lg leading-relaxed mb-6">
                {lang === "ar"
                  ? "الورشة بتيجي لحد عندك — حتى في أجازات العيد. مفيش بهدلة في المواصلات، ومفيش انتظار."
                  : "The workshop comes to you — even during Eid holidays. No transport hassle, no waiting."}
              </p>

              {/* المميزات */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-xl flex-shrink-0">
                    🎉
                  </div>
                  <p className="font-bold text-sm">
                    {lang === "ar"
                      ? "متاح حتى في أجازات العيد"
                      : "Available even on Eid holidays"}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl flex-shrink-0">
                    🚫
                  </div>
                  <p className="font-bold text-sm">
                    {lang === "ar"
                      ? "مفيش بهدلة في المواصلات"
                      : "No transport hassle"}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center text-xl flex-shrink-0">
                    ⏰
                  </div>
                  <p className="font-bold text-sm">
                    {lang === "ar"
                      ? "متاح 24 ساعة طول الأسبوع"
                      : "Available 24/7 all week"}
                  </p>
                </div>
              </div>

              {/* الإحصائيات */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-2xl font-black text-red-400">+500</p>
                  <p className="text-xs text-white/50 mt-0.5">
                    {lang === "ar" ? "طلب" : "Orders"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-red-400">24/7</p>
                  <p className="text-xs text-white/50 mt-0.5">
                    {lang === "ar" ? "متاح" : "Available"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-red-400">⚡</p>
                  <p className="text-xs text-white/50 mt-0.5">
                    {lang === "ar" ? "أسرع وصول" : "Fast arrival"}
                  </p>
                </div>
              </div>
            </div>

            {/* شارة جذابة */}
            <div className="absolute -top-4 -left-4 bg-yellow-400 text-slate-900 rounded-2xl px-4 py-2 shadow-xl text-sm font-black rotate-[-8deg]">
              {lang === "ar" ? "🎁 خدمة فريدة" : "🎁 Unique service"}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}