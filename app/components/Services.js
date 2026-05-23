import Link from "next/link";

const services = [
  { name: "بطارية", icon: "🔋", desc: "شحن أو استبدال فوري" },
  { name: "كاوتش", icon: "🛞", desc: "تغيير الإطار في مكانك" },
  { name: "بنزين", icon: "⛽", desc: "توصيل وقود لموقعك" },
  { name: "كهرباء", icon: "⚡", desc: "تشخيص وإصلاح كهربائي" },
  { name: "ميكانيكا", icon: "🔧", desc: "فني ميكانيكا متخصص" },
  { name: "صيانة دورية", icon: "🛠️", desc: "صيانة شاملة في مكانك" },
  { name: "عطل مفاجئ", icon: "🚨", desc: "تشخيص فوري لأي عطل" },
];

export default function Services() {
  return (
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
  );
}