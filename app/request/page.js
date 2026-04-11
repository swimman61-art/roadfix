"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

function RequestForm() {
  const searchParams = useSearchParams();
  const service = searchParams.get("service") || "";

  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [manualAddress, setManualAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

  const getLocationErrorMessage = (error) => {
    if (!error) {
      return "تعذر تحديد موقعك الآن، لكن لا تقلق، يمكنك كتابة عنوانك يدويًا وسيتم تسجيل الطلب بشكل طبيعي.";
    }

    if (error.code === 1) {
      return "تم رفض إذن الموقع. يمكنك السماح بإذن الموقع من المتصفح، أو ببساطة كتابة عنوانك يدويًا وإكمال الطلب.";
    }

    if (error.code === 2) {
      return "تعذر الوصول لموقعك حاليًا. اكتب عنوانك يدويًا بشكل واضح وسيتم استلام الطلب عادي.";
    }

    if (error.code === 3) {
      return "استغرق تحديد الموقع وقتًا أطول من اللازم. حاول مرة أخرى أو اكتب عنوانك يدويًا في الخانة بالأسفل.";
    }

    return "تعذر تحديد موقعك الآن. اكتب عنوانك يدويًا في الخانة بالأسفل وسيتم إرسال الطلب بشكل طبيعي.";
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage(
        "هذا المتصفح لا يدعم تحديد الموقع. اكتب عنوانك يدويًا بالأسفل وسيتم إرسال الطلب بشكل طبيعي."
      );
      return;
    }

    setLoadingLocation(true);
    setLocationMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoadingLocation(false);
        setLocationMessage("تم تحديد موقعك بنجاح ✅");
      },
      (firstError) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setLoadingLocation(false);
            setLocationMessage("تم تحديد موقعك بنجاح ✅");
          },
          (secondError) => {
            setLoadingLocation(false);
            setLocation(null);
            setLocationMessage(
              getLocationErrorMessage(secondError || firstError)
            );
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 30000,
          }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const getServicePrice = (serviceName) => {
    if (serviceName === "بطارية") return 150;
    if (serviceName === "كاوتش") return 120;
    if (serviceName === "بنزين") return 100;
    if (serviceName === "كهرباء") return 180;
    if (serviceName === "عطل") return 200;
    return 100;
  };

  const price = getServicePrice(service);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const phone = e.target.phone.value;
    const description = e.target.description.value;
    const carBrand = e.target.carBrand.value;
    const carModel = e.target.carModel.value;
    const carYear = e.target.carYear.value;
    const plateNumber = e.target.plateNumber.value;
    const paymentMethod = e.target.paymentMethod.value;

    if (!name || !phone || !description) {
      alert("من فضلك املى البيانات الأساسية");
      return;
    }

    if (!location && !manualAddress.trim()) {
      alert("حدد موقعك أو اكتب عنوانك يدويًا");
      return;
    }

    try {
      setSubmitting(true);

      await addDoc(collection(db, "requests"), {
        service,
        name,
        phone,
        description,
        carBrand,
        carModel,
        carYear,
        plateNumber,
        paymentMethod,
        price,
        status: "new",
        location: location || null,
        manualAddress: manualAddress.trim() || null,
        imageName: selectedImage ? selectedImage.name : null,
        imageUrl: null,
        createdAt: new Date(),
      });

      alert("تم إرسال الطلب بنجاح 🚗");
      e.target.reset();
      setLocation(null);
      setSelectedImage(null);
      setManualAddress("");
      setLocationMessage("");
    } catch (error) {
      console.error(error);
      alert("حصل خطأ أثناء إرسال الطلب ❌");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      className="min-h-screen bg-black text-white px-4 py-8 md:px-6 md:py-10"
      dir="rtl"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-red-500 font-bold mb-3">RoadFix</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            طلب خدمة السيارة
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-8">
            املى البيانات المطلوبة بشكل واضح، وحدد موقعك أو اكتب عنوانك يدويًا،
            وسيتم تسجيل الطلب فورًا.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-5 md:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-6 border-b border-gray-800">
              <div>
                <h2 className="text-2xl font-bold">بيانات الطلب</h2>
                <p className="text-gray-400 mt-2">
                  املى البيانات الأساسية والعنوان وطريقة الدفع
                </p>
              </div>

              <div className="bg-black border border-gray-800 rounded-2xl px-5 py-4 text-center">
                <p className="text-sm text-gray-400 mb-1">سعر الكشف</p>
                <p className="text-2xl font-extrabold text-yellow-400">
                  {price} جنيه
                </p>
              </div>
            </div>

            {service && (
              <div className="mb-6 bg-red-600/10 border border-red-500/30 rounded-2xl p-4">
                <p className="text-red-400 font-bold text-lg">
                  نوع الخدمة المختار: {service}
                </p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="bg-black border border-gray-800 rounded-2xl p-5">
                <h3 className="text-xl font-bold text-red-400 mb-4">
                  بيانات العميل
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm text-gray-300">
                      الاسم
                    </label>
                    <input
                      name="name"
                      placeholder="اكتب اسمك"
                      className="w-full p-3 rounded-xl bg-gray-950 border border-gray-700 text-white outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm text-gray-300">
                      الموبايل
                    </label>
                    <input
                      name="phone"
                      placeholder="اكتب رقم الموبايل"
                      className="w-full p-3 rounded-xl bg-gray-950 border border-gray-700 text-white outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm text-gray-300">
                    وصف العطل
                  </label>
                  <textarea
                    name="description"
                    placeholder="اكتب وصف بسيط للعطل"
                    className="w-full p-3 rounded-xl bg-gray-950 border border-gray-700 text-white h-28 outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="bg-black border border-gray-800 rounded-2xl p-5">
                <h3 className="text-xl font-bold text-red-400 mb-4">
                  بيانات العربية
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    name="carBrand"
                    placeholder="نوع العربية (BMW - VW...)"
                    className="w-full p-3 rounded-xl bg-gray-950 border border-gray-700 text-white outline-none focus:border-red-500"
                  />

                  <input
                    name="carModel"
                    placeholder="الموديل (Passat - Golf...)"
                    className="w-full p-3 rounded-xl bg-gray-950 border border-gray-700 text-white outline-none focus:border-red-500"
                  />

                  <input
                    name="carYear"
                    placeholder="سنة الصنع"
                    className="w-full p-3 rounded-xl bg-gray-950 border border-gray-700 text-white outline-none focus:border-red-500"
                  />

                  <input
                    name="plateNumber"
                    placeholder="رقم اللوحة (اختياري)"
                    className="w-full p-3 rounded-xl bg-gray-950 border border-gray-700 text-white outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="bg-black border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <h3 className="text-xl font-bold text-red-400">الموقع</h3>
                  <span className="text-xs md:text-sm text-gray-400">
                    GPS أو عنوان يدوي
                  </span>
                </div>

                <button
                  type="button"
                  onClick={getLocation}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 p-3 rounded-xl font-bold text-black transition"
                >
                  {loadingLocation ? "جارٍ تحديد الموقع..." : "تحديد موقعي 📍"}
                </button>

                {location && (
                  <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm space-y-1">
                    <p>تم تحديد الموقع ✅</p>
                    <p>
                      Lat: {location.lat} | Lng: {location.lng}
                    </p>
                  </div>
                )}

                {locationMessage && !location && (
                  <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4">
                    <p className="text-yellow-300 font-bold mb-2">
                      تعذر تحديد الموقع تلقائيًا
                    </p>
                    <p className="text-sm text-yellow-100 leading-7">
                      {locationMessage}
                    </p>
                  </div>
                )}

                <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
                  <p className="text-blue-300 font-bold mb-2">
                    بديل سريع لو GPS لم يعمل
                  </p>
                  <p className="text-sm text-blue-100 leading-7 mb-4">
                    يمكنك فتح خرائط Google، معرفة موقعك أو أقرب عنوان، ثم كتابة
                    العنوان يدويًا في الخانة بالأسفل.
                  </p>

                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold transition"
                  >
                    فتح Google Maps
                  </a>
                </div>

                <div className="mt-4 bg-gray-950 border border-dashed border-gray-700 rounded-2xl p-4">
                  <label className="block text-sm text-gray-300 mb-2 font-bold">
                    اكتب عنوانك يدويًا
                  </label>
                  <p className="text-xs text-gray-400 mb-3 leading-6">
                    اكتب المنطقة والشارع وأقرب علامة مميزة، مثال:
                    مدينة نصر - عباس العقاد - أمام ماكدونالدز
                  </p>
                  <textarea
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="مثال: مدينة نصر - شارع عباس العقاد - أمام..."
                    className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white h-28 outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="bg-black border border-gray-800 rounded-2xl p-5">
                <h3 className="text-xl font-bold text-red-400 mb-4">
                  صورة العطل
                </h3>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                  className="w-full p-3 bg-gray-950 border border-gray-700 rounded-xl"
                />

                {selectedImage && (
                  <p className="text-green-400 text-sm mt-3">
                    تم اختيار الصورة: {selectedImage.name}
                  </p>
                )}

                <p className="text-yellow-300 text-sm mt-3 leading-7">
                  سيتم حفظ اسم الصورة فقط مؤقتًا لحد ما نفعّل رفع الصور بالكامل.
                </p>
              </div>

              <div className="bg-black border border-gray-800 rounded-2xl p-5">
                <h3 className="text-xl font-bold text-red-400 mb-4">
                  طريقة الدفع
                </h3>

                <select
                  name="paymentMethod"
                  className="w-full p-3 rounded-xl bg-gray-950 border border-gray-700 text-white outline-none focus:border-red-500"
                  defaultValue="كاش"
                >
                  <option value="كاش">كاش</option>
                  <option value="تحويل">تحويل</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-600 hover:bg-red-700 p-4 rounded-2xl font-bold text-lg disabled:opacity-60 transition"
              >
                {submitting ? "جارٍ إرسال الطلب..." : "تأكيد الطلب"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 shadow-xl">
              <h3 className="text-xl font-bold text-red-400 mb-4">
                ملاحظات مهمة
              </h3>

              <div className="space-y-3 text-gray-300 leading-7 text-sm">
                <div className="bg-black border border-gray-800 rounded-2xl p-4">
                  تأكد من كتابة رقم موبايل صحيح علشان نقدر نتواصل معاك بسرعة.
                </div>

                <div className="bg-black border border-gray-800 rounded-2xl p-4">
                  لو تحديد الموقع ما اشتغلش، اكتب عنوان واضح بالتفصيل والطلب
                  هيتسجل عادي.
                </div>

                <div className="bg-black border border-gray-800 rounded-2xl p-4">
                  رفع الصورة متوقف مؤقتًا، لكن الطلب بيتبعت بشكل طبيعي.
                </div>
              </div>
            </div>

            <div className="bg-red-600 rounded-3xl p-5 shadow-xl">
              <h3 className="text-xl font-bold mb-3">RoadFix</h3>
              <p className="text-white/90 leading-8 text-sm">
                حتى لو تحديد الموقع التلقائي لم يعمل، يمكنك كتابة العنوان يدويًا
                أو فتح Google Maps، وسيتم استقبال الطلب بشكل طبيعي.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={<div className="text-white text-center mt-10">Loading...</div>}
    >
      <RequestForm />
    </Suspense>
  );
}