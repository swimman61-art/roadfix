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

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoadingLocation(false);
      },
      () => {
        alert("لم نتمكن من تحديد موقعك");
        setLoadingLocation(false);
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

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-xl mx-auto bg-gray-900 p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">
          طلب خدمة 🚗
        </h1>

        {service && (
          <p className="text-lg text-red-400 mb-4 text-center">
            نوع الخدمة: {service}
          </p>
        )}

        <p className="text-center text-yellow-400 font-bold mb-6">
          سعر الكشف: {price} جنيه
        </p>

        <form
          className="space-y-4"
          onSubmit={async (e) => {
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

            try {
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
                imageName: selectedImage ? selectedImage.name : null,
                createdAt: new Date(),
              });

              alert("تم إرسال الطلب بنجاح 🚗");
              e.target.reset();
              setLocation(null);
              setSelectedImage(null);
            } catch (error) {
              console.error(error);
              alert("حصل خطأ ❌");
            }
          }}
        >
          <div>
            <label className="block mb-2 text-sm text-gray-300">الاسم</label>
            <input
              name="name"
              placeholder="اكتب اسمك"
              className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">الموبايل</label>
            <input
              name="phone"
              placeholder="اكتب رقم الموبايل"
              className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">وصف العطل</label>
            <textarea
              name="description"
              placeholder="اكتب وصف بسيط للعطل"
              className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white h-24"
            />
          </div>

          <div className="bg-black border border-gray-700 p-4 rounded-xl space-y-3">
            <h3 className="text-red-400 font-bold">بيانات العربية</h3>

            <input
              name="carBrand"
              placeholder="نوع العربية (BMW - VW...)"
              className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white"
            />

            <input
              name="carModel"
              placeholder="الموديل (Passat - Golf...)"
              className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white"
            />

            <input
              name="carYear"
              placeholder="سنة الصنع"
              className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white"
            />

            <input
              name="plateNumber"
              placeholder="رقم اللوحة (اختياري)"
              className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white"
            />
          </div>

          <button
            type="button"
            onClick={getLocation}
            className="w-full bg-yellow-500 p-3 rounded-xl font-bold text-black"
          >
            {loadingLocation ? "جارٍ تحديد الموقع..." : "تحديد موقعي 📍"}
          </button>

          {location && <p className="text-green-400">تم تحديد الموقع ✅</p>}

          <div className="bg-black border border-gray-700 p-4 rounded-xl space-y-3">
            <label className="block text-sm text-gray-300">صورة العطل</label>
            <input
              type="file"
              onChange={(e) => setSelectedImage(e.target.files[0])}
              className="w-full p-3 bg-black border border-gray-700 rounded-xl"
            />

            {selectedImage && (
              <p className="text-green-400 text-sm">
                تم اختيار الصورة: {selectedImage.name}
              </p>
            )}
          </div>

          <div className="bg-black border border-gray-700 p-4 rounded-xl space-y-3">
            <h3 className="text-red-400 font-bold">طريقة الدفع</h3>

            <select
              name="paymentMethod"
              className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white"
              defaultValue="كاش"
            >
              <option value="كاش">كاش</option>
              <option value="تحويل">تحويل</option>
            </select>
          </div>

          <button className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-xl font-bold">
            تأكيد الطلب
          </button>
        </form>
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