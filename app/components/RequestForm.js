"use client";

import { useRequestForm, SERVICE_OPTIONS } from "./useRequestForm";
import RequestSidebar from "./RequestSidebar";

export default function RequestForm() {
  const {
    service, setService,
    location,
    loadingLocation,
    selectedImage,
    manualAddress, setManualAddress,
    submitting,
    locationMessage,
    formMessage,
    successRequestNumber,
    imagePreview,
    getLocation,
    handleImageChange,
    handleSubmit,
    messageBoxClass,
    currentCustomer,
    name, setName,
    phone, setPhone,
  } = useRequestForm();

  const inputClass =
    "w-full p-3 rounded-xl bg-gray-50 border border-slate-400 text-gray-900 outline-none focus:border-red-500 focus:bg-white transition placeholder:text-gray-400";

  const copyRequestNumber = async () => {
    try {
      await navigator.clipboard.writeText(successRequestNumber);
      alert("تم نسخ رقم الطلب ✅");
    } catch {
      alert("تعذر النسخ، احفظ الرقم يدوياً");
    }
  };

  // 🆕 لو الطلب اتبعت بنجاح، نوري شاشة التأكيد بس
  if (successRequestNumber) {
    return (
      <main className="min-h-screen bg-white text-gray-900 px-4 py-12 md:px-6 flex items-center justify-center" dir="rtl">
        <div className="max-w-2xl w-full">

          {/* ===== شاشة تأكيد الطلب ===== */}
          <div className="bg-white border-2 border-green-300 rounded-3xl p-8 md:p-10 shadow-xl text-center">

            {/* علامة النجاح */}
            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-14 h-14 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-green-700 mb-3">
              تم استلام طلبك ✅
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-8 mb-8">
              الفني هيتواصل معاك في أسرع وقت ممكن.
              <br />
              {currentCustomer ? "تقدر تتابع حالة الطلب من صفحة طلباتي." : "احفظ رقم الطلب علشان تتابع حالته."}
            </p>

            {/* تنبيه للزائر */}
            {!currentCustomer && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-5 mb-6 text-right">
                <p className="text-yellow-900 font-black text-base mb-2 flex items-center gap-2">
                  ⚠️ مهم جداً — احفظ رقم الطلب
                </p>
                <p className="text-yellow-800 text-sm leading-7">
                  صوّر الشاشة أو انسخ الرقم.
                  <br />
                  <span className="font-bold">أو اعمل حساب دلوقتي عشان طلباتك تتحفظ تلقائياً.</span>
                </p>
              </div>
            )}

            {/* رقم الطلب */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-6">
              <p className="text-sm text-gray-500 mb-2 font-bold">رقم الطلب</p>
              <p className="text-3xl md:text-4xl font-black text-gray-900 tracking-wider mb-4 break-all">
                {successRequestNumber}
              </p>
              <button
                onClick={copyRequestNumber}
                className="bg-gray-900 hover:bg-gray-800 text-white text-sm px-5 py-2.5 rounded-xl font-bold transition">
                📋 نسخ الرقم
              </button>
            </div>

            {/* الأزرار */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`/my-orders?ref=${successRequestNumber}`}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-2xl font-black transition shadow-lg shadow-green-500/20">
                🔍 تتبع الطلب
              </a>

              {!currentCustomer && (
                <a href="/signup"
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-black transition shadow-lg shadow-red-500/20">
                  اعمل حساب احفظ طلباتك ←
                </a>
              )}

              <a href="/"
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-4 rounded-2xl font-bold transition">
                الرئيسية
              </a>
            </div>

            {/* رابط طلب جديد */}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 text-gray-500 hover:text-gray-700 text-sm font-bold underline transition">
              عاوز تعمل طلب جديد؟
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ===== الشاشة الأصلية (الفورم) =====
  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 py-12 md:px-6" dir="rtl">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">RoadFix</span>
          <h1 className="text-3xl md:text-5xl font-black mt-4 mb-4">طلب خدمة السيارة</h1>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-8">
            املى البيانات المطلوبة بشكل واضح، وحدد موقعك أو اكتب عنوانك يدويًا، وسيتم تسجيل الطلب فورًا.
          </p>
        </div>

        {/* رسالة الخطأ بس (مفيش رسالة نجاح هنا) */}
        {formMessage.text && formMessage.type === "error" && (
          <div className={messageBoxClass}>
            <p className="font-bold">{formMessage.text}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 items-start">

          {/* الفورم */}
          <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-5 md:p-8 shadow-sm">
            <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-black">بيانات الطلب</h2>
                <p className="text-gray-500 mt-2">املى البيانات الأساسية والعنوان وطريقة الدفع</p>
              </div>

              {currentCustomer && (
                <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
                  <p className="text-sm text-green-700 mb-1 font-bold">أهلاً بيك تاني 👋</p>
                  <p className="text-base text-green-800 leading-8">
                    ملأنالك بياناتك تلقائياً عشان نوفّر وقتك. عبّى باقي تفاصيل العطل وابعت الطلب.
                  </p>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4">
                <p className="text-sm text-yellow-700 mb-1 font-bold">معلومة مهمة</p>
                <p className="text-base font-bold text-yellow-800 leading-8">
                  يتم تحديد تكلفة المعاينة والخدمة حسب موقع العميل وطبيعة الحالة.
                </p>
              </div>
            </div>

            {service && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-red-600 font-bold text-lg">نوع الخدمة المختار: {service}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <h3 className="text-lg font-black text-gray-900 mb-4">نوع الخدمة</h3>
                <select value={service} onChange={(e) => setService(e.target.value)} className={inputClass}>
                  <option value="">اختر نوع الخدمة</option>
                  {SERVICE_OPTIONS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <h3 className="text-lg font-black text-gray-900 mb-4">بيانات العميل</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm text-gray-600 font-bold">
                      الاسم
                      {currentCustomer && <span className="text-green-600 text-xs mr-2">✓ من حسابك</span>}
                    </label>
                    <input
                      name="name"
                      placeholder="اكتب اسمك"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm text-gray-600 font-bold">
                      الموبايل
                      {currentCustomer && <span className="text-green-600 text-xs mr-2">✓ من حسابك</span>}
                    </label>
                    <input
                      name="phone"
                      inputMode="numeric"
                      placeholder="مثال: 01012345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block mb-2 text-sm text-gray-600 font-bold">وصف العطل</label>
                  <textarea name="description" placeholder="اكتب وصف بسيط للعطل" className={`${inputClass} h-28`} />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <h3 className="text-lg font-black text-gray-900 mb-4">بيانات العربية</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input name="carBrand" placeholder="نوع العربية (BMW - VW...)" className={inputClass} />
                  <input name="carModel" placeholder="الموديل (Passat - Golf...)" className={inputClass} />
                  <input name="carYear" inputMode="numeric" placeholder="سنة الصنع" className={inputClass} />
                  <input name="plateNumber" placeholder="رقم اللوحة (اختياري)" className={inputClass} />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h3 className="text-lg font-black text-gray-900">الموقع</h3>
                  <span className="text-xs text-gray-400">GPS أو عنوان يدوي</span>
                </div>

                <button type="button" onClick={getLocation} disabled={loadingLocation}
                  className="w-full bg-slate-900 hover:bg-slate-800 p-3 rounded-xl font-bold text-white transition disabled:opacity-60">
                  {loadingLocation ? "جارٍ تحديد الموقع..." : "تحديد موقعي 📍"}
                </button>

                {location && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm space-y-1">
                    <p className="font-bold">تم تحديد الموقع ✅</p>
                    <p>Lat: {location.lat} | Lng: {location.lng}</p>
                  </div>
                )}

                {locationMessage && !location && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
                    <p className="text-yellow-700 font-bold mb-2">تعذر تحديد الموقع تلقائيًا</p>
                    <p className="text-sm text-yellow-800 leading-7">{locationMessage}</p>
                  </div>
                )}

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="text-blue-700 font-bold mb-2">بديل سريع لو GPS لم يعمل</p>
                  <p className="text-sm text-blue-800 leading-7 mb-4">
                    يمكنك فتح خرائط Google، معرفة موقعك أو أقرب عنوان، ثم كتابة العنوان يدويًا في الخانة بالأسفل.
                  </p>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition">
                    فتح Google Maps
                  </a>
                </div>

                <div className="mt-4 bg-white border border-dashed border-gray-300 rounded-2xl p-4">
                  <label className="block text-sm text-gray-700 mb-2 font-bold">اكتب عنوانك يدويًا</label>
                  <p className="text-xs text-gray-400 mb-3 leading-6">
                    اكتب المنطقة والشارع وأقرب علامة مميزة، مثال: مدينة نصر - عباس العقاد - أمام ماكدونالدز
                  </p>
                  <textarea value={manualAddress} onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="مثال: مدينة نصر - شارع عباس العقاد - أمام..."
                    className={`${inputClass} h-28`} />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <h3 className="text-lg font-black text-gray-900 mb-4">صورة العطل</h3>
                <input type="file" accept="image/*" onChange={handleImageChange}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-50 file:text-red-600 file:font-bold" />
                {selectedImage && <p className="text-green-600 text-sm mt-3">تم اختيار الصورة: {selectedImage.name}</p>}
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} alt="معاينة الصورة" className="w-full max-h-72 object-cover rounded-2xl border border-gray-200" />
                  </div>
                )}
                <p className="text-yellow-600 text-sm mt-3 leading-7">
                  سيتم حفظ اسم الصورة فقط مؤقتًا لحد ما نفعّل رفع الصور بالكامل.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <h3 className="text-lg font-black text-gray-900 mb-4">طريقة الدفع</h3>
                <select name="paymentMethod" className={inputClass} defaultValue="كاش">
                  <option value="كاش">كاش</option>
                  <option value="تحويل">تحويل</option>
                </select>
              </div>

              <button type="submit" disabled={submitting}
                className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl font-black text-lg transition-all hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-red-500/20">
                {submitting ? "جارٍ إرسال الطلب..." : "تأكيد الطلب"}
              </button>
            </form>
          </div>

          <RequestSidebar />

        </div>
      </div>
    </main>
  );
}