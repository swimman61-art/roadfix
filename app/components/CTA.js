import Link from "next/link";

const WHATSAPP_NUMBER = "201011174777";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=مرحبا، عندي عطل في سيارتي وعايز مساعدة`;

export default function CTA() {
  return (
    <>
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
                <div><Link href="/track" className="hover:text-white transition-colors">طلباتي</Link></div>
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
    </>
  );
}