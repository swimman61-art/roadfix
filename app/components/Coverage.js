const cities = [
  { city: "القاهرة — كل المناطق", status: "متاح الآن ✅", color: "bg-green-50 border-green-200 text-green-700" },
  { city: "الجيزة", status: "قريباً 🔜", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { city: "الإسكندرية", status: "قريباً 🔜", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { city: "باقي المحافظات", status: "في الخطة 📋", color: "bg-gray-100 border-gray-200 text-gray-500" },
];

const stats = [
  { num: "+500", lbl: "طلب مكتمل", icon: "✅" },
  { num: "15 دقيقة", lbl: "متوسط الوصول", icon: "⚡" },
  { num: "98%", lbl: "رضا العملاء", icon: "⭐" },
  { num: "24/7", lbl: "خدمة مستمرة", icon: "🕐" },
];

export default function Coverage() {
  return (
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
              {cities.map((c) => (
                <div key={c.city} className={`flex items-center justify-between border rounded-2xl px-5 py-3 ${c.color}`}>
                  <span className="font-bold">{c.city}</span>
                  <span className="text-sm font-bold">{c.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
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
  );
}