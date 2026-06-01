"use client";

import { useMemo } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];

export default function DashboardCharts({ requests }) {
  // 1. الطلبات حسب الخدمة
  const serviceData = useMemo(() => {
    const counts = {};
    requests.forEach((r) => {
      const s = r.service || "غير محدد";
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [requests]);

  // 2. الطلبات في آخر 7 أيام
  const weekData = useMemo(() => {
    const today = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const dayName = new Intl.DateTimeFormat("ar-EG", { weekday: "short" }).format(date);
      const count = requests.filter((r) => {
        const rDate = r.createdAt?.toDate ? r.createdAt.toDate() : new Date(r.createdAt);
        return rDate >= date && rDate < nextDate;
      }).length;

      days.push({ day: dayName, count });
    }
    return days;
  }, [requests]);

  // 3. إحصائيات التقييم
  const ratingStats = useMemo(() => {
    const ratings = requests
      .filter((r) => r.customerRating > 0 && r.commentStatus === "approved")
      .map((r) => r.customerRating);

    if (ratings.length === 0) return null;

    const sum = ratings.reduce((acc, val) => acc + val, 0);
    const average = (sum / ratings.length).toFixed(1);

    // توزيع التقييمات
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: ratings.filter((r) => r === star).length,
    }));

    return { average, count: ratings.length, distribution };
  }, [requests]);

  // 4. إحصائيات إضافية
  const totalOrders = requests.length;
  const doneOrders = requests.filter((r) => r.status === "done").length;
  const completionRate = totalOrders > 0 ? Math.round((doneOrders / totalOrders) * 100) : 0;

  // مفيش طلبات لسه
  if (totalOrders === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-3xl p-10 text-center mb-8 shadow-sm">
        <p className="text-5xl mb-4">📊</p>
        <p className="text-gray-500 text-lg font-bold">لسه مفيش طلبات لعرض الإحصائيات</p>
        <p className="text-gray-400 text-sm mt-2">الرسوم البيانية هتظهر هنا لما تيجي طلبات</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">📊</span>
        <h2 className="text-2xl font-black text-gray-900">إحصائيات وتحليلات</h2>
      </div>

      {/* الصف الأول: 3 كروت إحصائية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* معدل الإكمال */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-sm font-bold">معدل إكمال الطلبات</p>
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-4xl font-black text-green-600 mb-2">{completionRate}%</p>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">{doneOrders} من {totalOrders} طلب</p>
        </div>

        {/* متوسط التقييم */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-sm font-bold">متوسط التقييم</p>
            <span className="text-2xl">⭐</span>
          </div>
          {ratingStats ? (
            <>
              <p className="text-4xl font-black text-yellow-500 mb-2">{ratingStats.average}</p>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={`text-lg ${s <= Math.round(ratingStats.average) ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                ))}
              </div>
              <p className="text-xs text-gray-400">من {ratingStats.count} تقييم</p>
            </>
          ) : (
            <>
              <p className="text-4xl font-black text-gray-300 mb-2">—</p>
              <p className="text-xs text-gray-400 mt-2">لسه مفيش تقييمات معتمدة</p>
            </>
          )}
        </div>

        {/* إجمالي العملاء */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-sm font-bold">عملاء مختلفين</p>
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-4xl font-black text-blue-600 mb-2">
            {new Set(requests.map((r) => r.phone).filter(Boolean)).size}
          </p>
          <p className="text-xs text-gray-400 mt-2">عميل مختلف</p>
        </div>
      </div>

      {/* الصف التاني: الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pie Chart - الطلبات حسب الخدمة */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🔧</span>
            <h3 className="text-lg font-black text-gray-900">الطلبات حسب الخدمة</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - الطلبات في الأسبوع */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📅</span>
            <h3 className="text-lg font-black text-gray-900">طلبات آخر 7 أيام</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px' }}
                labelStyle={{ color: '#111827', fontWeight: 'bold' }}
              />
              <Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* توزيع التقييمات (لو فيه تقييمات) */}
      {ratingStats && ratingStats.count > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mt-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">⭐</span>
            <h3 className="text-lg font-black text-gray-900">توزيع التقييمات</h3>
          </div>
          <div className="space-y-3">
            {ratingStats.distribution.map(({ star, count }) => {
              const percentage = ratingStats.count > 0 ? (count / ratingStats.count) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm font-bold text-gray-700">{star}</span>
                    <span className="text-yellow-400">★</span>
                  </div>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-700 w-12 text-left">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}