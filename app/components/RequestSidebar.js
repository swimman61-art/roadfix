"use client";

import { useLanguage } from "./LanguageProvider";

export default function RequestSidebar() {
  const { t, lang } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-4">
          {lang === "ar" ? "ملاحظات مهمة" : "Important Notes"}
        </h3>
        <div className="space-y-3 text-gray-600 leading-7 text-sm">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            {lang === "ar"
              ? "تأكد من كتابة رقم موبايل صحيح علشان نقدر نتواصل معاك بسرعة."
              : "Make sure to enter a correct mobile number so we can contact you quickly."}
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            {lang === "ar"
              ? "لو تحديد الموقع ما اشتغلش، اكتب عنوان واضح بالتفصيل والطلب هيتسجل عادي."
              : "If location detection doesn't work, write a clear detailed address and the order will be registered normally."}
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            {lang === "ar"
              ? "رفع الصورة متوقف مؤقتًا، لكن الطلب بيتبعت بشكل طبيعي."
              : "Photo upload is temporarily disabled, but orders are submitted normally."}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-3xl p-5 shadow-lg text-white">
        <h3 className="text-xl font-black mb-3">RoadFix</h3>
        <p className="text-white/90 leading-8 text-sm">
          {lang === "ar"
            ? "حتى لو تحديد الموقع التلقائي لم يعمل، يمكنك كتابة العنوان يدويًا أو فتح Google Maps، وسيتم استقبال الطلب بشكل طبيعي."
            : "Even if automatic location detection doesn't work, you can write the address manually or open Google Maps, and your order will be received normally."}
        </p>
      </div>
    </div>
  );
}