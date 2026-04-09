"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function DashboardPage() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showAlert, setShowAlert] = useState(false);
  const previousCountRef = useRef(0);
  const firstLoadRef = useRef(true);

  const fetchRequests = async () => {
    try {
      const q = query(
        collection(db, "requests"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (!firstLoadRef.current && data.length > previousCountRef.current) {
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }

      previousCountRef.current = data.length;
      firstLoadRef.current = false;

      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const updateStatus = async (id, currentStatus) => {
    let newStatus = "new";

    if (currentStatus === "new") newStatus = "in-progress";
    else if (currentStatus === "in-progress") newStatus = "done";
    else newStatus = "done";

    try {
      const ref = doc(db, "requests", id);
      await updateDoc(ref, { status: newStatus });

      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();

    const interval = setInterval(() => {
      fetchRequests();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredRequests = useMemo(() => {
    if (filter === "all") return requests;
    return requests.filter((request) => {
      const status = request.status || "new";
      return status === filter;
    });
  }, [requests, filter]);

  const filterButtonClass = (value) =>
    `px-5 py-3 rounded-xl font-bold transition min-w-[140px] ${
      filter === value
        ? "bg-red-600 text-white"
        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
    }`;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          🚗 Dashboard الطلبات
        </h1>

        {showAlert && (
          <div className="mb-6 bg-red-600 text-white text-center font-bold py-4 rounded-2xl shadow-lg animate-pulse">
            طلب جديد وصل الآن 🚨
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={filterButtonClass("all")}
          >
            الكل
          </button>

          <button
            onClick={() => setFilter("new")}
            className={filterButtonClass("new")}
          >
            الجديد
          </button>

          <button
            onClick={() => setFilter("in-progress")}
            className={filterButtonClass("in-progress")}
          >
            جاري التنفيذ
          </button>

          <button
            onClick={() => setFilter("done")}
            className={filterButtonClass("done")}
          >
            تم الانتهاء
          </button>
        </div>

        {filteredRequests.length === 0 ? (
          <p className="text-center text-gray-400">لا توجد طلبات في هذا القسم</p>
        ) : (
          <div className="grid gap-5">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-gray-900 border border-gray-700 rounded-2xl p-5 shadow-lg"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <p className="text-right">
                      <span className="text-red-400 font-bold">الحالة:</span>{" "}
                      {request.status === "new" && "🟡 جديد"}
                      {request.status === "in-progress" && "🔵 جاري التنفيذ"}
                      {request.status === "done" && "🟢 تم الانتهاء"}
                      {!request.status && "🟡 جديد"}
                    </p>

                    <p className="text-right">
                      <span className="text-red-400 font-bold">الخدمة:</span>{" "}
                      {request.service}
                    </p>

                    <p className="text-right">
                      <span className="text-red-400 font-bold">الاسم:</span>{" "}
                      {request.name}
                    </p>

                    <p className="text-right">
                      <span className="text-red-400 font-bold">الموبايل:</span>{" "}
                      {request.phone}
                    </p>

                    <p className="text-right">
                      <span className="text-red-400 font-bold">الوصف:</span>{" "}
                      {request.description}
                    </p>

                    <p className="text-right">
                      <span className="text-red-400 font-bold">نوع العربية:</span>{" "}
                      {request.carBrand}
                    </p>

                    <p className="text-right">
                      <span className="text-red-400 font-bold">الموديل:</span>{" "}
                      {request.carModel}
                    </p>

                    <p className="text-right">
                      <span className="text-red-400 font-bold">سنة الصنع:</span>{" "}
                      {request.carYear}
                    </p>

                    {request.plateNumber && (
                      <p className="text-right">
                        <span className="text-red-400 font-bold">رقم اللوحة:</span>{" "}
                        {request.plateNumber}
                      </p>
                    )}

                    <p className="text-right">
                      <span className="text-red-400 font-bold">سعر الكشف:</span>{" "}
                      {request.price} جنيه
                    </p>

                    <p className="text-right">
                      <span className="text-red-400 font-bold">طريقة الدفع:</span>{" "}
                      {request.paymentMethod || "غير محدد"}
                    </p>

                    {request.imageName && (
                      <p className="text-right">
                        <span className="text-red-400 font-bold">الصورة:</span>{" "}
                        {request.imageName}
                      </p>
                    )}

                    {request.location && (
                      <div className="text-right">
                        <span className="text-red-400 font-bold">الموقع:</span>
                        <div className="mt-2">
                          <a
                            href={`https://www.google.com/maps?q=${request.location.lat},${request.location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-xl font-bold"
                          >
                            فتح الموقع على الخريطة 📍
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex md:justify-end items-end">
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                      <a
                        href={`tel:${request.phone}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl text-center font-bold"
                      >
                        اتصال
                      </a>

                      <a
                        href={`https://wa.me/2${request.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl text-center font-bold"
                      >
                        واتساب
                      </a>

                      <button
                        onClick={() => updateStatus(request.id, request.status)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold"
                      >
                        {request.status === "new" && "ابدأ الشغل"}
                        {request.status === "in-progress" && "إنهاء الطلب"}
                        {request.status === "done" && "تم ✔"}
                        {!request.status && "ابدأ الشغل"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}