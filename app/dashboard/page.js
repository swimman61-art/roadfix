"use client";

import { useDashboard, SERVICE_OPTIONS } from "../components/useDashboard";
import RequestCard from "../components/RequestCard";

export default function DashboardPage() {
  const d = useDashboard();

  if (d.authLoading) {
    return (
      <main className="min-h-screen bg-slate-100 text-gray-900 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">RoadFix Admin</span>
          <h1 className="text-2xl font-black mt-4 mb-3">جارٍ التحقق من الدخول...</h1>
          <p className="text-gray-500">من فضلك انتظر لحظة</p>
        </div>
      </main>
    );
  }

  if (!d.adminUser) return null;

  return (
    <main className="min-h-screen bg-slate-100 text-gray-900" dir="rtl">

      {/* ===== Header Bar غامق ===== */}
      <div className="bg-gradient-to-l from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <span className="bg-red-500/20 text-red-300 font-bold text-sm px-4 py-2 rounded-full border border-red-500/30">RoadFix Dashboard</span>
              <h1 className="text-3xl md:text-5xl font-black mt-4 mb-2">إدارة الطلبات</h1>
              <p className="text-gray-400 text-sm">مسجل الدخول: {d.adminUser.email}</p>
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
                التحديث المباشر شغال
              </p>
            </div>
            <button onClick={d.handleLogout} disabled={d.logoutLoading}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-3 rounded-2xl font-bold transition disabled:opacity-60 w-fit backdrop-blur">
              {d.logoutLoading ? "جارٍ الخروج..." : "تسجيل الخروج"}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 mt-8">
            {[
              { label: "إجمالي الطلبات", value: d.requests.length, color: "text-white", icon: "📋" },
              { label: "طلبات جديدة", value: d.countNew, color: "text-yellow-300", icon: "🆕" },
              { label: "جاري التنفيذ", value: d.countProgress, color: "text-blue-300", icon: "🔧" },
              { label: "تم التنفيذ", value: d.countDone, color: "text-green-300", icon: "✅" },
              { label: "أكثر خدمة طلبًا", value: d.topService, color: "text-red-300", icon: "⭐", small: true },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">{s.label}</p>
                  <span className="text-lg">{s.icon}</span>
                </div>
                <p className={`font-black ${s.small ? "text-lg" : "text-3xl"} ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Body ===== */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* Alert */}
        {d.showAlert && (
          <div className="mb-6 bg-red-500 text-white text-center font-bold py-4 rounded-2xl animate-pulse shadow-lg shadow-red-500/20">
            🚨 طلب جديد وصل الآن!
          </div>
        )}

        {/* 🆕 تنبيه التعليقات المعلّقة */}
        {d.countPendingComments > 0 && (
          <div className="mb-6 bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <span className="text-2xl">🔔</span>
            <div className="flex-1">
              <p className="font-black text-orange-900">
                {d.countPendingComments} تعليق بانتظار الموافقة
              </p>
              <p className="text-orange-700 text-sm">دوّر في الطلبات على الكروت اللي عليها شارة "تعليق جديد!" برتقالية</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <input type="text" placeholder="🔍 ابحث بالاسم أو رقم الموبايل أو رقم الطلب..."
            value={d.searchTerm} onChange={(e) => d.setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-600 rounded-2xl p-4 text-gray-900 outline-none focus:border-red-500 shadow-sm transition placeholder:text-gray-400" />
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-3 mb-4">
          {[
            { val: "all", label: `الكل (${d.requests.length})`, active: "bg-slate-900 border-slate-900" },
            { val: "new", label: `جديد (${d.countNew})`, active: "bg-yellow-500 border-yellow-500" },
            { val: "in-progress", label: `جاري (${d.countProgress})`, active: "bg-blue-600 border-blue-600" },
            { val: "done", label: `تم (${d.countDone})`, active: "bg-green-600 border-green-600" },
          ].map((btn) => (
            <button key={btn.val} onClick={() => d.setFilter(btn.val)}
              className={`px-5 py-3 rounded-2xl font-bold border transition min-w-[120px] ${d.filter === btn.val ? btn.active + " text-white shadow-md" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
              {btn.label}
            </button>
          ))}
        </div>

        {/* Service Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {SERVICE_OPTIONS.map((s) => (
            <button key={s} onClick={() => d.setServiceFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition ${d.serviceFilter === s ? "bg-red-500 text-white border-red-500 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
              {s === "all" ? "كل الخدمات" : s}
            </button>
          ))}
        </div>

        {/* Requests */}
        {d.filteredRequests.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-400 text-lg">لا توجد طلبات في هذا القسم</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {d.filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                copiedId={d.copiedId}
                deletingId={d.deletingId}
                editingId={d.editingId}
                editPrice={d.editPrice}
                setEditPrice={d.setEditPrice}
                editNotes={d.editNotes}
                setEditNotes={d.setEditNotes}
                savingId={d.savingId}
                moderatingId={d.moderatingId}
                copyRequestNumber={d.copyRequestNumber}
                startEditing={d.startEditing}
                saveNotesAndPrice={d.saveNotesAndPrice}
                setEditingId={d.setEditingId}
                updateStatus={d.updateStatus}
                handleDelete={d.handleDelete}
                sendWhatsAppToClient={d.sendWhatsAppToClient}
                formatDateTime={d.formatDateTime}
                getCustomerOrders={d.getCustomerOrders}
                approveComment={d.approveComment}
                rejectComment={d.rejectComment}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}