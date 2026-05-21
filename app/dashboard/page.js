"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

const SERVICE_OPTIONS = [
  "all", "بطارية", "كاوتش", "بنزين", "كهرباء", "ميكانيكا", "صيانة دورية", "عطل",
];

const ADMIN_WHATSAPP = "201011174777";

export default function DashboardPage() {
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [copiedId, setCopiedId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  // حالة تعديل السعر والملاحظات
  const [editingId, setEditingId] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [savingId, setSavingId] = useState("");

  const previousCountRef = useRef(0);
  const firstLoadRef = useRef(true);

  // ===== تحديث الحالة =====
  const updateStatus = async (id, currentStatus) => {
    let newStatus = "new";
    if (currentStatus === "new") newStatus = "in-progress";
    else if (currentStatus === "in-progress") newStatus = "done";
    else newStatus = "done";

    try {
      await updateDoc(doc(db, "requests", id), { status: newStatus });
      setRequests((prev) =>
        prev.map((req) => req.id === id ? { ...req, status: newStatus } : req)
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // ===== حفظ السعر والملاحظات =====
  const saveNotesAndPrice = async (id) => {
    try {
      setSavingId(id);
      await updateDoc(doc(db, "requests", id), {
        adminPrice: editPrice || null,
        adminNotes: editNotes || null,
      });
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id
            ? { ...req, adminPrice: editPrice, adminNotes: editNotes }
            : req
        )
      );
      setEditingId("");
    } catch (error) {
      console.error("Save error:", error);
      alert("حصل خطأ أثناء الحفظ");
    } finally {
      setSavingId("");
    }
  };

  // ===== حذف الطلب =====
  const handleDelete = async (id, requestNumber) => {
    const confirmed = window.confirm(`هل أنت متأكد من حذف الطلب ${requestNumber || ""}؟`);
    if (!confirmed) return;
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "requests", id));
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      alert("حصلت مشكلة أثناء حذف الطلب");
    } finally {
      setDeletingId("");
    }
  };

  // ===== تسجيل الخروج =====
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      alert("حصلت مشكلة أثناء تسجيل الخروج");
    } finally {
      setLogoutLoading(false);
    }
  };

  // ===== نسخ رقم الطلب =====
  const copyRequestNumber = async (requestNumber, requestId) => {
    if (!requestNumber) return;
    try {
      await navigator.clipboard.writeText(requestNumber);
      setCopiedId(requestId);
      setTimeout(() => setCopiedId(""), 2000);
    } catch {
      alert("تعذر نسخ رقم الطلب");
    }
  };

  // ===== فتح تعديل السعر والملاحظات =====
  const startEditing = (request) => {
    setEditingId(request.id);
    setEditPrice(request.adminPrice || "");
    setEditNotes(request.adminNotes || "");
  };

  // ===== إرسال إشعار واتساب للعميل =====
  const sendWhatsAppToClient = (phone, requestNumber, status, adminPrice, adminNotes) => {
    const statusText = status === "in-progress" ? "جاري التنفيذ" : status === "done" ? "تم التنفيذ ✅" : "جديد";
    let msg = `مرحباً 👋\nبخصوص طلبك رقم: ${requestNumber}\nالحالة الحالية: ${statusText}`;
    if (adminPrice) msg += `\nالسعر: ${adminPrice} جنيه`;
    if (adminNotes) msg += `\nملاحظة: ${adminNotes}`;
    msg += `\n\nشكراً لاختيارك RoadFix 🚗`;
    const url = `https://wa.me/2${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  // ===== تنسيق التاريخ =====
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

  // ===== Auth =====
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) { router.replace("/login"); setAuthLoading(false); return; }
      setAdminUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // ===== Realtime Listener =====
  useEffect(() => {
    if (authLoading || !adminUser) return;
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      if (!firstLoadRef.current && data.length > previousCountRef.current) {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
      }
      previousCountRef.current = data.length;
      firstLoadRef.current = false;
      setRequests(data);
    });
    return () => unsubscribe();
  }, [authLoading, adminUser]);

  // ===== Filters =====
  const filteredRequests = useMemo(() => {
    let result = requests;
    if (filter !== "all") result = result.filter((r) => (r.status || "new") === filter);
    if (serviceFilter !== "all") result = result.filter((r) => (r.service || "").trim() === serviceFilter);
    if (searchTerm.trim()) {
      const s = searchTerm.trim().toLowerCase();
      result = result.filter((r) =>
        (r.name || "").toLowerCase().includes(s) ||
        String(r.phone || "").includes(s) ||
        String(r.requestNumber || "").toLowerCase().includes(s) ||
        (r.service || "").toLowerCase().includes(s)
      );
    }
    return result;
  }, [requests, filter, serviceFilter, searchTerm]);

  const countNew = requests.filter((r) => (r.status || "new") === "new").length;
  const countProgress = requests.filter((r) => r.status === "in-progress").length;
  const countDone = requests.filter((r) => r.status === "done").length;

  const serviceCounts = useMemo(() => {
    const counts = {};
    requests.forEach((r) => { const s = r.service || "غير محدد"; counts[s] = (counts[s] || 0) + 1; });
    return counts;
  }, [requests]);

  const topService = useMemo(() => {
    const entries = Object.entries(serviceCounts);
    if (!entries.length) return "لا يوجد";
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }, [serviceCounts]);

  const getStatusLabel = (status) => {
    if ((status || "new") === "new") return "جديد";
    if (status === "in-progress") return "جاري التنفيذ";
    return "تم ✔";
  };

  const getStatusClass = (status) => {
    if ((status || "new") === "new") return "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30";
    if (status === "in-progress") return "bg-blue-500/15 text-blue-300 border border-blue-500/30";
    return "bg-green-500/15 text-green-300 border border-green-500/30";
  };

  const getServiceBadgeClass = (service) => {
    const map = {
      "بطارية": "bg-yellow-500/10 text-yellow-300 border border-yellow-500/30",
      "كاوتش": "bg-orange-500/10 text-orange-300 border border-orange-500/30",
      "بنزين": "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
      "كهرباء": "bg-blue-500/10 text-blue-300 border border-blue-500/30",
      "ميكانيكا": "bg-red-500/10 text-red-300 border border-red-500/30",
      "صيانة دورية": "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30",
      "عطل": "bg-pink-500/10 text-pink-300 border border-pink-500/30",
    };
    return map[service] || "bg-gray-500/10 text-gray-300 border border-gray-500/30";
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-red-500 font-bold mb-3">RoadFix Admin</p>
          <h1 className="text-2xl font-extrabold mb-3">جارٍ التحقق من الدخول...</h1>
        </div>
      </main>
    );
  }

  if (!adminUser) return null;

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8 md:px-6 md:py-10" dir="rtl">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <p className="text-red-500 font-bold mb-2">RoadFix Dashboard</p>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3">إدارة الطلبات</h1>
            <p className="text-gray-400 text-sm">مسجل الدخول: {adminUser.email}</p>
            <p className="text-xs text-green-400 mt-1">Realtime mode شغال ✅</p>
          </div>
          <button onClick={handleLogout} disabled={logoutLoading}
            className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-2xl font-bold transition disabled:opacity-60 w-fit">
            {logoutLoading ? "جارٍ الخروج..." : "تسجيل الخروج"}
          </button>
        </div>

        {/* Alert */}
        {showAlert && (
          <div className="mb-6 bg-red-600 text-white text-center font-bold py-4 rounded-2xl animate-pulse shadow-lg">
            🚨 طلب جديد وصل الآن!
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
          {[
            { label: "إجمالي الطلبات", value: requests.length, color: "text-white" },
            { label: "طلبات جديدة", value: countNew, color: "text-yellow-400" },
            { label: "جاري التنفيذ", value: countProgress, color: "text-blue-400" },
            { label: "تم التنفيذ", value: countDone, color: "text-green-400" },
            { label: "أكثر خدمة طلبًا", value: topService, color: "text-red-400", small: true },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-3xl p-5 shadow-xl">
              <p className="text-gray-400 text-sm mb-2">{s.label}</p>
              <p className={`font-extrabold ${s.small ? "text-xl" : "text-3xl"} ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <input type="text" placeholder="ابحث بالاسم أو رقم الموبايل أو رقم الطلب..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 text-white outline-none focus:border-red-500" />
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-3 mb-4">
          {[
            { val: "all", label: `الكل (${requests.length})`, active: "bg-red-600 border-red-500" },
            { val: "new", label: `جديد (${countNew})`, active: "bg-yellow-500 text-black border-yellow-400" },
            { val: "in-progress", label: `جاري (${countProgress})`, active: "bg-blue-600 border-blue-500" },
            { val: "done", label: `تم (${countDone})`, active: "bg-green-600 border-green-500" },
          ].map((btn) => (
            <button key={btn.val} onClick={() => setFilter(btn.val)}
              className={`px-5 py-3 rounded-2xl font-bold border transition min-w-[120px] ${filter === btn.val ? btn.active + " text-white shadow-lg" : "bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800"}`}>
              {btn.label}
            </button>
          ))}
        </div>

        {/* Service Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {SERVICE_OPTIONS.map((s) => (
            <button key={s} onClick={() => setServiceFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${serviceFilter === s ? "bg-red-600 text-white border-red-500" : "bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800"}`}>
              {s === "all" ? "كل الخدمات" : s}
            </button>
          ))}
        </div>

        {/* Requests */}
        {filteredRequests.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 text-center">
            <p className="text-gray-400 text-lg">لا توجد طلبات في هذا القسم</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredRequests.map((request) => (
              <div key={request.id}
                className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-5 md:p-6 shadow-2xl">
                <div className="flex flex-col xl:flex-row gap-6">

                  {/* Main Info */}
                  <div className="flex-1 space-y-4">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-800">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h2 className="text-xl md:text-2xl font-bold">{request.name || "طلب جديد"}</h2>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getServiceBadgeClass(request.service)}`}>
                            {request.service || "غير محدد"}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">الموبايل: {request.phone || "غير محدد"}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-red-400 text-sm font-bold">رقم الطلب: {request.requestNumber}</p>
                          <button onClick={() => copyRequestNumber(request.requestNumber, request.id)}
                            className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1 rounded-lg border border-gray-700 transition">
                            {copiedId === request.id ? "تم النسخ ✅" : "نسخ"}
                          </button>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">تاريخ الطلب: {formatDateTime(request.createdAt)}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold w-fit ${getStatusClass(request.status)}`}>
                        {getStatusLabel(request.status)}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      {[
                        { label: "الخدمة", value: request.service },
                        { label: "طريقة الدفع", value: request.paymentMethod },
                        { label: "رقم اللوحة", value: request.plateNumber },
                        { label: "العربية", value: `${request.carBrand || ""} ${request.carModel || ""} ${request.carYear || ""}`.trim() || "غير محدد" },
                      ].map((item) => (
                        <div key={item.label} className="bg-black border border-gray-800 rounded-2xl p-4">
                          <p className="text-gray-400 mb-1">{item.label}</p>
                          <p className="font-bold text-white">{item.value || "غير محدد"}</p>
                        </div>
                      ))}
                    </div>

                    {/* Description */}
                    <div className="bg-black border border-gray-800 rounded-2xl p-4">
                      <p className="text-gray-400 mb-2">وصف العطل</p>
                      <p className="text-white leading-8">{request.description || "لا يوجد وصف"}</p>
                    </div>

                    {/* Location */}
                    {(request.location || request.manualAddress) && (
                      <div className="bg-black border border-gray-800 rounded-2xl p-4">
                        <p className="text-gray-400 mb-2 font-bold">📍 العنوان</p>
                        {request.manualAddress && <p className="text-white mb-3">{request.manualAddress}</p>}
                        {request.location && (
                          <a href={`https://www.google.com/maps?q=${request.location.lat},${request.location.lng}`}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-xl font-bold transition">
                            فتح على الخريطة 🗺️
                          </a>
                        )}
                      </div>
                    )}

                    {/* ===== السعر والملاحظات ===== */}
                    <div className="bg-black border border-gray-800 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-400 font-bold">💰 السعر والملاحظات</p>
                        {editingId !== request.id && (
                          <button onClick={() => startEditing(request)}
                            className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg border border-gray-700 transition">
                            {request.adminPrice || request.adminNotes ? "تعديل" : "+ إضافة"}
                          </button>
                        )}
                      </div>

                      {editingId === request.id ? (
                        <div className="space-y-3">
                          <input type="number" placeholder="السعر بالجنيه"
                            value={editPrice} onChange={(e) => setEditPrice(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white outline-none focus:border-red-500" />
                          <textarea placeholder="ملاحظات للعميل..."
                            value={editNotes} onChange={(e) => setEditNotes(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-white h-20 outline-none focus:border-red-500 resize-none" />
                          <div className="flex gap-3">
                            <button onClick={() => saveNotesAndPrice(request.id)} disabled={savingId === request.id}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold transition disabled:opacity-60">
                              {savingId === request.id ? "جارٍ الحفظ..." : "حفظ ✅"}
                            </button>
                            <button onClick={() => setEditingId("")}
                              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-bold transition">
                              إلغاء
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="bg-gray-900 rounded-xl p-3">
                            <p className="text-gray-400 text-xs mb-1">السعر</p>
                            <p className="font-bold text-green-400">
                              {request.adminPrice ? `${request.adminPrice} جنيه` : "لم يحدد بعد"}
                            </p>
                          </div>
                          <div className="bg-gray-900 rounded-xl p-3">
                            <p className="text-gray-400 text-xs mb-1">ملاحظات</p>
                            <p className="font-bold text-white text-sm">
                              {request.adminNotes || "لا توجد ملاحظات"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="xl:w-[240px] flex flex-col gap-3">
                    <div className="bg-black border border-gray-800 rounded-2xl p-4">
                      <p className="text-gray-400 text-sm mb-3 font-bold">إجراءات سريعة</p>
                      <div className="flex flex-col gap-3">

                        <a href={`tel:${request.phone}`}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl text-center font-bold transition">
                          📞 اتصال
                        </a>

                        <a href={`https://wa.me/2${request.phone}`} target="_blank" rel="noopener noreferrer"
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl text-center font-bold transition">
                          💬 واتساب للعميل
                        </a>

                        <button
                          onClick={() => sendWhatsAppToClient(request.phone, request.requestNumber, request.status, request.adminPrice, request.adminNotes)}
                          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-xl font-bold transition">
                          📤 ابعت تحديث للعميل
                        </button>

                        <button onClick={() => updateStatus(request.id, request.status || "new")}
                          disabled={request.status === "done"}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-60 disabled:cursor-not-allowed transition">
                          {(request.status || "new") === "new" && "▶ ابدأ الشغل"}
                          {request.status === "in-progress" && "✅ إنهاء الطلب"}
                          {request.status === "done" && "تم ✔"}
                        </button>

                        <button onClick={() => handleDelete(request.id, request.requestNumber)}
                          disabled={deletingId === request.id}
                          className="bg-red-700 hover:bg-red-800 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-60 transition">
                          {deletingId === request.id ? "جارٍ الحذف..." : "🗑 حذف الطلب"}
                        </button>

                      </div>
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