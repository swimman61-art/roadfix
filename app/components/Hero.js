import Link from "next/link";

const WHATSAPP_NUMBER = "201011174777";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=مرحبا، عندي عطل في سيارتي وعايز مساعدة`;

export default function Hero() {
  return (
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
              <span className="text-green-300 font-bold">متاح دلوقتي في القاهرة والجيزة</span>
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
              <span>⚡ بنوصلك في أسرع وقت ممكن</span>
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
                {[{ num: "+500", lbl: "طلب" }, { num: "أسرع", lbl: "وصول" }, { num: "24/7", lbl: "متاح" }].map((s) => (
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
  );
}