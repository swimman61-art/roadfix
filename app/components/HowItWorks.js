"use client";

import { useLanguage } from "./LanguageProvider";

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    { num: "01", title: t("howItWorks.step1.title"), desc: t("howItWorks.step1.desc") },
    { num: "02", title: t("howItWorks.step2.title"), desc: t("howItWorks.step2.desc") },
    { num: "03", title: t("howItWorks.step3.title"), desc: t("howItWorks.step3.desc") },
  ];

  return (
    <section className="py-24 px-4 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="bg-white/10 text-white/70 font-bold text-sm px-4 py-2 rounded-full border border-white/10">{t("howItWorks.badge")}</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4">{t("howItWorks.title")}</h2>
          <p className="text-white/50 text-lg">{t("howItWorks.subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 right-[20%] left-[20%] h-px bg-gradient-to-l from-transparent via-red-500 to-transparent opacity-30" />
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-500 text-white text-2xl font-black flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30 relative z-10">
                {step.num}
              </div>
              <h3 className="text-xl font-black mb-3">{step.title}</h3>
              <p className="text-white/50 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}