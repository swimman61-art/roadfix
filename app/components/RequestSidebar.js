export default function RequestSidebar() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
        <h3 className="text-lg font-black text-gray-900 mb-4">ملاحظات مهمة</h3>
        <div className="space-y-3 text-gray-600 leading-7 text-sm">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            تأكد من كتابة رقم موبايل صحيح علشان نقدر نتواصل معاك بسرعة.
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            لو تحديد الموقع ما اشتغلش، اكتب عنوان واضح بالتفصيل والطلب هيتسجل عادي.
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
            رفع الصورة متوقف مؤقتًا، لكن الطلب بيتبعت بشكل طبيعي.
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-3xl p-5 shadow-lg text-white">
        <h3 className="text-xl font-black mb-3">RoadFix</h3>
        <p className="text-white/90 leading-8 text-sm">
          حتى لو تحديد الموقع التلقائي لم يعمل، يمكنك كتابة العنوان يدويًا أو فتح Google Maps، وسيتم استقبال الطلب بشكل طبيعي.
        </p>
      </div>
    </div>
  );
}