"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

// الآراء التجريبية الأصلية (هتظهر لو مفيش تعليقات حقيقية كفاية)
const FALLBACK_REVIEWS = [
  { name: "أحمد محمد", area: "مدينة نصر", rating: 5, text: "بطاريتي وقفت في نص الطريق الساعة 10 بالليل. اتصلت بـ RoadFix والفني وصل في 12 دقيقة بالظبط. خدمة ممتازة جداً!", service: "بطارية" },
  { name: "سارة علي", area: "المعادي", rating: 5, text: "كاوتش وقف وأنا رايحة الشغل. الفني جه بسرعة وغيره وأنا في عربيتي. محتاجتش أتعبت خالص. شكراً RoadFix!", service: "كاوتش" },
  { name: "محمود حسن", area: "الزمالك", rating: 5, text: "خدمة احترافية جداً. الفني كان محترم ومتخصص وشرح لي المشكلة بالتفصيل. السعر كان معقول ومحددوهولي قبل ما يبدأ.", service: "ميكانيكا" },
  { name: "نورا سامي", area: "مصر الجديدة", rating: 5, text: "أخيرًا خدمة بتيجي ليك! خلصت من زحمة الورش. الفني وصل بسرعة والسيارة اتصلحت في مكانها. هنصح بيهم لكل حد.", service: "كهرباء" },
];

export default function Reviews() {
  const [realReviews, setRealReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedComments = async () => {
      try {
        // نجيب الطلبات اللي عليها تعليقات معتمدة
        const q = query(
          collection(db, "requests"),
          where("commentStatus", "==", "approved"),
          limit(8)
        );
        const snapshot = await getDocs(q);
        const comments = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.commentAuthor || data.name || "عميل",
              area: data.manualAddress
                ? data.manualAddress.split("-")[0]?.trim() || "عميل RoadFix"
                : "عميل RoadFix",
              rating: 5,
              text: data.customerComment,
              service: data.service || "خدمة RoadFix",
            };
          })
          .filter((c) => c.text); // نتأكد إن فيه نص تعليق
        setRealReviews(comments);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedComments();
  }, []);

  // نخلط: التعليقات الحقيقية الأول، وبعدها التجريبية لو محتاجين نكمل لـ 4 على الأقل
  const reviewsToShow = (() => {
    if (realReviews.length >= 4) return realReviews.slice(0, 8);
    // نكمل بالتجريبية
    const needed = 4 - realReviews.length;
    return [...realReviews, ...FALLBACK_REVIEWS.slice(0, needed)];
  })();

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">آراء العملاء</span>
          <h2 className="text-4xl md:text-5xl font-black mt-4 mb-4">بيقولوا إيه عننا؟</h2>
          <p className="text-gray-500 text-lg">عملاء حقيقيين، تجارب حقيقية</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviewsToShow.map((r, idx) => (
            <div key={r.id || idx} className="bg-gray-50 border border-gray-100 rounded-3xl p-6 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(r.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-5">"{r.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center font-black text-red-500">
                  {r.name[0]}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.area} · {r.service}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}