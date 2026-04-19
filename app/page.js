"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  Battery,
  Fuel,
  Wrench,
  Zap,
  AlertTriangle,
  MapPinned,
  ShieldCheck,
  SearchCheck,
  Route,
  Gauge,
  CircleDot,
  Cog,
  CarFront,
} from "lucide-react";

const services = [
  { name: "بطارية", icon: Battery },
  { name: "كاوتش", icon: Wrench },
  { name: "بنزين", icon: Fuel },
  { name: "كهرباء", icon: Zap },
  { name: "ميكانيكا", icon: Cog },
  { name: "صيانة دورية", icon: CarFront },
  { name: "عطل", icon: AlertTriangle },
];

const trustPoints = [
  "طلب سريع وواضح",
  "GPS أو عنوان يدوي",
  "رقم طلب للتتبع",
];

const features = [
  {
    title: "تحديد موقع مرن",
    text: "يمكن استخدام تحديد الموقع تلقائيًا أو كتابة عنوان يدوي واضح عند الحاجة.",
    icon: MapPinned,
  },
  {
    title: "متابعة منظمة",
    text: "كل طلب يحصل على رقم واضح يمكن استخدامه في التتبع والبحث داخل النظام.",
    icon: SearchCheck,
  },
  {
    title: "تجربة موثوقة",
    text: "حتى لو بعض المزايا لم تعمل على جهاز معين، يظل إرسال الطلب ممكنًا بشكل طبيعي.",
    icon: ShieldCheck,
  },
];

const metrics = [
  { label: "استقبال الطلبات", value: "24/7", icon: Gauge },
  { label: "بدائل للموقع", value: "3", icon: Route },
  { label: "تتبع واضح", value: "RF", icon: CircleDot },
];

