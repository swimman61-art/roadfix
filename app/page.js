import Link from "next/link";

export const metadata = {
  title: "RoadFix — مساعدة السيارات على الطريق",
  description: "اطلب مساعدة لسيارتك في أي مكان. بطارية، كاوتش، بنزين، ميكانيكا.",
};

export default function HomePage() {
  const services = [
    { name: "بطارية", icon: "🔋", desc: "شحن أو استبدال البطارية فورًا" },
    { name: "كاوتش", icon: "🛞", desc: "تغيير الإطار في الحال" },
    { name: "بنزين", icon: "⛽", desc: "توصيل وقود لموقعك" },
    { name: "كهرباء", icon: "⚡", desc: "تشخيص وإصلاح الكهرباء" },
    { name: "ميكانيكا", icon: "🔧", desc: "فني ميكانيكا متخصص" },
    { name: "صيانة دورية", icon: "🛠️", desc: "تشييك وصيانة شاملة" },
    { name: "عطل", icon: "🚨", desc: "تشخيص فوري لأي عطل" },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center px-4 py-24">

        {/* خلفية */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(226,75,74,0.1),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10 max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

          {/* النص */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-gray-400 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              متاح على مدار الساعة
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
              عطلت في الطريق؟
              <span className="block text-red-500 mt-2">إحنا جايين ليك</span>
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
              مساعدة سريعة لسيارتك في أي مكان. بطارية، كاوتش، بنزين، ميكانيكا —
              اطلب الخدمة دلوقتي وهيجيلك فني متخصص.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/request"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:-translate-y-0.5"
              >
                🔧 اطلب خدمة دلوقتي
              </Link>
              <Link
                href="/track"
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all"
              >
                تتبع طلبك
              </Link>
            </div>
          </div>

          {/* كارد الإحصائيات */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />

            {/* Live indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400" />
              </span>
              <span className="text-xs text-gray-400">Live</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4 mt-4">
              {[
                { num: "+500", lbl: "طلب تم تنفيذه" },
                { num: "15 د", lbl: "متوسط الاستجابة" },
                { num: "24/7", lbl: "متاحون دايمًا" },
                { num: "98%", lbl: "رضا العملاء" },
              ].map((s) => (
                <div key={s.lbl} className="bg-black/40 border border-white/5 rounded-2xl p-4">
                  <p className="text-2xl font-black text-red-500">{s.num}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.lbl}</p>
                </div>
              ))}
            </div>

            {/* طلبات حية */}
            {[
              { icon: "🔋", name: "بطارية فارغة — مدينة نصر", status: "جاري التنفيذ", color: "text-blue-400" },
              { icon: "🛞", name: "كاوتش واقف — المعادي", status: "✓ تم بنجاح", color: "text-green-400" },
              { icon: "⚡", name: "عطل كهربائي — الزمالك", status: "طلب جديد 🔔", color: "text-yellow-400" },
            ].map((r) => (
              <div key={r.name} className="bg-black/40 border border-white/5 rounded-2xl p-3 flex items-center gap-3 mb-2">
                <span className="text-2xl">{r.icon}</span>
                <div>
                  <p className="text-sm font-bold text-white">{r.name}</p>
                  <p className={`text-xs mt-0.5 ${r.color}`}>{r.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <div className="border-y border-white/5 bg-white/[0.02] py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { num: "+500", lbl: "طلب مكتمل" },
            { num: "15 دقيقة", lbl: "متوسط الوصول" },
            { num: "7 خدمات", lbl: "تغطي كل العطلات" },
            { num: "24/7", lbl: "دعم مستمر" },
          ].map((t) => (
            <div key={t.lbl}>
              <p className="text-3xl font-black text-red-500">{t.num}</p>
              <p className="text-gray-400 text-sm mt-1">{t.lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== SERVICES ===== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-500 font-bold text-sm tracking-widest mb-3">خدماتنا</p>
          <h2 className="text-4xl font-black mb-3">إيه اللي تحتاجه؟</h2>
          <p className="text-gray-400 mb-12">اختار الخدمة اللي محتاجها وهنوصلك فني متخصص في أسرع وقت</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((svc) => (
              <Link
                key={svc.name}
                href={`/request?service=${svc.name}`}
                className="bg-white/5 hover:bg-red-950/30 border border-white/10 hover:border-red-500/50 rounded-2xl p-5 transition-all hover:-translate-y-1 group"
              >
                <span className="text-3xl mb-3 block">{svc.icon}</span>
                <p className="font-bold text-white group-hover:text-red-400 transition-colors">{svc.name}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{svc.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-500 font-bold text-sm tracking-widest mb-3">الطريقة</p>
          <h2 className="text-4xl font-black mb-3">3 خطوات بس</h2>
          <p className="text-gray-400 mb-16">العملية بسيطة وسريعة من أول ما تطلب لحد ما الفني يوصلك</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "1", title: "اختار خدمتك", desc: "حدد نوع المشكلة وأدخل بياناتك وموقعك في ثوانٍ" },
              { num: "2", title: "استقبال الطلب", desc: "بنستلم طلبك فورًا ونبعتله لأقرب فني متاح" },
              { num: "3", title: "الفني في طريقه", desc: "تقدر تتبع حالة طلبك برقم الطلب في أي وقت" },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-14 h-14 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 text-2xl font-black mx-auto mb-5">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(226,75,74,0.1),transparent)]" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4">عطلت؟ متقلقش 🚗</h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              فريقنا جاهز على مدار الساعة. اطلب خدمتك دلوقتي واستنى الفني يوصلك في أسرع وقت.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/request"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:-translate-y-0.5"
              >
                اطلب خدمة دلوقتي
              </Link>
              <Link
                href="/track"
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all"
              >
                تتبع طلب موجود
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 py-8 px-4 text-center text-gray-500 text-sm">
        <p className="mb-2">
          <span className="text-white font-bold">Road</span>
          <span className="text-red-500 font-bold">Fix</span>
          {" "}— نظام مساعدة السيارات على الطريق
        </p>
        <p>جميع الحقوق محفوظة © 2025</p>
      </footer>

    </main>
  );
}