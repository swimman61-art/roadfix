"use client";

import Link from "next/link";

const services = [
  { name: "بطارية", icon: "🔋" },
  { name: "كاوتش", icon: "🛞" },
  { name: "بنزين", icon: "⛽" },
  { name: "كهرباء", icon: "⚡" },
  { name: "عطل", icon: "🚨" },
];

const trustPoints = [
  "طلب سريع وواضح",
  "GPS أو عنوان يدوي",
  "رقم طلب للتتبع",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden" dir="rtl">
      <section className="relative px-6 pt-10 pb-14 md:pt-16 md:pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] right-[-80px] h-80 w-80 rounded-full bg-red-600/12 blur-3xl" />
          <div className="absolute bottom-[-60px] left-[-60px] h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
            <div className="text-center lg:text-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="text-sm text-gray-300">
                  Roadside Assistance System
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6">
                تجربة أذكى
                <br />
                لطلبات أعطال السيارات
                <br />
                مع <span className="text-red-500">RoadFix</span>
              </h1>

              <p className="text-gray-300 text-lg md:text-xl leading-8 max-w-2xl mx-auto lg:mx-0 mb-8">
                اطلب المساعدة بسرعة، أرسل تفاصيل العطل وبيانات العربية والموقع،
                ثم تابع حالة الطلب برقم واضح في واجهة مصممة لتكون سهلة، أنيقة،
                وعملية.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                {trustPoints.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/request"
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-lg font-bold text-center shadow-[0_14px_35px_rgba(220,38,38,0.35)] transition-all duration-300 hover:-translate-y-1"
                >
                  اطلب مساعدة الآن
                </Link>

                <Link
                  href="/track"
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl text-lg font-bold text-center transition-all duration-300 hover:-translate-y-1"
                >
                  تتبع الطلب
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-red-600/20 via-transparent to-white/5 blur-2xl" />
              <div className="relative rounded-[2rem] border border-white/10 bg-zinc-950/90 p-6 md:p-7 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-400">واجهة النظام</p>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      طلب، متابعة، وتحكم
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-bold text-gray-200">
                    Luxury
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-black/80 p-4">
                    <p className="text-sm text-gray-400 mb-2">الطلب</p>
                    <p className="leading-7 text-white">
                      العميل يختار الخدمة ويرسل البيانات الأساسية ووصف المشكلة
                      من واجهة مريحة وواضحة.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/80 p-4">
                    <p className="text-sm text-gray-400 mb-2">الموقع</p>
                    <p className="leading-7 text-white">
                      دعم لتحديد الموقع تلقائيًا أو إدخال عنوان يدوي مع بديل
                      Google Maps.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/80 p-4">
                    <p className="text-sm text-gray-400 mb-2">التتبع</p>
                    <p className="leading-7 text-white">
                      رقم طلب واضح بعد الإرسال لمتابعة الحالة بسهولة من صفحة
                      التتبع.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Link
                    href="/request"
                    className="rounded-2xl bg-red-600 py-3 text-center font-bold hover:bg-red-700 transition"
                  >
                    ابدأ الطلب
                  </Link>

                  <Link
                    href="/track"
                    className="rounded-2xl border border-white/10 bg-white/5 py-3 text-center font-bold hover:bg-white/10 transition"
                  >
                    تتبع الآن
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-xl">
              <p className="text-sm text-gray-400 mb-2">مرونة في الموقع</p>
              <h3 className="text-2xl font-bold mb-3">GPS أو عنوان يدوي</h3>
              <p className="text-gray-400 leading-8">
                حتى إذا لم يعمل تحديد الموقع على بعض الهواتف، يظل الطلب قابلًا
                للإرسال بشكل طبيعي.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-xl">
              <p className="text-sm text-gray-400 mb-2">متابعة منظمة</p>
              <h3 className="text-2xl font-bold mb-3">رقم طلب واضح</h3>
              <p className="text-gray-400 leading-8">
                كل طلب يحصل على رقم يمكن استخدامه في التتبع والبحث داخل الداشبورد.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-xl">
              <p className="text-sm text-gray-400 mb-2">إدارة احترافية</p>
              <h3 className="text-2xl font-bold mb-3">Dashboard عملي</h3>
              <p className="text-gray-400 leading-8">
                عرض الحالات والبحث والتحديث السريع للطلبات من مكان واحد بشكل منظم.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div className="text-center md:text-right">
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
              className="hidden md:inline-flex bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-2xl font-bold"
            >
              فتح صفحة الطلب
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {services.map((service) => (
              <Link
                key={service.name}
                href={`/request?service=${service.name}`}
                className="group rounded-[1.75rem] border border-white/10 bg-zinc-950 p-6 text-center shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:bg-zinc-900"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-lg md:text-xl font-bold group-hover:text-red-400 transition">
                  {service.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-8 md:p-12 shadow-2xl">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 h-40 w-40 rounded-full bg-red-600/10 blur-2xl" />
              <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
            </div>

            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div className="text-center lg:text-right">
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

              <div className="grid sm:grid-cols-2 gap-4">
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