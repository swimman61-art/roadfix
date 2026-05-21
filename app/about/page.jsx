import Link from "next/link";

export const metadata = {
  title: "من نحن — RoadFix",
  description:
    "RoadFix أول خدمة إصلاح سيارات متنقلة في القاهرة. فنيين متخصصين بييجوا لموقعك في 15 دقيقة. تعرف أكتر علينا.",
};

export default function AboutPage() {
  const values = [
    { icon: "⚡", title: "السرعة", desc: "بنعرف إن وقتك غالي. متوسط وصول الفني 15 دقيقة بس." },
    { icon: "🔒", title: "الأمانة", desc: "بنحدد السعر قبل ما نبدأ. مفيش مفاجآت أو زيادات." },
    { icon: "🎯", title: "الاحترافية", desc: "فنيين متخصصين بخبرة عالية في كل أنواع السيارات." },
    { icon: "❤️", title: "خدمة العميل", desc: "مش بنخلص من الطلب بس — بنتأكد إن العميل راضي 100%." },
  ];

  const stats = [
    { num: "+500", lbl: "طلب مكتمل" },
    { num: "15 د", lbl: "متوسط الوصول" },
    { num: "98%", lbl: "رضا العملاء" },
    { num: "24/7", lbl: "متاحون دايمًا" },
  ];

  const services = [
    "بطارية", "كاوتش", "بنزين", "كهرباء", "ميكانيكا", "صيانة دورية", "عطل مفاجئ"
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-white text-gray-900">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px'}} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white/70 mb-6">
            من نحن
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            إحنا مش بس خدمة
            <span className="block text-transparent bg-clip-text bg-gradient-to-l from-orange-400 to-red-400 mt-2">
              إحنا جايين ليك
            </span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            RoadFix بدأت من فكرة بسيطة — إن العميل مش المفروض يتعب وهو عايز يصلح عربيته.
            إحنا جبنا الورشة لحد عندك.
          </p>
        </div>
      </section>

      {/* Stats */}
      <div className="bg-red-500 text-white py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.lbl}>
              <p className="text-3xl md:text-4xl font-black">{s.num}</p>
              <p className="text-white/80 text-sm mt-1">{s.lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* القصة */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">قصتنا</span>
              <h2 className="text-3xl md:text-4xl font-black mt-4 mb-6">
                ليه بدأنا RoadFix؟
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  كتير مننا عاش موقف إن عربيته وقفت في نص الطريق — وبعدين بدأت الرحلة الصعبة:
                  دور على ورشة، استنى سطحة، اتأخر في شغله.
                </p>
                <p>
                  RoadFix اتأسست عشان تحل المشكلة دي بشكل مختلف خالص.
                  بدل ما إنت تيجي لينا — إحنا اللي بنيجي ليك.
                  فني متخصص بيوصل لموقعك في 15 دقيقة ويصلح المشكلة في مكانها.
                </p>
                <p>
                  دلوقتي بنغطي القاهرة كلها — وهدفنا إننا نوصل لكل محافظات مصر قريباً.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {[
                { step: "01", title: "الفكرة", desc: "بدأنا بفكرة بسيطة — نجيب الفني للعميل مش العكس" },
                { step: "02", title: "الانطلاق", desc: "بدأنا في القاهرة بفريق صغير من الفنيين المتخصصين" },
                { step: "03", title: "النمو", desc: "+500 طلب مكتمل ورضا عملاء 98%" },
                { step: "04", title: "المستقبل", desc: "التوسع لكل محافظات مصر وإطلاق التطبيق" },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex-1">
                    <p className="font-black text-gray-900 mb-1">{item.title}</p>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* القيم */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">قيمنا</span>
            <h2 className="text-3xl md:text-4xl font-black mt-4 mb-4">إيه اللي بيميزنا؟</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mb-4">
                  {v.icon}
                </div>
                <h3 className="text-xl font-black mb-2">{v.title}</h3>
                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* الخدمات */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">خدماتنا</span>
          <h2 className="text-3xl md:text-4xl font-black mt-4 mb-4">بنصلح إيه؟</h2>
          <p className="text-gray-500 mb-10">كل أنواع الأعطال في مكانك</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {services.map((s) => (
              <Link key={s} href={`/request?service=${s}`}
                className="bg-gray-50 hover:bg-red-500 hover:text-white border-2 border-gray-100 hover:border-red-500 rounded-2xl px-6 py-3 font-bold transition-all hover:-translate-y-1">
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-slate-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black mb-6">جاهز تجرب RoadFix؟</h2>
          <p className="text-white/60 text-lg mb-10">
            اطلب فني دلوقتي واحس بالفرق بنفسك
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/request"
              className="bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105">
              🔧 اطلب فني دلوقتي
            </Link>
            <a href="https://wa.me/201011174777?text=مرحبا، عندي سؤال عن RoadFix"
              target="_blank" rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105">
              💬 تواصل معنا
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}