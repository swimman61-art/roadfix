"use client";

import { useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function TrackPage() {
  const [requestNumber, setRequestNumber] = useState("");
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    if (!requestNumber.trim()) return;

    setLoading(true);
    setNotFound(false);
    setRequestData(null);

    try {
      const querySnapshot = await getDocs(collection(db, "requests"));

      let found = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.requestNumber === requestNumber.trim()) {
          found = data;
        }
      });

      if (found) {
        setRequestData(found);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const getStatusText = (status) => {
    if ((status || "new") === "new") return "جديد";
    if (status === "in-progress") return "جاري التنفيذ";
    return "تم التنفيذ";
  };

  const formatDateTime = (createdAt) => {
    if (!createdAt) return "غير متوفر";

    try {
      let date;

      if (createdAt?.toDate) {
        date = createdAt.toDate();
      } else {
        date = new Date(createdAt);
      }

      if (isNaN(date.getTime())) return "غير متوفر";

      return new Intl.DateTimeFormat("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      return "غير متوفر";
    }
  };

  return (
    <main
      className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10"
      dir="rtl"
    >
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          تتبع الطلب 🚗
        </h1>

        <input
          type="text"
          placeholder="اكتب رقم الطلب (RF-xxxx)"
          value={requestNumber}
          onChange={(e) => setRequestNumber(e.target.value)}
          className="w-full p-4 rounded-xl bg-gray-950 border border-gray-700 text-white outline-none mb-4"
        />

        <button
          onClick={handleSearch}
          className="w-full bg-red-600 hover:bg-red-700 p-4 rounded-xl font-bold"
        >
          {loading ? "جاري البحث..." : "تتبع الطلب"}
        </button>

        {notFound && (
          <p className="text-center text-red-400 mt-4">
            الطلب غير موجود ❌
          </p>
        )}

        {requestData && (
          <div className="mt-6 space-y-4">
            <div className="bg-black border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400">رقم الطلب</p>
              <p className="font-bold">{requestData.requestNumber}</p>
            </div>

            <div className="bg-black border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400">الحالة</p>
              <p className="font-bold text-yellow-400">
                {getStatusText(requestData.status)}
              </p>
            </div>

            <div className="bg-black border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400">تاريخ الطلب</p>
              <p className="font-bold">
                {formatDateTime(requestData.createdAt)}
              </p>
            </div>

            <div className="bg-black border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400">الاسم</p>
              <p className="font-bold">{requestData.name || "غير متوفر"}</p>
            </div>

            <div className="bg-black border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400">الموبايل</p>
              <p className="font-bold">{requestData.phone || "غير متوفر"}</p>
            </div>

            <div className="bg-black border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400">الخدمة</p>
              <p className="font-bold">{requestData.service}</p>
            </div>

            <div className="bg-black border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400">وصف العطل</p>
              <p>{requestData.description}</p>
            </div>

            <div className="bg-black border border-gray-800 rounded-xl p-4">
              <p className="text-gray-400">بيانات العربية</p>
              <p>
                {requestData.carBrand || "غير متوفر"} -{" "}
                {requestData.carModel || "غير متوفر"} -{" "}
                {requestData.carYear || "غير متوفر"}
              </p>
            </div>

            {requestData.manualAddress && (
              <div className="bg-black border border-gray-800 rounded-xl p-4">
                <p className="text-gray-400">العنوان</p>
                <p>{requestData.manualAddress}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}