export default function Home() {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main
      className="min-h-screen bg-black text-white overflow-x-hidden relative"
      dir="rtl"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_left,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:120px_100%]" />

        <div className="absolute top-[-120px] right-[-140px] h-[460px] w-[460px] rounded-full bg-red-600/14 blur-3xl rf-float" />
        <div className="absolute bottom-[-140px] left-[-120px] h-[460px] w-[460px] rounded-full bg-yellow-500/8 blur-3xl rf-float" />
        <div className="absolute top-[18%] left-[8%] h-[2px] w-[260px] rotate-[-14deg] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-[22%] left-[14%] h-[2px] w-[340px] rotate-[-14deg] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
        <div className="absolute top-[28%] left-[20%] h-[2px] w-[220px] rotate-[-14deg] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-[24%] right-[10%] h-[2px] w-[300px] rotate-[-14deg] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-[20%] right-[16%] h-[2px] w-[230px] rotate-[-14deg] bg-gradient-to-r from-transparent via-red-500/15 to-transparent" />
      </div>

      <section className="relative px-6 pt-10 pb-12 md:pt-16 md:pb-16">
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div className="text-center lg:text-right">
              <div className="rf-fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-lg">
                <span className="h-2.5 w-2.5 rounded-full bg-green-400 rf-soft-pulse" />
                <span className="text-sm text-gray-300">
                  Roadside Assistance System
                </span>
              </div>

              <h1 className="rf-fade-up rf-delay-1 text-4xl md:text-6xl lg:text-7xl font-black leading-[1.04] tracking-tight mb-6">
                تجربة أذكى
                <br />
                لأعطال السيارات
                <br />
                مع <span className="text-red-500">RoadFix</span>
              </h1>

              <p className="rf-fade-up rf-delay-2 text-gray-300 text-lg md:text-xl leading-8 max-w-2xl mx-auto lg:mx-0 mb-8">
                اطلب المساعدة بسرعة، وسجل العطل والموقع، وتابع الطلب برقم واضح
                في واجهة مصممة لتكون عملية، سريعة، وقريبة من تجربة الأنظمة
                الاحترافية الحديثة.
              </p>

              <div className="rf-fade-up rf-delay-3 flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                {trustPoints.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 backdrop-blur-sm rf-card-hover"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="rf-fade-up rf-delay-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link
                  href="/request"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-lg font-bold text-center shadow-[0_14px_35px_rgba(220,38,38,0.35)] transition-all duration-300 hover:-translate-y-1 rf-soft-pulse"
                >
                  اطلب مساعدة الآن
                </Link>

                <Link
                  href="/track"
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl text-lg font-bold text-center transition-all duration-300 hover:-translate-y-1"
                >
                  تتبع الطلب
                </Link>

                {!loading && adminUser && (
                  <Link
                    href="/dashboard"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-bold text-center transition-all duration-300 hover:-translate-y-1"
                  >
                    لوحة التحكم ⚡
                  </Link>
                )}
              </div>

              <div className="rf-fade-up rf-delay-5 grid grid-cols-3 gap-3">
                {metrics.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm rf-card-hover"
                    >
                      <div className="mb-2 flex justify-center">
                        <Icon size={22} className="text-red-500" />
                      </div>
                      <p className="text-2xl md:text-3xl font-black text-white">
                        {item.value}
                      </p>
                      <p className="text-sm text-gray-300 mt-1">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative rf-fade-up rf-delay-3">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-red-600/20 via-transparent to-white/5 blur-2xl" />

              <div className="relative rounded-[2rem] border border-white/10 bg-zinc-950/90 p-6 md:p-7 shadow-2xl backdrop-blur-sm overflow-hidden rf-card-hover">
                <div className="absolute inset-0 pointer-events-none opacity-50">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.12),transparent_35%)]" />
                  <div className="absolute top-8 right-8 h-[2px] w-32 rotate-[-14deg] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                <div className="relative flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-400">واجهة النظام</p>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      طلب، متابعة، وتحكم
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-bold text-gray-200">
                    Luxury+
                  </div>
                </div>

                <div className="relative space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-black/80 p-4 rf-card-hover">
                    <p className="text-sm text-gray-400 mb-2">الطلب</p>
                    <p className="leading-7 text-white">
                      العميل يختار الخدمة ويرسل البيانات الأساسية ووصف المشكلة
                      من واجهة مريحة وواضحة.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/80 p-4 rf-card-hover">
                    <p className="text-sm text-gray-400 mb-2">الموقع</p>
                    <p className="leading-7 text-white">
                      دعم لتحديد الموقع تلقائيًا أو إدخال عنوان يدوي مع بديل
                      Google Maps.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/80 p-4 rf-card-hover">
                    <p className="text-sm text-gray-400 mb-2">التتبع</p>
                    <p className="leading-7 text-white">
                      رقم طلب واضح بعد الإرسال لمتابعة الحالة بسهولة من صفحة
                      التتبع.
                    </p>
                  </div>
                </div>

                <div className="relative mt-6 grid grid-cols-2 gap-3">
                  <Link
                    href="/request"
                    className="rounded-2xl bg-red-600 py-3 text-center font-bold hover:bg-red-700 transition hover:-translate-y-1"
                  >
                    ابدأ الطلب
                  </Link>

                  <Link
                    href="/track"
                    className="rounded-2xl border border-white/10 bg-white/5 py-3 text-center font-bold hover:bg-white/10 transition hover:-translate-y-1"
                  >
                    تتبع الآن
                  </Link>
                </div>

                {!loading && adminUser && (
                  <div className="relative mt-3">
                    <Link
                      href="/dashboard"
                      className="block rounded-2xl bg-blue-600 py-3 text-center font-bold hover:bg-blue-700 transition hover:-translate-y-1"
                    >
                      دخول سريع للوحة التحكم
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[2rem] border border-white/10 bg-zinc-950/80 p-6 md:p-8 shadow-2xl backdrop-blur-sm">
            <div className="grid md:grid-cols-3 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className={`rf-fade-up rf-delay-${index + 1} rounded-3xl border border-white/10 bg-black/70 p-6 shadow-xl rf-card-hover`}
                  >
                    <div className="mb-4 flex justify-start md:justify-center lg:justify-start">
                      <div className="rounded-2xl bg-red-600/10 border border-red-500/20 p-3">
                        <Icon size={28} className="text-red-500" />
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 mb-2">ميزة أساسية</p>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-8">{feature.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div className="text-center md:text-right rf-fade-up">
              <p className="text-red-500 font-bold mb-3">الخدمات</p>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-3">
                اختر الخدمة المناسبة فورًا
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl">
                واجهة سريعة ومباشرة تساعد العميل على بدء الطلب بدون تعقيد.
              </p>
            </div>

            <Link
              href="/request"
              className="hidden md:inline-flex bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-2xl font-bold transition hover:-translate-y-1"
            >
              فتح صفحة الطلب
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <Link
                  key={service.name}
                  href={`/request?service=${service.name}`}
                  className={`rf-fade-up rounded-[1.75rem] border border-white/10 bg-zinc-950/90 p-6 text-center shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:bg-zinc-900 rf-card-hover`}
                  style={{ animationDelay: `${0.08 * (index + 1)}s` }}
                >
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-2xl bg-red-600/10 border border-red-500/20 p-4 transition group-hover:bg-red-600/15 group-hover:scale-105">
                      <Icon size={34} className="text-red-500" />
                    </div>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold hover:text-red-400 transition">
                    {service.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-8 md:p-12 shadow-2xl rf-card-hover">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 h-40 w-40 rounded-full bg-red-600/10 blur-2xl rf-float" />
              <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-white/5 blur-2xl rf-float" />
              <div className="absolute top-10 right-10 h-[2px] w-40 rotate-[-14deg] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="absolute bottom-10 left-10 h-[2px] w-28 rotate-[-14deg] bg-gradient-to-r from-transparent via-red-500/15 to-transparent" />
            </div>

            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div className="text-center lg:text-right rf-fade-up">
                <p className="text-red-500 font-bold mb-3">تجربة متكاملة</p>
                <h2 className="text-3xl md:text-5xl font-extrabold mb-5">
                  اطلب المساعدة
                  <br />
                  أو تابع طلبك الحالي
                </h2>
                <p className="text-gray-300 text-lg leading-8 max-w-2xl mx-auto lg:mx-0">
                  النظام مصمم ليغطي الطلب، التتبع، والإدارة في تجربة واحدة
                  متناسقة وواضحة للعميل وللأدمن.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 rf-fade-up rf-delay-2">
                <Link
                  href="/request"
                  className="rounded-3xl bg-red-600 hover:bg-red-700 text-white p-6 text-center shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <p className="text-sm text-white/80 mb-2">ابدأ الآن</p>
                  <h3 className="text-2xl font-black mb-2">طلب جديد</h3>
                  <p className="text-white/90 leading-7 text-sm">
                    أرسل طلب المساعدة مع بيانات السيارة والموقع.
                  </p>
                </Link>

                <Link
                  href="/track"
                  className="rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 text-white p-6 text-center transition-all duration-300 hover:-translate-y-1"
                >
                  <p className="text-sm text-gray-300 mb-2">متابعة الحالة</p>
                  <h3 className="text-2xl font-black mb-2">تتبع الطلب</h3>
                  <p className="text-gray-300 leading-7 text-sm">
                    استخدم رقم الطلب لمعرفة حالته الحالية بسهولة.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}