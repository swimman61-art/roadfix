"use client";

import Link from "next/link";
import {
  Battery,
  Fuel,
  Wrench,
  Zap,
  AlertTriangle,
} from "lucide-react";

const services = [
  { name: "بطارية", icon: Battery },
  { name: "كاوتش", icon: Wrench },
  { name: "بنزين", icon: Fuel },
  { name: "كهرباء", icon: Zap },
  { name: "عطل", icon: AlertTriangle },
];

const trustPoints = [
  "طلب سريع وواضح",
  "GPS أو عنوان يدوي",
  "رقم طلب للتتبع",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden" dir="rtl">

      {/* HERO */}
      <section className="relative px-6 pt-10 pb-14 md:pt-16 md:pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] right-[-80px] h-80 w-80 rounded-full bg-red-600/12 blur-3xl" />
          <div className="absolute bottom-[-60px] left-[-60px] h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">

            {/* TEXT */}
            <div className="text-center lg:text-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 mb-6">
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="text-sm text-gray-300">
                  Roadside Assistance
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
                تجربة أذكى
                <br />
                لأعطال السيارات
                <br />
                مع <span className="text-red-500">RoadFix</span>
              </h1>

              <p className="text-gray-300 text-lg md:text-xl leading-8 mb-8">
                اطلب المساعدة بسرعة، وسجل العطل والموقع، وتابع الطلب برقم واضح.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                {trustPoints.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/request"
                  className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-2xl font-bold"
                >
                  اطلب الآن
                </Link>

                <Link
                  href="/track"
                  className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-bold"
                >
                  تتبع الطلب
                </Link>
              </div>
            </div>

            {/* CARD */}
            <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6">
              <h2 className="text-2xl font-bold mb-4">كيف يعمل؟</h2>

              <div className="space-y-3 text-sm text-gray-300">
                <p>1. تختار الخدمة</p>
                <p>2. تضيف البيانات والموقع</p>
                <p>3. تستلم رقم الطلب</p>
                <p>4. تتابع الحالة</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-5">
                <Link
                  href="/request"
                  className="bg-red-600 text-center py-3 rounded-xl font-bold"
                >
                  ابدأ
                </Link>

                <Link
                  href="/track"
                  className="bg-white/5 border border-white/10 text-center py-3 rounded-xl font-bold"
                >
                  تتبع
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-3">
              الخدمات
            </h2>
            <p className="text-gray-400">
              اختار نوع العطل وابدأ الطلب فورًا
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">

            {services.map((service) => {
              const Icon = service.icon;

              return (
                <Link
                  key={service.name}
                  href={`/request?service=${service.name}`}
                  className="group rounded-3xl border border-white/10 bg-zinc-950 p-6 text-center hover:border-red-500/40 transition"
                >
                  <div className="mb-4 flex justify-center">
                    <Icon size={40} className="text-red-500" />
                  </div>

                  <h3 className="font-bold group-hover:text-red-400">
                    {service.name}
                  </h3>
                </Link>
              );
            })}

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-14">
        <div className="max-w-7xl mx-auto bg-red-600 rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            محتاج مساعدة دلوقتي؟
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request"
              className="bg-black px-6 py-3 rounded-xl font-bold"
            >
              اطلب الآن
            </Link>

            <Link
              href="/track"
              className="bg-white text-black px-6 py-3 rounded-xl font-bold"
            >
              تتبع الطلب
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}