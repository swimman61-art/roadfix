"use client";

import { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export default function MyOrdersPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [debugInfo, setDebugInfo] = useState(""); // 🆕 لإظهار تفاصيل الخطأ

  const validateEgyptPhone = (p) => {
    const normalized = p.replace(/\s+/g, "");
    return /^01[0-2,5][0-9]{8}$/.test(normalized);
  };

  const formatDateTime = (createdAt) => {
    if (!createdAt) return "غير متوفر";
    try {
      const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
      if (isNaN(date.getTime())) return "غير متوفر";
      return new Intl.DateTimeFormat("ar-EG", {
        year: "numeric", month: "long", day: "numeric",
        hour: "numeric", minute: "2-digit",
      }).format(date);
    } catch {
      return "غير متوفر";
    }
  };

  const getStatusLabel = (status) => {
    if ((status || "new") === "new") return "جديد";
    if (status === "in-progress") return "جاري التنفيذ";
    return "تم التنفيذ ✅";
  };

  const getStatusClass = (status) => {
    if ((status || "new") === "new") return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    if (status === "in-progress") return "bg-blue-100 text-blue-800 border border-blue-300";
    return "bg-green-100 text-green-800 border border-green-300";
  };

  const getProgressWidth = (status) => {
    if ((status || "new") === "new") return "33%";
    if (status === "in-progress") return "66%";
    return "100%";
  };

  const handleSearch = async () => {
    setErrorMessage("");
    setDebugInfo("");

    if (!phone.trim()) {
      setErrorMessage("من فضلك اكتب رقم موبايلك أولًا.");
      return;
    }
    if (!validateEgyptPhone(phone)) {
      setErrorMessage("من فضلك اكتب رقم موبايل مصري صحيح مكوّن من 11 رقم.");
      return;
    }

    setLoading(true);
    setSearched(true);
    setOrders([]);

    let firstErrorMsg = "";

    try {
      const q = query(
        collection(db, "requests"),
        where("phone", "==", phone.trim()),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    } catch (error) {
      firstErrorMsg = `[محاولة 1] ${error?.code || ""} - ${error?.message || error}`;
      console.error("Attempt 1 failed:", error);

      // محاولة احتياطية بدون orderBy
      try {
        const q2 = query(collection(db, "requests"), where("phone", "==", phone.trim()));
        const snapshot2 = await getDocs(q2);
        const data2 = snapshot2.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        data2.sort((a, b) => {
          const da = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dbb = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dbb - da;
        });
        setOrders(data2);
      } catch (err2) {
        console.error("Attempt 2 failed:", err2);
        setErrorMessage("تعذر الوصول لطلباتك حاليًا. حاول مرة أخرى بعد قليل.");
        // 🆕 نظهر تفاصيل الـ error على الشاشة
        const errMsg2 = `[محاولة 2] ${err2?.code || ""} - ${err2?.message || err2}`;
        setDebugInfo(`${firstErrorMsg}\n\n${errMsg2}\n\nالمتصفح: ${navigator.userAgent}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 py-12 md:px-6" dir="rtl">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">RoadFix</span>
          <h1 className="text-3xl md:text-5xl font-black mt-4 mb-4">طلباتي</h1>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-8">
            اكتب رقم موبايلك عشان تشوف كل طلباتك السابقة وحالة كل طلب.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
          <label className="block mb-3 text-sm text-gray-600 font-bold">رقم الموبايل</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              inputMode="numeric"
              placeholder="مثال: 01012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              className="flex-1 p-4 rounded-2xl bg-white border border-slate-400 text-gray-900 outline-none focus:border-red-500 transition placeholder:text-gray-400"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black transition disabled:opacity-60">
              {loading ? "جارٍ البحث..." : "اعرض طلباتي"}
            </button>
          </div>

          {errorMessage && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-700 font-bold">{errorMessage}</p>
            </div>
          )}

          {/* 🆕 معلومات الخطأ التفصيلية - مؤقتة للـ debugging */}
          {debugInfo && (
            <div className="mt-4 bg-yellow-50 border border-yellow-300 rounded-2xl p-4">
              <p className="text-yellow-800 font-bold mb-2 text-sm">🔍 تفاصيل الخطأ (للتشخيص):</p>
              <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words leading-6 bg-white p-3 rounded-xl border border-yellow-200">
                {debugInfo}
              </pre>
            </div>
          )}
        </div>

        {/* Results */}
        {searched && !loading && orders.length === 0 && !errorMessage && (
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-10 text-center">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-500 text-lg font-bold mb-2">مفيش طلبات بالرقم ده</p>
            <p className="text-gray-400 text-sm">تأكد إنك كتبت نفس الرقم اللي طلبت بيه، أو اعمل طلب جديد.</p>
            <a href="/request" className="inline-block mt-5 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition">
              اطلب خدمة دلوقتي 🔧
            </a>
          </div>
        )}

        {orders.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm">
                لقينا <span className="font-black text-gray-900">{orders.length}</span> طلب بالرقم ده
              </p>
            </div>

            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition">
                {/* Top row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-lg font-black">{order.service || "خدمة"}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-red-500 text-sm font-bold">رقم الطلب: {order.requestNumber}</p>
                  </div>
                  <p className="text-gray-400 text-sm">{formatDateTime(order.createdAt)}</p>
                </div>

                {/* Progress bar */}
                <div className="mb-4 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full transition-all duration-500"
                    style={{ width: getProgressWidth(order.status) }} />
                </div>

                {/* Details */}
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3">
                    <p className="text-gray-400 mb-1">وصف العطل</p>
                    <p className="font-bold text-gray-900">{order.description || "غير متوفر"}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3">
                    <p className="text-gray-400 mb-1">السعر</p>
                    <p className="font-bold text-green-600">
                      {order.adminPrice ? `${order.adminPrice} جنيه` : "يحدد حسب الموقع"}
                    </p>
                  </div>
                </div>

                {order.adminNotes && (
                  <div className="mt-3 bg-amber-50 border border-amber-100 rounded-2xl p-3">
                    <p className="text-amber-700 text-xs mb-1 font-bold">ملاحظة من RoadFix</p>
                    <p className="text-gray-900 text-sm">{order.adminNotes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}