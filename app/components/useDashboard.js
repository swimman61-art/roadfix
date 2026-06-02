"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "../firebase";
import {
  collection, query, orderBy, doc, updateDoc, deleteDoc, onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import emailjs from "@emailjs/browser";

export const SERVICE_OPTIONS = [
  "all", "بطارية", "كاوتش", "بنزين", "كهرباء", "ميكانيكا", "صيانة دورية", "عطل",
];

// 🆕 EmailJS keys
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
const EMAILJS_CUSTOMER_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_CUSTOMER_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

export function useDashboard() {
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

  const [editingId, setEditingId] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [savingId, setSavingId] = useState("");

  const [moderatingId, setModeratingId] = useState("");

  const previousCountRef = useRef(0);
  const firstLoadRef = useRef(true);

  // 🆕 دالة إرسال إيميل للعميل
  const sendEmailToCustomer = async (request, statusLabel) => {
    // نتأكد إن المفاتيح موجودة
    if (!EMAILJS_SERVICE_ID || !EMAILJS_CUSTOMER_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      console.warn("EmailJS keys missing, skipping customer notification");
      return;
    }

    // نتأكد إن العميل عنده إيميل مسجّل
    if (!request.userEmail) {
      console.log("No customer email - skipping notification (likely a guest order)");
      return;
    }

    try {
      const templateParams = {
        customer_email: request.userEmail,
        customer_name: request.name || "عميلنا",
        request_number: request.requestNumber || "",
        service: request.service || "غير محدد",
        status: statusLabel,
        price: request.adminPrice ? `${request.adminPrice} جنيه` : "يحدد حسب الموقع",
        notes: request.adminNotes || "لا توجد ملاحظات إضافية",
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_CUSTOMER_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log("✅ Customer notification email sent to:", request.userEmail);
    } catch (error) {
      console.error("❌ Failed to send customer email:", error);
    }
  };

  const updateStatus = async (id, currentStatus) => {
    let newStatus = "new";
    if (currentStatus === "new") newStatus = "in-progress";
    else if (currentStatus === "in-progress") newStatus = "done";
    else newStatus = "done";

    try {
      await updateDoc(doc(db, "requests", id), { status: newStatus });
      setRequests((prev) => prev.map((req) => req.id === id ? { ...req, status: newStatus } : req));

      // 🆕 نبعت إيميل للعميل
      const updatedRequest = requests.find((r) => r.id === id);
      if (updatedRequest) {
        const statusLabel = newStatus === "in-progress" ? "جاري التنفيذ 🔧" : newStatus === "done" ? "تم التنفيذ ✅" : "جديد 🆕";
        sendEmailToCustomer({ ...updatedRequest, status: newStatus }, statusLabel);
      }
    } catch (error) { console.error("Error updating status:", error); }
  };

  const saveNotesAndPrice = async (id) => {
    try {
      setSavingId(id);
      await updateDoc(doc(db, "requests", id), {
        adminPrice: editPrice || null,
        adminNotes: editNotes || null,
      });
      setRequests((prev) =>
        prev.map((req) => req.id === id ? { ...req, adminPrice: editPrice, adminNotes: editNotes } : req)
      );
      setEditingId("");

      // 🆕 نبعت إيميل للعميل بعد التحديث
      const updatedRequest = requests.find((r) => r.id === id);
      if (updatedRequest) {
        const currentStatus = updatedRequest.status || "new";
        const statusLabel = currentStatus === "in-progress" ? "جاري التنفيذ 🔧" : currentStatus === "done" ? "تم التنفيذ ✅" : "جديد 🆕";
        sendEmailToCustomer(
          { ...updatedRequest, adminPrice: editPrice, adminNotes: editNotes },
          statusLabel
        );
      }
    } catch (error) { alert("حصل خطأ أثناء الحفظ"); }
    finally { setSavingId(""); }
  };

  const handleDelete = async (id, requestNumber) => {
    const confirmed = window.confirm(`هل أنت متأكد من حذف الطلب ${requestNumber || ""}؟`);
    if (!confirmed) return;
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "requests", id));
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) { alert("حصلت مشكلة أثناء حذف الطلب"); }
    finally { setDeletingId(""); }
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await signOut(auth);
      router.replace("/login");
    } catch (error) { alert("حصلت مشكلة أثناء تسجيل الخروج"); }
    finally { setLogoutLoading(false); }
  };

  const copyRequestNumber = async (requestNumber, requestId) => {
    if (!requestNumber) return;
    try {
      await navigator.clipboard.writeText(requestNumber);
      setCopiedId(requestId);
      setTimeout(() => setCopiedId(""), 2000);
    } catch { alert("تعذر نسخ رقم الطلب"); }
  };

  const startEditing = (request) => {
    setEditingId(request.id);
    setEditPrice(request.adminPrice || "");
    setEditNotes(request.adminNotes || "");
  };

  const sendWhatsAppToClient = (phone, requestNumber, status, adminPrice, adminNotes) => {
    const statusText = status === "in-progress" ? "جاري التنفيذ" : status === "done" ? "تم التنفيذ ✅" : "جديد";
    let msg = `مرحباً 👋\nبخصوص طلبك رقم: ${requestNumber}\nالحالة الحالية: ${statusText}`;
    if (adminPrice) msg += `\nالسعر: ${adminPrice} جنيه`;
    if (adminNotes) msg += `\nملاحظة: ${adminNotes}`;
    msg += `\n\nشكراً لاختيارك RoadFix 🚗`;
    const url = `https://wa.me/2${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
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
    } catch { return "غير متوفر"; }
  };

  const approveComment = async (id) => {
    try {
      setModeratingId(id);
      await updateDoc(doc(db, "requests", id), {
        commentStatus: "approved",
        commentModeratedAt: new Date(),
      });
      setRequests((prev) => prev.map((req) => req.id === id ? { ...req, commentStatus: "approved" } : req));
    } catch (error) { alert("حصل خطأ أثناء الموافقة"); }
    finally { setModeratingId(""); }
  };

  const rejectComment = async (id) => {
    const confirmed = window.confirm("هل أنت متأكد من رفض هذا التعليق؟");
    if (!confirmed) return;
    try {
      setModeratingId(id);
      await updateDoc(doc(db, "requests", id), {
        commentStatus: "rejected",
        commentModeratedAt: new Date(),
      });
      setRequests((prev) => prev.map((req) => req.id === id ? { ...req, commentStatus: "rejected" } : req));
    } catch (error) { alert("حصل خطأ أثناء الرفض"); }
    finally { setModeratingId(""); }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) { router.replace("/login"); setAuthLoading(false); return; }
      setAdminUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

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

  const countPendingComments = requests.filter(
    (r) => r.customerComment && r.commentStatus === "pending"
  ).length;

  const averageRating = useMemo(() => {
    const ratings = requests
      .filter((r) => r.customerRating > 0 && r.commentStatus === "approved")
      .map((r) => r.customerRating);
    if (ratings.length === 0) return null;
    const sum = ratings.reduce((acc, val) => acc + val, 0);
    return {
      average: (sum / ratings.length).toFixed(1),
      count: ratings.length,
    };
  }, [requests]);

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

  const ordersByPhone = useMemo(() => {
    const map = {};
    requests.forEach((r) => {
      const phone = (r.phone || "").trim();
      if (!phone) return;
      if (!map[phone]) map[phone] = [];
      map[phone].push(r);
    });
    return map;
  }, [requests]);

  const getCustomerOrders = (phone) => {
    const list = ordersByPhone[(phone || "").trim()] || [];
    return [...list].sort((a, b) => {
      const da = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dbb = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dbb - da;
    });
  };

  return {
    requests,
    filter, setFilter,
    serviceFilter, setServiceFilter,
    searchTerm, setSearchTerm,
    showAlert,
    authLoading,
    adminUser,
    logoutLoading,
    copiedId,
    deletingId,
    editingId, setEditingId,
    editPrice, setEditPrice,
    editNotes, setEditNotes,
    savingId,
    moderatingId,
    updateStatus,
    saveNotesAndPrice,
    handleDelete,
    handleLogout,
    copyRequestNumber,
    startEditing,
    sendWhatsAppToClient,
    formatDateTime,
    approveComment,
    rejectComment,
    filteredRequests,
    countNew,
    countProgress,
    countDone,
    countPendingComments,
    averageRating,
    topService,
    getCustomerOrders,
  };
}

export const getStatusLabel = (status) => {
  if ((status || "new") === "new") return "جديد";
  if (status === "in-progress") return "جاري التنفيذ";
  return "تم ✔";
};

export const getStatusClass = (status) => {
  if ((status || "new") === "new") return "bg-yellow-100 text-yellow-800 border border-yellow-300";
  if (status === "in-progress") return "bg-blue-100 text-blue-800 border border-blue-300";
  return "bg-green-100 text-green-800 border border-green-300";
};

export const getServiceBadgeClass = (service) => {
  const map = {
    "بطارية": "bg-yellow-100 text-yellow-800 border border-yellow-300",
    "كاوتش": "bg-orange-100 text-orange-800 border border-orange-300",
    "بنزين": "bg-emerald-100 text-emerald-800 border border-emerald-300",
    "كهرباء": "bg-blue-100 text-blue-800 border border-blue-300",
    "ميكانيكا": "bg-red-100 text-red-800 border border-red-300",
    "صيانة دورية": "bg-cyan-100 text-cyan-800 border border-cyan-300",
    "عطل": "bg-pink-100 text-pink-800 border border-pink-300",
  };
  return map[service] || "bg-gray-100 text-gray-800 border border-gray-300";
};