"use client";

import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function TrackPage() {
  const [requestNumber, setRequestNumber] = useState("");
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [urlNumber, setUrlNumber] = useState("");

  const handleSearch = async (customRequestNumber) => {
    const valueToSearch =
      typeof customRequestNumber === "string"
        ? customRequestNumber
        : requestNumber;

    const trimmedRequestNumber = valueToSearch.trim().toUpperCase();

    if (!trimmedRequestNumber) {
      setErrorMessage("من فضلك اكتب رقم الطلب أولًا.");
      setRequestData(null);
      setNotFound(false);
      return;
    }

    setLoading(true);
    setNotFound(false);
    setRequestData(null);
    setErrorMessage("");

    try {
      const querySnapshot = await getDocs(collection(db, "requests"));

      let found = null;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if ((data.requestNumber || "").toUpperCase() === trimmedRequestNumber) {
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
      setErrorMessage(
        "تعذر الوصول لبيانات الطلب حاليًا. حاول مرة أخرى بعد قليل."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fullUrl = new URL(window.location.href);
    const numberFromUrl = fullUrl.searchParams.get("number");

    if (numberFromUrl) {
      const cleanedNumber = numberFromUrl.trim().toUpperCase();
      setUrlNumber(cleanedNumber);
      setRequestNumber(cleanedNumber);

      setTimeout(() => {
        handleSearch(cleanedNumber);
      }, 300);
    }
  }, []);

  const getStatusText = (status) => {
    if ((status || "new") === "new") return "جديد";
    if (status === "in-progress") return "جاري التنفيذ";
    return "تم التنفيذ";
  };

  const getStatusClass = (status) => {
    if ((status || "new") === "new") {
      return "bg-yellow-500/10 border border-yellow-500/30 text-yellow-300";
    }

    if (status === "in-progress") {
      return "bg-blue-500/10 border border-blue-500/30 text-blue-300";
    }

    return "bg-green-500/10 border border-green-500/30 text-green-300";
  };

  const getStatusHint = (status) => {
    if ((status || "new") === "new") {
      return "تم استلام طلبك وهو الآن قيد المراجعة.";
    }

    if (status === "in-progress") {
      return "يجري العمل على طلبك الآن.";
    }

    return "تم الانتهاء من الطلب. يمكنك التواصل معنا إذا كنت تحتاج متابعة إضافية.";
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

  const progressWidth = useMemo(() => {
    if (!requestData) return "0%";
    if ((requestData.status || "new") === "new") return "33%";
    if (requestData.status === "in-progress") return "66%";
    return "100%";
  }, [requestData]);

  return (
    <main
      className="min-h-screen bg-black text-white px-4 py-10"
      dir="rtl"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-red-500 font-bold mb-3">RoadFix</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            تتبع الطلب
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-8">
            اكتب رقم الطلب لمعرفة حالته الحالية وتفاصيله الأساسية بشكل سريع وواضح.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 md:p-8 shadow-2xl">
          {urlNumber && (
            <div className="mb-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4">
              <p className="text-blue-300 font-bold">
                تم قراءة رقم الطلب من الرابط: {urlNumber}
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="block mb-3 text-sm text-gray-300 font-bold">
              رقم الطلب
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="اكتب رقم الطلب مثل: RF-1740000000000"
                value={requestNumber}
                onChange={(e) => setRequestNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="flex-1 p-4 rounded-2xl bg-gray-950 border border-gray-700 text-white outline-none focus:border-red-500"
              />

              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 px-6 py-4 rounded-2xl font-bold disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading ? "جاري البحث..." : "تتبع الطلب"}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
              <p className="text-red-300 font-bold">{errorMessage}</p>
            </div>
          )}

          {notFound && (
            <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4">
              <p className="text-yellow-300 font-bold mb-2">الطلب غير موجود</p>
              <p className="text-sm text-yellow-100 leading-7">
                تأكد من كتابة رقم الطلب بشكل صحيح، ثم حاول مرة أخرى.
              </p>
            </div>
          )}

          {requestData && (
            <div className="space-y-5">
              <div className="bg-black border border-gray-800 rounded-2xl p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">رقم الطلب</p>
                    <p className="text-2xl font-extrabold text-white">
                      {requestData.requestNumber}
                    </p>
                  </div>

                  <div
                    className={`px-4 py-2 rounded-full text-sm font-bold w-fit ${getStatusClass(
                      requestData.status
                    )}`}
                  >
                    {getStatusText(requestData.status)}
                  </div>
                </div>

                <div className="mb-3 h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full transition-all duration-500"
                    style={{ width: progressWidth }}
                  />
                </div>

                <p className="text-sm text-gray-300 leading-7">
                  {getStatusHint(requestData.status)}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-black border border-gray-800 rounded-2xl p-4">
                  <p className="text-gray-400 mb-2">تاريخ الطلب</p>
                  <p className="font-bold text-white">
                    {formatDateTime(requestData.createdAt)}
                  </p>
                </div>

                <div className="bg-black border border-gray-800 rounded-2xl p-4">
                  <p className="text-gray-400 mb-2">الخدمة</p>
                  <p className="font-bold text-white">
                    {requestData.service || "غير متوفر"}
                  </p>
                </div>

                <div className="bg-black border border-gray-800 rounded-2xl p-4">
                  <p className="text-gray-400 mb-2">الاسم</p>
                  <p className="font-bold text-white">
                    {requestData.name || "غير متوفر"}
                  </p>
                </div>

                <div className="bg-black border border-gray-800 rounded-2xl p-4">
                  <p className="text-gray-400 mb-2">الموبايل</p>
                  <p className="font-bold text-white">
                    {requestData.phone || "غير متوفر"}
                  </p>
                </div>
              </div>

              <div className="bg-black border border-gray-800 rounded-2xl p-4">
                <p className="text-gray-400 mb-2">وصف العطل</p>
                <p className="text-white leading-8">
                  {requestData.description || "غير متوفر"}
                </p>
              </div>

              <div className="bg-black border border-gray-800 rounded-2xl p-4">
                <p className="text-gray-400 mb-3">بيانات العربية</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="bg-gray-950 border border-gray-800 rounded-xl p-3">
                    <p className="text-gray-400 mb-1 text-sm">النوع</p>
                    <p className="font-bold text-white">
                      {requestData.carBrand || "غير متوفر"}
                    </p>
                  </div>

                  <div className="bg-gray-950 border border-gray-800 rounded-xl p-3">
                    <p className="text-gray-400 mb-1 text-sm">الموديل</p>
                    <p className="font-bold text-white">
                      {requestData.carModel || "غير متوفر"}
                    </p>
                  </div>

                  <div className="bg-gray-950 border border-gray-800 rounded-xl p-3">
                    <p className="text-gray-400 mb-1 text-sm">سنة الصنع</p>
                    <p className="font-bold text-white">
                      {requestData.carYear || "غير متوفر"}
                    </p>
                  </div>
                </div>
              </div>

              {requestData.manualAddress && (
                <div className="bg-black border border-gray-800 rounded-2xl p-4">
                  <p className="text-gray-400 mb-2">العنوان</p>
                  <p className="text-white leading-8">
                    {requestData.manualAddress}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}