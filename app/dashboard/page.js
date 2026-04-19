"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

const SERVICE_OPTIONS = [
  "all",
  "بطارية",
  "كاوتش",
  "بنزين",
  "كهرباء",
  "ميكانيكا",
  "صيانة دورية",
  "عطل",
];

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
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id, requestNumber) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف الطلب ${requestNumber || ""}؟`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "requests", id));
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("حصلت مشكلة أثناء حذف الطلب");
    } finally {
      setDeletingId("");
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("حصلت مشكلة أثناء تسجيل الخروج");
    } finally {
      setLogoutLoading(false);
    }
  };

  const copyRequestNumber = async (requestNumber, requestId) => {
    if (!requestNumber) return;

    try {
      await navigator.clipboard.writeText(requestNumber);
      setCopiedId(requestId);

      setTimeout(() => {
        setCopiedId("");
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      alert("تعذر نسخ رقم الطلب");
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
        setAdminUser(null);
        setAuthLoading(false);
        return;
      }

      setAdminUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (authLoading || !adminUser) return;

    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);

    return () => clearInterval(interval);
  }, [authLoading, adminUser]);

  const filteredRequests = useMemo(() => {
    let result = requests;

    if (filter !== "all") {
      result = result.filter((request) => {
        const status = request.status || "new";
        return status === filter;
      });
    }

    if (serviceFilter !== "all") {
      result = result.filter(
        (request) => (request.service || "").trim() === serviceFilter
      );
    }

    if (searchTerm.trim()) {
      const search = searchTerm.trim().toLowerCase();

      result = result.filter((request) => {
        const name = request.name?.toLowerCase() || "";
        const phone = String(request.phone || "").toLowerCase();
        const requestNumber = String(request.requestNumber || "").toLowerCase();
        const service = String(request.service || "").toLowerCase();

        return (
          name.includes(search) ||
          phone.includes(search) ||
          requestNumber.includes(search) ||
          service.includes(search)
        );
      });
    }

    return result;
  }, [requests, filter, serviceFilter, searchTerm]);

  const countNew = requests.filter(
    (r) => (r.status || "new") === "new"
  ).length;
  const countProgress = requests.filter(
    (r) => r.status === "in-progress"
  ).length;
  const countDone = requests.filter(
    (r) => r.status === "done"
  ).length;

  const serviceCounts = useMemo(() => {
    const counts = {};

    requests.forEach((r) => {
      const service = r.service || "غير محدد";
      counts[service] = (counts[service] || 0) + 1;
    });

    return counts;
  }, [requests]);

  const topService = useMemo(() => {
    const entries = Object.entries(serviceCounts);
    if (!entries.length) return "لا يوجد";
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  }, [serviceCounts]);

  const latestRequestTime = useMemo(() => {
    if (!requests.length) return "لا يوجد";
    return formatDateTime(requests[0]?.createdAt);
  }, [requests]);

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

  const getServiceBadgeClass = (service) => {
    switch (service) {
      case "بطارية":
        return "bg-yellow-500/10 text-yellow-300 border border-yellow-500/30";
      case "كاوتش":
        return "bg-orange-500/10 text-orange-300 border border-orange-500/30";
      case "بنزين":
        return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30";
      case "كهرباء":
        return "bg-blue-500/10 text-blue-300 border border-blue-500/30";
      case "ميكانيكا":
        return "bg-red-500/10 text-red-300 border border-red-500/30";
      case "صيانة دورية":
        return "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30";
      case "عطل":
        return "bg-pink-500/10 text-pink-300 border border-pink-500/30";
      default:
        return "bg-gray-500/10 text-gray-300 border border-gray-500/30";
    }
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

  if (authLoading) {
    return (
      <main
        className="min-h-screen bg-black text-white flex items-center justify-center px-4"
        dir="rtl"
      >
        <div className="text-center">
          <p className="text-red-500 font-bold mb-3">RoadFix Admin</p>
          <h1 className="text-2xl font-extrabold mb-3">جارٍ التحقق من الدخول...</h1>
          <p className="text-gray-400">من فضلك انتظر لحظة</p>
        </div>
      </main>
    );
  }

  if (!adminUser) return null;

  return (
    <main
      className="min-h-screen bg-black text-white px-4 py-8 md:px-6 md:py-10"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="text-center md:text-right">
            <p className="text-red-500 font-bold mb-3">RoadFix Dashboard</p>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
              إدارة الطلبات
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-8">
              راقب الطلبات الجديدة، تابع التنفيذ، وغيّر الحالة بسهولة من مكان واحد.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              مسجل الدخول: {adminUser.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-2xl font-bold transition disabled:opacity-60"
          >
            {logoutLoading ? "جارٍ تسجيل الخروج..." : "تسجيل الخروج"}
          </button>
        </div>

        {showAlert && (
          <div className="mb-6 bg-red-600 text-white text-center font-bold py-4 rounded-2xl animate-pulse shadow-lg">
            طلب جديد وصل الآن 🚨
          </div>
        )}

        <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
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

          <div className="bg-gray-900 border border-red-500/20 rounded-3xl p-5 shadow-xl">
            <p className="text-gray-400 text-sm mb-2">أكثر خدمة طلبًا</p>
            <p className="text-xl font-extrabold text-red-400">{topService}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-black border border-gray-800 rounded-3xl p-5">
            <p className="text-gray-400 text-sm mb-2">آخر طلب وصل</p>
            <p className="text-lg font-bold text-white">{latestRequestTime}</p>
          </div>

          <div className="bg-black border border-gray-800 rounded-3xl p-5">
            <p className="text-gray-400 text-sm mb-3">إحصائيات الخدمات</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(serviceCounts).length === 0 ? (
                <span className="text-gray-500 text-sm">لا توجد بيانات بعد</span>
              ) : (
                Object.entries(serviceCounts).map(([service, count]) => (
                  <span
                    key={service}
                    className="px-3 py-2 rounded-xl text-sm font-bold bg-gray-900 border border-gray-700 text-white"
                  >
                    {service}: {count}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="ابحث بالاسم أو رقم الموبايل أو رقم الطلب أو الخدمة"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 text-white outline-none focus:border-red-500"
          />
        </div>

        <div className="flex flex-wrap gap-3 mb-5">
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

        <div className="flex flex-wrap gap-3 mb-8">
          {SERVICE_OPTIONS.map((service) => (
            <button
              key={service}
              onClick={() => setServiceFilter(service)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${
                serviceFilter === service
                  ? "bg-red-600 text-white border-red-500 shadow-lg"
                  : "bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800"
              }`}
            >
              {service === "all" ? "كل الخدمات" : service}
            </button>
          ))}
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
                className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-5 md:p-6 shadow-2xl"
              >
                <div className="flex flex-col xl:flex-row gap-6">
                  <div className="flex-1 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-800">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h2 className="text-xl md:text-2xl font-bold">
                            {request.name || "طلب جديد"}
                          </h2>

                          <span
                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${getServiceBadgeClass(
                              request.service
                            )}`}
                          >
                            {request.service || "غير محدد"}
                          </span>
                        </div>

                        <p className="text-gray-400 text-sm mt-1">
                          رقم الموبايل: {request.phone || "غير محدد"}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <p className="text-red-400 text-sm font-bold">
                            رقم الطلب: {request.requestNumber || "غير موجود"}
                          </p>

                          {request.requestNumber && (
                            <button
                              type="button"
                              onClick={() =>
                                copyRequestNumber(request.requestNumber, request.id)
                              }
                              className="bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-1.5 rounded-lg border border-gray-700 transition"
                            >
                              {copiedId === request.id ? "تم النسخ ✅" : "نسخ الرقم"}
                            </button>
                          )}
                        </div>

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
                          {request.price ? `${request.price} جنيه` : "يحدد حسب الموقع"}
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
                      <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-4">
                        <p className="text-gray-400 mb-3 font-bold">📍 العنوان</p>

                        {request.manualAddress && (
                          <p className="text-white leading-7 mb-3">
                            {request.manualAddress}
                          </p>
                        )}

                        {request.location && (
                          <a
                            href={`https://www.google.com/maps?q=${request.location.lat},${request.location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-xl font-bold transition"
                          >
                            فتح على الخريطة
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

                        <button
                          onClick={() =>
                            handleDelete(request.id, request.requestNumber)
                          }
                          disabled={deletingId === request.id}
                          className="bg-red-700 hover:bg-red-800 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-60 disabled:cursor-not-allowed transition"
                        >
                          {deletingId === request.id ? "جارٍ الحذف..." : "حذف الطلب"}
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