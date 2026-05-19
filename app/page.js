import Link from "next/link";

export const metadata = {
  title: "RoadFix — فني السيارات جاي ليك",
  description: "مساعدة سيارتك في مكانك. بطارية، كاوتش، بنزين، ميكانيكا — فني متخصص يوصلك في أسرع وقت في القاهرة.",
};

const WHATSAPP_NUMBER = "201011174777";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=مرحبا، عندي عطل في سيارتي وعايز مساعدة`;

export default function HomePage() {
  const services = [
    { name: "بطارية", icon: "🔋", desc: "شحن أو استبدال فوري" },
    { name: "كاوتش", icon: "🛞", desc: "تغيير الإطار في مكانك" },
    { name: "بنزين", icon: "⛽", desc: "توصيل وقود لموقعك" },
    { name: "كهرباء", icon: "⚡", desc: "تشخيص وإصلاح كهربائي" },
    { name: "ميكانيكا", icon: "🔧", desc: "فني ميكانيكا متخصص" },
    { name: "صيانة دورية", icon: "🛠️", desc: "صيانة شاملة في مكانك" },
    { name: "عطل مفاجئ", icon: "🚨", desc: "تشخيص فوري لأي عطل" },
  ];

  const features = [
    { icon: "📍", title: "جايين ليك", desc: "مش محتاج تتحرك. الفني بييجي لموقعك في الشارع أو البيت أو الشغل." },
    { icon: "⚡", title: "سريع جداً", desc: "متوسط وصول الفني 15 دقيقة. بنعرف إن وقتك غالي." },
    { icon: "🔒", title: "موثوق 100%", desc: "فنيين متخصصين بخبرة عالية وضمان على كل خدمة." },
    { icon: "💰", title: "أسعار واضحة", desc: "بنحدد السعر قبل ما نبدأ. مفيش مفاجآت." },
  ];

  const steps = [
    { num: "01", title: "اختار خدمتك", desc: "حدد المشكلة وأدخل بياناتك وموقعك في أقل من دقيقة" },
    { num: "02", title: "بنستلم فوراً", desc: "الطلب بيوصلنا في الحال وبنبعته لأقرب فني متاح" },
    { num: "03", title: "الفني في طريقه", desc: "الفني بييجيلك في مكانك وبتقدر تتابع حالة الطلب" },
  ];

  const reviews = [
    { name: "أحمد محمد", area: "مدينة نصر", rating: 5, text: "بطاريتي وقفت في نص الطريق الساعة 10 بالليل. اتصلت بـ RoadFix والفني وصل في 12 دقيقة بالظبط. خدمة ممتازة جداً!", service: "بطارية" },
    { name: "سارة علي", area: "المعادي", rating: 5, text: "كاوتش وقف وأنا رايحة الشغل. الفني جه بسرعة وغيره وأنا في عربيتي. محتاجتش أتعبت خالص. شكراً RoadFix!", service: "كاوتش" },
    { name: "محمود حسن", area: "الزمالك", rating: 5, text: "خدمة احترافية جداً. الفني كان محترم ومتخصص وشرح لي المشكلة بالتفصيل. السعر كان معقول ومحددوهولي قبل ما يبدأ.", service: "ميكانيكا" },
    { name: "نورا سامي", area: "مصر الجديدة", rating: 5, text: "أخيرًا خدمة بتيجي ليك! خلصت من زحمة الورش. الفني وصل بسرعة والسيارة اتصلحت في مكانها. هنصح بيهم لكل حد.", service: "كهرباء" },
  ];

  const comparison = [
    { feature: "بيجي لموقعك", roadfix: true, garage: false },
    { feature: "متاح 24/7", roadfix: true, garage: false },
    { feature: "وقت الانتظار", roadfix: "15 دقيقة", garage: "ساعات" },
    { feature: "سعر محدد مسبقاً", roadfix: true, garage: false },
    { feature: "تتبع الطلب", roadfix: true, garage: false },
    { feature: "مفيش زحمة ورش", roadfix: true, garage: false },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* ===== زرار واتساب ثابت ===== */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full shadow-2xl shadow-green-500/40 transition-all hover:scale-105 font-bold text-sm"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        تواصل معنا
      </a>

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white min-h-screen flex items-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-red-500 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-orange-500 blur-[100px] translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="absolute inset-0 opacity-5"
          style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px'}} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 text-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-300 font-bold">متاح دلوقتي في القاهرة</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-6 tracking-tight">
                عطلت؟
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-orange-400 to-red-400">
                  إحنا جايين
                </span>
                <br />
                <span className="text-3xl md:text-4xl font-bold text-white/70">ليك في مكانك</span>
              </h1>

              <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-lg">
                مش محتاج تتحرك أو تدور على ورشة. فني متخصص بييجي لموقعك سواء في الشارع أو البيت أو الشغل.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link href="/request"
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-lg shadow-red-500/30">
                  🔧 اطلب فني دلوقتي
                </Link>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-lg shadow-green-500/30">
                  💬 واتساب مباشر
                </a>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-white/50">
                <span>⭐ تقييم 4.9/5</span>
                <span>✅ +500 طلب مكتمل</span>
                <span>⚡ 15 دقيقة متوسط وصول</span>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-lg">طلبات الآن 🔴</h3>
                  <span className="flex items-center gap-2 text-xs text-green-300 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Live
                  </span>
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    { icon: "🔋", area: "مدينة نصر", service: "بطارية فارغة", status: "الفني في الطريق", statusColor: "text-blue-300", bg: "bg-blue-500/10" },
                    { icon: "🛞", area: "المعادي", service: "كاوتش واقف", status: "✓ تم بنجاح", statusColor: "text-green-300", bg: "bg-green-500/10" },
                    { icon: "⚡", area: "الزمالك", service: "عطل كهربائي", status: "جديد 🔔", statusColor: "text-yellow-300", bg: "bg-yellow-500/10" },
                  ].map((r) => (
                    <div key={r.area} className="flex items-center gap-3 bg-white/5 rounded-2xl p-3">
                      <div className={`w-10 h-10 rounded-xl ${r.bg} flex items-center justify-center text-xl flex-shrink-0`}>{r.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{r.service} — {r.area}</p>
                        <p className={`text-xs mt-0.5 ${r.statusColor}`}>{r.status}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[{ num: "+500", lbl: "طلب" }, { num: "15د", lbl: "وصول" }, { num: "24/7", lbl: "متاح" }].map((s) => (
                    <div key={s.lbl} className="bg-white/5 rounded-xl p-3 text-center">
                      <p className="text-xl font-black text-red-400">{s.num}</p>
                      <p className="text-xs text-white/50 mt-0.5">{s.lbl}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-green-500 text-white rounded-2xl px-4 py-3 shadow-xl text-sm font-bold">
                🚗 فني وصل المعادي ✓
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TAGLINE STRIP ===== */}
      <div className="bg-red-500 text-white py-5 px-4 text-center">
        <p className="text-xl md:text-2xl font-black">
          🚀 أول خدمة إصلاح سيارات في مكانك في القاهرة
        </p>
      </div>

      {/* ===== FEATURES ===== */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">ليه RoadFix؟</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4">إحنا مختلفين</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">مش بنقولك "جيب السيارة" — إحنا اللي بنيجي ليك</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-black mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPARISON ===== */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">المقارنة</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4">RoadFix vs الورشة العادية</h2>
            <p className="text-gray-500 text-lg">شوف الفرق بنفسك</p>
          </div>

          <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            {/* Header */}
            <div className="grid grid-cols-3 bg-slate-900 text-white">
              <div className="p-4 font-bold text-gray-400 text-sm">المميزة</div>
              <div className="p-4 text-center font-black text-red-400 border-x border-white/10">
                Road<span className="text-white">Fix</span>
              </div>
              <div className="p-4 text-center font-bold text-gray-400 text-sm">ورشة عادية</div>
            </div>

            {/* Rows */}
            {comparison.map((row, i) => (
              <div key={row.feature}
                className={`grid grid-cols-3 border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="p-4 font-bold text-gray-700 text-sm flex items-center">{row.feature}</div>
                <div className="p-4 text-center border-x border-gray-100 flex items-center justify-center">
                  {row.roadfix === true
                    ? <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-black text-lg">✓</span>
                    : <span className="font-black text-red-500">{row.roadfix}</span>}
                </div>
                <div className="p-4 text-center flex items-center justify-center">
                  {row.garage === false
                    ? <span className="w-8 h-8 rounded-full bg-red-100 text-red-400 flex items-center justify-center font-black text-lg">✗</span>
                    : <span className="font-bold text-gray-500 text-sm">{row.garage}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/request"
              className="bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-lg shadow-red-500/20 inline-block">
              جرب RoadFix دلوقتي 🚀
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">خدماتنا</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4">إيه اللي محتاجه؟</h2>
            <p className="text-gray-500 text-lg">اختار الخدمة وهيجيلك فني في مكانك</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((svc) => (
              <Link key={svc.name} href={`/request?service=${svc.name}`}
                className="group bg-white hover:bg-red-500 border-2 border-gray-100 hover:border-red-500 rounded-3xl p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/20">
                <span className="text-4xl mb-3 block">{svc.icon}</span>
                <p className="font-black text-gray-900 group-hover:text-white transition-colors">{svc.name}</p>
                <p className="text-xs text-gray-400 group-hover:text-red-100 mt-1 leading-relaxed transition-colors">{svc.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-white/10 text-white/70 font-bold text-sm px-4 py-2 rounded-full border border-white/10">إزاي بيشتغل؟</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4">3 خطوات بس</h2>
            <p className="text-white/50 text-lg">من أول ما تطلب لحد ما الفني يوصلك</p>
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

      {/* ===== REVIEWS ===== */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">آراء العملاء</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4">بيقولوا إيه عننا؟</h2>
            <p className="text-gray-500 text-lg">عملاء حقيقيين، تجارب حقيقية</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((r) => (
              <div key={r.name} className="bg-gray-50 border border-gray-100 rounded-3xl p-6 hover:shadow-md hover:-translate-y-1 transition-all">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(r.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">"{r.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center font-black text-red-500">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.area} · {r.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COVERAGE ===== */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">التغطية</span>
              <h2 className="text-4xl md:text-5xl font-black mt-4 mb-6">
                دلوقتي في القاهرة
                <span className="block text-red-500">وبنكبر معاك</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                بدأنا بالقاهرة وبنغطي كل مناطقها. وعيننا على المستقبل — هنوصل لكل مصر قريباً.
              </p>
              <div className="space-y-3">
                {[
                  { city: "القاهرة — كل المناطق", status: "متاح الآن ✅", color: "bg-green-50 border-green-200 text-green-700" },
                  { city: "الجيزة", status: "قريباً 🔜", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
                  { city: "الإسكندرية", status: "قريباً 🔜", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
                  { city: "باقي المحافظات", status: "في الخطة 📋", color: "bg-gray-100 border-gray-200 text-gray-500" },
                ].map((c) => (
                  <div key={c.city} className={`flex items-center justify-between border rounded-2xl px-5 py-3 ${c.color}`}>
                    <span className="font-bold">{c.city}</span>
                    <span className="text-sm font-bold">{c.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "+500", lbl: "طلب مكتمل", icon: "✅" },
                { num: "15 دقيقة", lbl: "متوسط الوصول", icon: "⚡" },
                { num: "98%", lbl: "رضا العملاء", icon: "⭐" },
                { num: "24/7", lbl: "خدمة مستمرة", icon: "🕐" },
              ].map((s) => (
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

      {/* ===== CTA ===== */}
      <section className="py-24 px-4 bg-gradient-to-br from-red-500 to-red-700 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px'}} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black mb-6">عطلت دلوقتي؟</h2>
          <p className="text-white/80 text-lg leading-relaxed mb-10">
            متقلقش. الفني بييجي ليك في مكانك في أسرع وقت. القاهرة كلها في متناول إيدنا.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/request"
              className="bg-white text-red-600 px-10 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 shadow-xl">
              🔧 اطلب فني دلوقتي
            </Link>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-xl transition-all hover:scale-105 shadow-xl">
              💬 واتساب مباشر
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
                أول خدمة إصلاح سيارات في مكانك في القاهرة. بنيجي ليك سواء في الشارع أو البيت أو الشغل.
              </p>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
                💬 واتساب
              </a>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-gray-300">روابط سريعة</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div><Link href="/" className="hover:text-white transition-colors">الرئيسية</Link></div>
                <div><Link href="/request" className="hover:text-white transition-colors">اطلب خدمة</Link></div>
                <div><Link href="/track" className="hover:text-white transition-colors">تتبع الطلب</Link></div>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-3 text-gray-300">الخدمات</h4>
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
            <p>جميع الحقوق محفوظة © 2025 RoadFix — القاهرة، مصر</p>
          </div>
        </div>
      </footer>

    </main>
  );
}