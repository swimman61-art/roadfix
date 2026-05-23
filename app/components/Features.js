const features = [
  { icon: "📍", title: "جايين ليك", desc: "مش محتاج تتحرك. الفني بييجي لموقعك في الشارع أو البيت أو الشغل." },
  { icon: "⚡", title: "سريع جداً", desc: "بنوصلك في أسرع وقت ممكن. بنعرف إن وقتك غالي." },
  { icon: "🔒", title: "موثوق 100%", desc: "فنيين متخصصين بخبرة عالية وضمان على كل خدمة." },
  { icon: "💰", title: "أسعار واضحة", desc: "بنحدد السعر قبل ما نبدأ. مفيش مفاجآت." },
];

export default function Features() {
  return (
    <>
      {/* شريط أحمر */}
      <div className="bg-red-500 text-white py-5 px-4 text-center">
        <p className="text-xl md:text-2xl font-black">
          🚀 أول خدمة إصلاح سيارات في مكانك في القاهرة والجيزة
        </p>
      </div>

      {/* المميزات */}
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
    </>
  );
}