"use client";

import Link from "next/link";

const services = [
  { name: "بطارية", icon: "🔋" },
  { name: "كاوتش", icon: "🛞" },
  { name: "بنزين", icon: "⛽" },
  { name: "كهرباء", icon: "⚡" },
  { name: "عطل", icon: "🚨" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white" dir="rtl">
      <section className="px-6 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="text-center md:text-right">
              <p className="text-red-500 font-bold mb-4 text-sm md:text-base">
                خدمة مساعدة سيارات على الطريق
              </p>

              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
                عربيتك عطلت؟
                <br />
                <span className="text-red-500">RoadFix</span> جاي لك لحد عندك
              </h1>

              <p className="text-gray-300 text-lg leading-8 mb-8">
                اطلب المساعدة بسرعة في أي مكان داخل القاهرة، وابعت تفاصيل
                العطل وبيانات العربية والموقع، وسيتم استقبال طلبك فورًا.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/request"
                  className="bg-red-600 hover:bg-red-700 px-6 py-4 rounded-2xl text-lg font-bold text-center shadow-lg"
                >
                  اطلب مساعدة الآن
                </Link>

                <a
                  href="#services"
                  className="bg-gray-800 hover:bg-gray-700 px-6 py-4 rounded-2xl text-lg font-bold text-center border border-gray-700"
                >
                  شوف الخدمات
                </a>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-8">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-500">24/7</p>
                  <p className="text-sm text-gray-300 mt-1">جاهزين للطلبات</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-500">GPS</p>
                  <p className="text-sm text-gray-300 mt-1">تحديد موقع أو عنوان</p>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-500">Fast</p>
                  <p className="text-sm text-gray-300 mt-1">استقبال سريع للطلب</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-center text-red-400">
                ليه تختار RoadFix؟
              </h2>

              <div className="space-y-4">
                <div className="bg-black border border-gray-800 rounded-2xl p-4">
                  <h3 className="font-bold text-white mb-2">طلب سريع وسهل</h3>
                  <p className="text-gray-300 text-sm leading-7">
                    ابعت بياناتك ونوع العطل والموقع في أقل من دقيقة.
                  </p>
                </div>

                <div className="bg-black border border-gray-800 rounded-2xl p-4">
                  <h3 className="font-bold text-white mb-2">تحديد موقع مرن</h3>
                  <p className="text-gray-300 text-sm leading-7">
                    تقدر تستخدم GPS أو تكتب عنوانك يدويًا لو الموقع ما اشتغلش.
                  </p>
                </div>

                <div className="bg-black border border-gray-800 rounded-2xl p-4">
                  <h3 className="font-bold text-white mb-2">متابعة واضحة</h3>
                  <p className="text-gray-300 text-sm leading-7">
                    الطلب بيتسجل فورًا وبيظهر في الداشبورد لمتابعته والتحكم فيه.
                  </p>
                </div>

                <div className="bg-black border border-gray-800 rounded-2xl p-4">
                  <h3 className="font-bold text-white mb-2">خدمات متنوعة</h3>
                  <p className="text-gray-300 text-sm leading-7">
                    بطارية، كاوتش، بنزين، كهرباء، أو أي عطل مفاجئ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              الخدمات المتاحة
            </h2>
            <p className="text-gray-400 text-lg">
              اختار نوع العطل علشان تدخل مباشرة على صفحة الطلب
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {services.map((service) => (
              <Link
                key={service.name}
                href={`/request?service=${service.name}`}
                className="bg-gray-900 border border-gray-800 p-5 rounded-2xl text-center block hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <div className="text-4xl mb-3">{service.icon}</div>
                <p className="font-bold text-lg">{service.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="max-w-6xl mx-auto bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ازاي الخدمة شغالة؟
            </h2>
            <p className="text-gray-400 text-lg">
              3 خطوات بسيطة لطلب المساعدة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-black border border-gray-800 rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">1️⃣</div>
              <h3 className="font-bold text-xl mb-3">اختار الخدمة</h3>
              <p className="text-gray-300 leading-7">
                اختار نوع العطل المناسب من الصفحة الرئيسية.
              </p>
            </div>

            <div className="bg-black border border-gray-800 rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">2️⃣</div>
              <h3 className="font-bold text-xl mb-3">ابعت الطلب</h3>
              <p className="text-gray-300 leading-7">
                اكتب بياناتك، وصف العطل، بيانات العربية، والموقع.
              </p>
            </div>

            <div className="bg-black border border-gray-800 rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">3️⃣</div>
              <h3 className="font-bold text-xl mb-3">نستقبل طلبك</h3>
              <p className="text-gray-300 leading-7">
                الطلب يظهر في الداشبورد مباشرة لبدء المتابعة والتنفيذ.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-600 rounded-3xl p-8 md:p-10 text-center shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              محتاج مساعدة دلوقتي؟
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-6 leading-8">
              ابدأ الطلب الآن واكتب كل التفاصيل المطلوبة، وسجّل موقعك أو عنوانك
              بكل سهولة.
            </p>

            <Link
              href="/request"
              className="inline-block bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-2xl text-lg font-bold"
            >
              ابدأ الطلب الآن
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}