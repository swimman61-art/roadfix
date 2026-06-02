"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

const WHATSAPP_NUMBER = "201011174777";

export default function CTA() {
  const { t, lang } = useLanguage();

  const whatsappMsg = lang === "ar"
    ? "مرحبا، عندي عطل في سيارتي وعايز مساعدة"
    : "Hello, my car broke down and I need help";
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <>
      {/* ===== CTA ===== */}
      <section className="py-24 px-4 bg-gradient-to-br from-red-500 to-red-700 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-6">{t("cta.title")}</h2>
          <p className="text-white/80 text-lg leading-relaxed mb-10">
            {t("cta.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/request"
              className="bg-white text-red-600 px-10 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 shadow-xl">
              {t("cta.requestNow")}
            </Link>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 shadow-xl">
              {t("cta.whatsappNow")}
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-2xl font-black mb-3">Road<span className="text-red-500">Fix</span></div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {t("cta.footerDesc")}
              </p>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
                {t("cta.whatsapp")}
              </a>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-gray-300">{t("cta.quickLinks")}</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div><Link href="/" className="hover:text-white transition-colors">{t("nav.home")}</Link></div>
                <div><Link href="/request" className="hover:text-white transition-colors">{t("nav.requestService")}</Link></div>
                <div><Link href="/my-orders" className="hover:text-white transition-colors">{t("nav.myOrders")}</Link></div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-gray-300">{t("cta.services")}</h4>
              <div className="flex flex-wrap gap-2">
                {["بطارية", "كاوتش", "بنزين", "كهرباء", "ميكانيكا", "صيانة دورية", "عطل"].map((s) => (
                  <Link key={s} href={`/request?service=${s}`}
                    className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1 text-gray-400 hover:text-white transition-colors">
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center text-gray-500 text-sm">
            <p>{t("cta.copyright")}</p>
          </div>
        </div>
      </footer>
    </>
  );
}