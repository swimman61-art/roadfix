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
  const [searchTerm, setSearchTerm] = useState("");
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
        setTimeout(() => setShowAlert(false), 5000);
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

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredRequests = useMemo(() => {
    let result = requests;

    if (filter !== "all") {
      result = result.filter((request) => {
        const status = request.status || "new";
        return status === filter;
      });
    }

    if (searchTerm.trim()) {
      const search = searchTerm.trim().toLowerCase();

      result = result.filter((request) => {
        const name = request.name?.toLowerCase() || "";
        const phone = request.phone?.toLowerCase() || "";
        const requestNumber = request.requestNumber?.toLowerCase() || "";

        return (
          name.includes(search) ||
          phone.includes(search) ||
          requestNumber.includes(search)
        );
      });
    }

    return result;
  }, [requests, filter, searchTerm]);

  const countNew = requests.filter(
    (r) => (r.status || "new") === "new"
  ).length;
  const countProgress = requests.filter(
    (r) => r.status === "in-progress"
  ).length;
  const countDone = requests.filter(
    (r) => r.status === "done"
  ).length;

  const getStatusLabel = (status) => {
    if ((status || "new") === "new") return "جديد";
    if (status === "in-progress") return "جاري التنفيذ";
    return "تم";
  };

  const getStatusClass = (status) => {
    if ((status || "new") === "new") {
      return "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30";
    }

    if (status === "in-progress") {
      return "bg-blue-500/15 text-blue-300 border border-blue-500/30";
    }

    return "bg-green-500/15 text-green-300 border border-green-500/30";
  };

  const getFilterButtonClass = (value) => {
    const base =
      "px-5 py-3 rounded-2xl font-bold transition-all duration-300 min-w-[150px] border";

    if (filter === value) {
      if (value === "all") {
        return `${base} bg-red-600 text-white border-red-500 shadow-lg`;
      }

      if (value === "new") {
        return `${base} bg-yellow-500 text-black border-yellow-400 shadow-lg`;
      }

      if (value === "in-progress") {
        return `${base} bg-blue-600 text-white border-blue-500 shadow-lg`;
      }

      return `${base} bg-green-600 text-white border-green-500 shadow-lg`;
    }

    return `${base} bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800`;
  };

  return (
    <main
      className="min-h-screen bg-black text-white px-4 py-8 md:px-6 md:py-10"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <p className="text-red-500 font-bold mb-3">RoadFix Dashboard</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            إدارة الطلبات
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-8">
            راقب الطلبات الجديدة، تابع التنفيذ، وغيّر الحالة بسهولة من مكان واحد.
          </p>
        </div>

        {showAlert && (
          <div className="mb-6 bg-red-600 text-white text-center font-bold py-4 rounded-2xl animate-pulse shadow-lg">
            طلب جديد وصل الآن 🚨
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 shadow-xl">
            <p className="text-gray-400 text-sm mb-2">إجمالي الطلبات</p>
            <p className="text-3xl font-extrabold text-white">{requests.length}</p>
          </div>

          <div className="bg-gray-900 border border-yellow-500/20 rounded-3xl p-5 shadow-xl">
            <p className="text-gray-400 text-sm mb-2">طلبات جديدة</p>
            <p className="text-3xl font-extrabold text-yellow-400">{countNew}</p>
          </div>

          <div className="bg-gray-900 border border-blue-500/20 rounded-3xl p-5 shadow-xl">
            <p className="text-gray-400 text-sm mb-2">جاري التنفيذ</p>
            <p className="text-3xl font-extrabold text-blue-400">{countProgress}</p>
          </div>

          <div className="bg-gray-900 border border-green-500/20 rounded-3xl p-5 shadow-xl">
            <p className="text-gray-400 text-sm mb-2">تم التنفيذ</p>
            <p className="text-3xl font-extrabold text-green-400">{countDone}</p>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="ابحث بالاسم أو رقم الموبايل أو رقم الطلب"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 text-white outline-none focus:border-red-500"
          />
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={getFilterButtonClass("all")}
          >
            الكل ({requests.length})
          </button>

          <button
            onClick={() => setFilter("new")}
            className={getFilterButtonClass("new")}
          >
            الجديد ({countNew})
          </button>

          <button
            onClick={() => setFilter("in-progress")}
            className={getFilterButtonClass("in-progress")}
          >
            جاري التنفيذ ({countProgress})
          </button>

          <button
            onClick={() => setFilter("done")}
            className={getFilterButtonClass("done")}
          >
            تم ({countDone})
          </button>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 text-center">
            <p className="text-gray-400 text-lg">لا توجد طلبات في هذا القسم</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-gray-900 border border-gray-800 rounded-3xl p-5 md:p-6 shadow-2xl"
              >
                <div className="flex flex-col xl:flex-row gap-6">
                  <div className="flex-1 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-800">
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold">
                          {request.name || "طلب جديد"}
                        </h2>

                        <p className="text-gray-400 text-sm mt-1">
                          رقم الموبايل: {request.phone || "غير محدد"}
                        </p>

                        <p className="text-red-400 text-sm font-bold mt-2">
                          رقم الطلب: {request.requestNumber || "غير موجود"}
                        </p>

                        <p className="text-gray-400 text-sm mt-2">
                          تاريخ الطلب: {formatDateTime(request.createdAt)}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold w-fit ${getStatusClass(
                          request.status
                        )}`}
                      >
                        {getStatusLabel(request.status)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="bg-black border border-gray-800 rounded-2xl p-4">
                        <p className="text-gray-400 mb-2">الخدمة</p>
                        <p className="font-bold text-white">
                          {request.service || "غير محدد"}
                        </p>
                      </div>

                      <div className="bg-black border border-gray-800 rounded-2xl p-4">
                        <p className="text-gray-400 mb-2">طريقة الدفع</p>
                        <p className="font-bold text-white">
                          {request.paymentMethod || "غير محدد"}
                        </p>
                      </div>

                      <div className="bg-black border border-gray-800 rounded-2xl p-4">
                        <p className="text-gray-400 mb-2">سعر الكشف</p>
                        <p className="font-bold text-white">
                          {request.price || "غير محدد"} جنيه
                        </p>
                      </div>

                      <div className="bg-black border border-gray-800 rounded-2xl p-4">
                        <p className="text-gray-400 mb-2">رقم اللوحة</p>
                        <p className="font-bold text-white">
                          {request.plateNumber || "غير محدد"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-black border border-gray-800 rounded-2xl p-4">
                      <p className="text-gray-400 mb-2">وصف العطل</p>
                      <p className="text-white leading-8">
                        {request.description || "لا يوجد وصف"}
                      </p>
                    </div>

                    <div className="bg-black border border-gray-800 rounded-2xl p-4">
                      <p className="text-gray-400 mb-3">بيانات العربية</p>
                      <div className="grid sm:grid-cols-3 gap-3 text-sm">
                        <div className="bg-gray-950 border border-gray-800 rounded-xl p-3">
                          <p className="text-gray-400 mb-1">النوع</p>
                          <p className="font-bold text-white">
                            {request.carBrand || "غير محدد"}
                          </p>
                        </div>

                        <div className="bg-gray-950 border border-gray-800 rounded-xl p-3">
                          <p className="text-gray-400 mb-1">الموديل</p>
                          <p className="font-bold text-white">
                            {request.carModel || "غير محدد"}
                          </p>
                        </div>

                        <div className="bg-gray-950 border border-gray-800 rounded-xl p-3">
                          <p className="text-gray-400 mb-1">سنة الصنع</p>
                          <p className="font-bold text-white">
                            {request.carYear || "غير محدد"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {(request.imageName || request.imageUrl) && (
                      <div className="bg-black border border-gray-800 rounded-2xl p-4">
                        <p className="text-gray-400 mb-3">صورة العطل</p>

                        {request.imageName && (
                          <p className="text-sm text-gray-300 mb-3">
                            اسم الصورة: {request.imageName}
                          </p>
                        )}

                        {request.imageUrl ? (
                          <img
                            src={request.imageUrl}
                            alt="صورة العطل"
                            className="w-full max-h-72 object-cover rounded-2xl border border-gray-800"
                          />
                        ) : (
                          <div className="bg-gray-950 border border-dashed border-gray-700 rounded-2xl p-5 text-sm text-yellow-300">
                            الصورة لم تُعرض بعد. غالبًا Firebase Storage لم يتم
                            تفعيله أو لم يتم حفظ رابط الصورة.
                          </div>
                        )}
                      </div>
                    )}

                    {(request.location || request.manualAddress) && (
                      <div className="bg-black border border-gray-800 rounded-2xl p-4">
                        <p className="text-gray-400 mb-3">الموقع</p>

                        {request.manualAddress && (
                          <div className="mb-3 bg-gray-950 border border-gray-800 rounded-xl p-3">
                            <p className="text-gray-400 mb-1 text-sm">
                              العنوان اليدوي
                            </p>
                            <p className="text-white leading-7">
                              {request.manualAddress}
                            </p>
                          </div>
                        )}

                        {request.location && (
                          <a
                            href={`https://www.google.com/maps?q=${request.location.lat},${request.location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-3 rounded-xl font-bold transition"
                          >
                            فتح الموقع على الخريطة 📍
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="xl:w-[260px] flex flex-col gap-4">
                    <div className="bg-black border border-gray-800 rounded-2xl p-4">
                      <p className="text-gray-400 text-sm mb-3">إجراءات سريعة</p>

                      <div className="flex flex-col gap-3">
                        <a
                          href={`tel:${request.phone}`}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl text-center font-bold transition"
                        >
                          اتصال
                        </a>

                        <a
                          href={`https://wa.me/2${request.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl text-center font-bold transition"
                        >
                          واتساب
                        </a>

                        <button
                          onClick={() =>
                            updateStatus(request.id, request.status || "new")
                          }
                          disabled={request.status === "done"}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                          {(request.status || "new") === "new" && "ابدأ الشغل"}
                          {request.status === "in-progress" && "إنهاء الطلب"}
                          {request.status === "done" && "تم ✔"}
                        </button>
                      </div>
                    </div>

                    <div className="bg-red-600 rounded-2xl p-4 shadow-xl">
                      <p className="font-bold mb-2">ملاحظة</p>
                      <p className="text-sm leading-7 text-white/90">
                        لو الصورة لا تظهر، فده معناه غالبًا إن Firebase Storage
                        لم يكتمل تفعيله بعد.
                      </p>
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