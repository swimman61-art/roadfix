"use client";

import { useState } from "react";
import {
  getStatusLabel, getStatusClass, getServiceBadgeClass,
} from "./useDashboard";

export default function RequestCard({
  request, copiedId, deletingId, editingId,
  editPrice, setEditPrice, editNotes, setEditNotes,
  savingId, moderatingId,
  copyRequestNumber, startEditing, saveNotesAndPrice, setEditingId,
  updateStatus, handleDelete, sendWhatsAppToClient, formatDateTime,
  getCustomerOrders, approveComment, rejectComment,
}) {
  const [showHistory, setShowHistory] = useState(false);

  const customerOrders = getCustomerOrders ? getCustomerOrders(request.phone) : [];
  const totalOrders = customerOrders.length;
  const isReturning = totalOrders > 1;

  const hasComment = !!request.customerComment;
  const commentStatus = request.commentStatus || "pending";
  const rating = request.customerRating || 0;

  const getCommentBadge = (status) => {
    if (status === "approved") return { text: "✅ منشور", className: "bg-green-100 text-green-800 border-green-300" };
    if (status === "rejected") return { text: "❌ مرفوض", className: "bg-red-100 text-red-800 border-red-300" };
    return { text: "⏳ بانتظار الموافقة", className: "bg-yellow-100 text-yellow-800 border-yellow-300" };
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-lg hover:border-gray-300 transition">
      <div className="flex flex-col xl:flex-row gap-6">

        <div className="flex-1 space-y-4">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h2 className="text-xl md:text-2xl font-black">{request.name || "طلب جديد"}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getServiceBadgeClass(request.service)}`}>
                  {request.service || "غير محدد"}
                </span>

                {isReturning ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
                    ⭐ عميل متكرر · {totalOrders} طلبات
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-300">
                    عميل جديد
                  </span>
                )}

                {hasComment && commentStatus === "pending" && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300 animate-pulse">
                    🔔 تعليق جديد!
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm">الموبايل: {request.phone || "غير محدد"}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-red-500 text-sm font-bold">رقم الطلب: {request.requestNumber}</p>
                <button onClick={() => copyRequestNumber(request.requestNumber, request.id)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-lg border border-gray-200 transition">
                  {copiedId === request.id ? "تم النسخ ✅" : "نسخ"}
                </button>

                {isReturning && (
                  <button onClick={() => setShowHistory(true)}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-lg border border-purple-200 transition font-bold">
                    📋 شوف طلباته السابقة
                  </button>
                )}
              </div>
              <p className="text-gray-400 text-sm mt-1">تاريخ الطلب: {formatDateTime(request.createdAt)}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold w-fit ${getStatusClass(request.status)}`}>
              {getStatusLabel(request.status)}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-3 text-sm">
            {[
              { label: "الخدمة", value: request.service },
              { label: "طريقة الدفع", value: request.paymentMethod },
              { label: "رقم اللوحة", value: request.plateNumber },
              { label: "العربية", value: `${request.carBrand || ""} ${request.carModel || ""} ${request.carYear || ""}`.trim() || "غير محدد" },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-gray-400 mb-1">{item.label}</p>
                <p className="font-bold text-gray-900">{item.value || "غير محدد"}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <p className="text-gray-400 mb-2">وصف العطل</p>
            <p className="text-gray-900 leading-8">{request.description || "لا يوجد وصف"}</p>
          </div>

          {(request.location || request.manualAddress) && (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-gray-500 mb-2 font-bold">📍 العنوان</p>
              {request.manualAddress && <p className="text-gray-900 mb-3">{request.manualAddress}</p>}
              {request.location && (
                <a href={`https://www.google.com/maps?q=${request.location.lat},${request.location.lng}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-block bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-bold transition">
                  فتح على الخريطة 🗺️
                </a>
              )}
            </div>
          )}

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-amber-800 font-bold">💰 السعر والملاحظات</p>
              {editingId !== request.id && (
                <button onClick={() => startEditing(request)}
                  className="bg-white hover:bg-amber-100 text-amber-700 text-xs px-3 py-1.5 rounded-lg border border-amber-200 transition font-bold">
                  {request.adminPrice || request.adminNotes ? "تعديل" : "+ إضافة"}
                </button>
              )}
            </div>

            {editingId === request.id ? (
              <div className="space-y-3">
                <input type="number" placeholder="السعر بالجنيه"
                  value={editPrice} onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full bg-white border border-slate-600 rounded-xl p-3 text-gray-900 outline-none focus:border-red-500" />
                <textarea placeholder="ملاحظات للعميل..."
                  value={editNotes} onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-white border border-slate-600 rounded-xl p-3 text-gray-900 h-20 outline-none focus:border-red-500 resize-none" />
                <div className="flex gap-3">
                  <button onClick={() => saveNotesAndPrice(request.id)} disabled={savingId === request.id}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold transition disabled:opacity-60">
                    {savingId === request.id ? "جارٍ الحفظ..." : "حفظ ✅"}
                  </button>
                  <button onClick={() => setEditingId("")}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold transition">
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-white border border-amber-100 rounded-xl p-3">
                  <p className="text-gray-400 text-xs mb-1">السعر</p>
                  <p className="font-black text-green-600">
                    {request.adminPrice ? `${request.adminPrice} جنيه` : "لم يحدد بعد"}
                  </p>
                </div>
                <div className="bg-white border border-amber-100 rounded-xl p-3">
                  <p className="text-gray-400 text-xs mb-1">ملاحظات</p>
                  <p className="font-bold text-gray-900 text-sm">
                    {request.adminNotes || "لا توجد ملاحظات"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* تعليق العميل + التقييم */}
          {hasComment && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-blue-800 font-bold flex items-center gap-2">
                  💬 تعليق العميل
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getCommentBadge(commentStatus).className}`}>
                    {getCommentBadge(commentStatus).text}
                  </span>
                </p>
              </div>

              <div className="bg-white border border-blue-100 rounded-xl p-4 mb-3">
                {/* 🆕 التقييم بالنجوم */}
                {rating > 0 && (
                  <div className="flex items-center gap-1 mb-3 pb-3 border-b border-blue-50">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={`text-lg ${s <= rating ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                    ))}
                    <span className="text-gray-600 text-sm font-bold mr-2">({rating}/5)</span>
                  </div>
                )}

                <p className="text-gray-900 leading-8 mb-2">"{request.customerComment}"</p>
                <p className="text-gray-400 text-xs">
                  بواسطة: {request.commentAuthor || request.name || "عميل"}
                  {request.commentDate && ` · ${formatDateTime(request.commentDate)}`}
                </p>
              </div>

              {commentStatus === "pending" && (
                <div className="flex gap-3">
                  <button onClick={() => approveComment(request.id)} disabled={moderatingId === request.id}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold transition disabled:opacity-60 text-sm">
                    {moderatingId === request.id ? "جارٍ..." : "✅ موافقة ونشر"}
                  </button>
                  <button onClick={() => rejectComment(request.id)} disabled={moderatingId === request.id}
                    className="flex-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl font-bold transition disabled:opacity-60 text-sm">
                    ❌ رفض
                  </button>
                </div>
              )}

              {commentStatus === "approved" && (
                <button onClick={() => rejectComment(request.id)} disabled={moderatingId === request.id}
                  className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl font-bold transition disabled:opacity-60 text-sm">
                  {moderatingId === request.id ? "جارٍ..." : "إلغاء النشر"}
                </button>
              )}

              {commentStatus === "rejected" && (
                <button onClick={() => approveComment(request.id)} disabled={moderatingId === request.id}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-bold transition disabled:opacity-60 text-sm">
                  {moderatingId === request.id ? "جارٍ..." : "إعادة الموافقة"}
                </button>
              )}
            </div>
          )}

        </div>

        <div className="xl:w-[240px] flex flex-col gap-3">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <p className="text-gray-500 text-sm mb-3 font-bold">إجراءات سريعة</p>
            <div className="flex flex-col gap-3">

              <a href={`tel:${request.phone}`}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-xl text-center font-bold transition">
                📞 اتصال
              </a>

              <a href={`https://wa.me/2${request.phone}`} target="_blank" rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl text-center font-bold transition">
                💬 واتساب للعميل
              </a>

              <button
                onClick={() => sendWhatsAppToClient(request.phone, request.requestNumber, request.status, request.adminPrice, request.adminNotes)}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-3 rounded-xl font-bold transition">
                📤 ابعت تحديث للعميل
              </button>

              <button onClick={() => updateStatus(request.id, request.status || "new")}
                disabled={request.status === "done"}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition">
                {(request.status || "new") === "new" && "▶ ابدأ الشغل"}
                {request.status === "in-progress" && "✅ إنهاء الطلب"}
                {request.status === "done" && "تم ✔"}
              </button>

              <button onClick={() => handleDelete(request.id, request.requestNumber)}
                disabled={deletingId === request.id}
                className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-xl font-bold disabled:opacity-60 transition">
                {deletingId === request.id ? "جارٍ الحذف..." : "🗑 حذف الطلب"}
              </button>

            </div>
          </div>
        </div>

      </div>

      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowHistory(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}>

            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <div>
                <h3 className="text-xl font-black">طلبات {request.name || "العميل"}</h3>
                <p className="text-gray-400 text-sm">{request.phone} · {totalOrders} طلبات</p>
              </div>
              <button onClick={() => setShowHistory(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-9 h-9 rounded-full font-bold transition">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-3">
              {customerOrders.map((o) => (
                <div key={o.id}
                  className={`border rounded-2xl p-4 ${o.id === request.id ? "border-purple-300 bg-purple-50" : "border-gray-200 bg-gray-50"}`}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black">{o.service || "خدمة"}</span>
                      {o.id === request.id && (
                        <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full font-bold">الطلب الحالي</span>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(o.status)}`}>
                      {getStatusLabel(o.status)}
                    </span>
                  </div>
                  <p className="text-red-500 text-xs font-bold mb-1">رقم الطلب: {o.requestNumber || "غير متوفر"}</p>
                  <p className="text-gray-500 text-xs mb-2">{formatDateTime(o.createdAt)}</p>
                  <p className="text-gray-700 text-sm">{o.description || "لا يوجد وصف"}</p>
                  {o.adminPrice && (
                    <p className="text-green-600 text-sm font-bold mt-2">السعر: {o.adminPrice} جنيه</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}