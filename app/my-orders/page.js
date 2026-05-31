"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";

const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();
const isAdminEmail = (email) => (email || "").toLowerCase().trim() === ADMIN_EMAIL;

export default function MyOrdersPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [customerData, setCustomerData] = useState(null);

  const [requestNumber, setRequestNumber] = useState("");
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [commentingId, setCommentingId] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(0); // 🆕 التقييم
  const [hoverRating, setHoverRating] = useState(0); // 🆕 hover effect
  const [savingComment, setSavingComment] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !isAdminEmail(user.email)) {
        setCurrentUser(user);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setCustomerData(data);
            await fetchCustomerOrders(user.uid, data.phone);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setCurrentUser(null);
        setCustomerData(null);
      }
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const isRequestNumber = (input) => /^RF-\d+$/i.test(input.trim());

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

  const getCommentStatusBadge = (commentStatus) => {
    if (commentStatus === "approved") return { text: "✅ تم النشر", className: "bg-green-100 text-green-800 border border-green-300" };
    if (commentStatus === "rejected") return { text: "❌ مرفوض", className: "bg-red-100 text-red-800 border border-red-300" };
    return { text: "⏳ بانتظار الموافقة", className: "bg-yellow-100 text-yellow-800 border border-yellow-300" };
  };

  const mergeOrders = (list1, list2) => {
    const merged = [...list1];
    list2.forEach((order) => {
      if (!merged.some((o) => o.id === order.id)) {
        merged.push(order);
      }
    });
    merged.sort((a, b) => {
      const da = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dbb = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dbb - da;
    });
    return merged;
  };

  const fetchCustomerOrders = async (userId, customerPhone) => {
    setLoading(true);
    setOrders([]);
    try {
      let byUserId = [];
      try {
        const q1 = query(collection(db, "requests"), where("userId", "==", userId));
        const snap1 = await getDocs(q1);
        byUserId = snap1.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch (e) { console.warn("userId query failed:", e); }

      let byPhone = [];
      if (customerPhone) {
        try {
          const q2 = query(collection(db, "requests"), where("phone", "==", customerPhone.trim()));
          const snap2 = await getDocs(q2);
          byPhone = snap2.docs.map((d) => ({ id: d.id, ...d.data() }));
        } catch (e) { console.warn("phone query failed:", e); }
      }

      setOrders(mergeOrders(byUserId, byPhone));
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMessage("تعذر الوصول لطلباتك حاليًا. حاول مرة أخرى بعد قليل.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSearch = async () => {
    setErrorMessage("");
    const input = requestNumber.trim();
    if (!input) { setErrorMessage("من فضلك اكتب رقم الطلب."); return; }
    if (!isRequestNumber(input)) {
      setErrorMessage("صيغة رقم الطلب غير صحيحة. الصيغة المظبوطة: RF-1234567890");
      return;
    }
    setSearched(true);
    setLoading(true);
    setOrders([]);
    try {
      const q = query(collection(db, "requests"), where("requestNumber", "==", input));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    } catch (error) {
      console.error("Guest search error:", error);
      setErrorMessage("تعذر الوصول للطلب حاليًا. حاول مرة أخرى بعد قليل.");
    } finally {
      setLoading(false);
    }
  };

  const startCommenting = (orderId, existingComment, existingRating) => {
    setCommentingId(orderId);
    setCommentText(existingComment || "");
    setCommentRating(existingRating || 0); // 🆕
    setHoverRating(0);
  };

  const saveComment = async (orderId) => {
    const text = commentText.trim();
    if (!text) { alert("اكتب تعليقك أولاً"); return; }
    if (text.length < 10) { alert("التعليق قصير جداً، اكتب على الأقل 10 حروف"); return; }

    try {
      setSavingComment(true);
      // 🆕 نحفظ التعليق + التقييم (لو موجود)
      const updateData = {
        customerComment: text,
        commentStatus: "pending",
        commentDate: new Date(),
        commentAuthor: customerData?.name || "عميل",
      };
      if (commentRating > 0) {
        updateData.customerRating = commentRating;
      }

      await updateDoc(doc(db, "requests", orderId), updateData);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                customerComment: text,
                commentStatus: "pending",
                commentDate: new Date(),
                commentAuthor: customerData?.name || "عميل",
                customerRating: commentRating > 0 ? commentRating : o.customerRating,
              }
            : o
        )
      );

      setCommentingId("");
      setCommentText("");
      setCommentRating(0);
      setHoverRating(0);
      alert("تم إرسال تعليقك ✅ هيظهر بعد موافقة الإدارة");
    } catch (error) {
      console.error("Save comment error:", error);
      alert("حصل خطأ أثناء حفظ التعليق. حاول مرة أخرى.");
    } finally {
      setSavingComment(false);
    }
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">RoadFix</span>
          <h1 className="text-2xl font-black mt-4 mb-3">جارٍ التحميل...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 py-12 md:px-6" dir="rtl">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">RoadFix</span>
          <h1 className="text-3xl md:text-5xl font-black mt-4 mb-4">طلباتي</h1>
          {currentUser && customerData ? (
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-8">
              أهلاً <span className="font-bold text-gray-900">{customerData.name}</span> 👋
              <br />
              ده تاريخ كل طلباتك
            </p>
          ) : (
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-8">
              اكتب <span className="font-bold text-gray-900">رقم الطلب</span> عشان تتابع حالته.
            </p>
          )}
        </div>

        {!currentUser && (
          <>
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
              <label className="block mb-3 text-sm text-gray-600 font-bold">رقم الطلب</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="مثال: RF-1742956123456"
                  value={requestNumber}
                  onChange={(e) => setRequestNumber(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleGuestSearch(); }}
                  className="flex-1 p-4 rounded-2xl bg-white border border-slate-400 text-gray-900 outline-none focus:border-red-500 transition placeholder:text-gray-400"
                />
                <button onClick={handleGuestSearch} disabled={loading}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black transition disabled:opacity-60">
                  {loading ? "جارٍ البحث..." : "بحث"}
                </button>
              </div>
              {errorMessage && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="text-red-700 font-bold">{errorMessage}</p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-3xl p-6 md:p-7 shadow-sm mb-8">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🤔</span>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-amber-900 mb-2">نسيت رقم الطلب؟</h3>
                  <p className="text-amber-800 text-sm leading-7 mb-4">
                    لو نسيت رقم الطلب، اعمل حساب جديد بنفس رقم الموبايل اللي طلبت بيه قبل كده — هتلاقي كل طلباتك السابقة في حسابك تلقائياً.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/signup" className="inline-block bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-bold transition text-sm">
                      اعمل حساب جديد ←
                    </Link>
                    <Link href="/login" className="inline-block bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-5 py-3 rounded-xl font-bold transition text-sm">
                      عندي حساب، سجّل دخول
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {loading && (
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-10 text-center">
            <p className="text-gray-500 text-lg">جارٍ التحميل...</p>
          </div>
        )}

        {!loading && ((currentUser && customerData) || searched) && orders.length === 0 && !errorMessage && (
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-10 text-center">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-500 text-lg font-bold mb-2">
              {currentUser ? "مفيش طلبات لسه" : "مفيش طلب بالرقم ده"}
            </p>
            <p className="text-gray-400 text-sm">
              {currentUser ? "ابدأ طلبك الأول دلوقتي" : "تأكد إنك كتبت الرقم صح، أو اعمل طلب جديد."}
            </p>
            <Link href="/request" className="inline-block mt-5 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition">
              اطلب خدمة دلوقتي 🔧
            </Link>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm">
                لقينا <span className="font-black text-gray-900">{orders.length}</span> طلب
              </p>
            </div>

            {orders.map((order) => {
              const isDone = order.status === "done";
              const hasComment = !!order.customerComment;
              const commentBadge = hasComment ? getCommentStatusBadge(order.commentStatus) : null;
              const isEditing = commentingId === order.id;

              return (
                <div key={order.id} className="bg-white border border-gray-200 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition">
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

                  <div className="mb-4 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full transition-all duration-500"
                      style={{ width: getProgressWidth(order.status) }} />
                  </div>

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

                  {currentUser && isDone && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {!hasComment && !isEditing && (
                        <button onClick={() => startCommenting(order.id, "", 0)}
                          className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-3 rounded-xl font-bold transition text-sm">
                          💬 اكتب تعليق وقيّم الخدمة
                        </button>
                      )}

                      {hasComment && !isEditing && (
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-gray-700 font-bold text-sm">💬 تعليقك</p>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${commentBadge.className}`}>
                              {commentBadge.text}
                            </span>
                          </div>

                          {/* 🆕 عرض التقييم */}
                          {order.customerRating > 0 && (
                            <div className="flex items-center gap-1 mb-2">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <span key={s} className={`text-lg ${s <= order.customerRating ? "text-yellow-400" : "text-gray-300"}`}>
                                  ★
                                </span>
                              ))}
                              <span className="text-gray-500 text-xs mr-2">({order.customerRating}/5)</span>
                            </div>
                          )}

                          <p className="text-gray-900 text-sm leading-7 mb-3">{order.customerComment}</p>
                          {order.commentStatus !== "rejected" && (
                            <button onClick={() => startCommenting(order.id, order.customerComment, order.customerRating || 0)}
                              className="text-xs text-red-500 hover:text-red-600 font-bold">
                              تعديل
                            </button>
                          )}
                        </div>
                      )}

                      {isEditing && (
                        <div className="space-y-3">
                          {/* 🆕 اختيار التقييم بالنجوم */}
                          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                            <p className="text-sm text-gray-600 font-bold mb-3">قيّم الخدمة (اختياري)</p>
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setCommentRating(star === commentRating ? 0 : star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="text-3xl transition-transform hover:scale-110">
                                  <span className={
                                    star <= (hoverRating || commentRating)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }>
                                    ★
                                  </span>
                                </button>
                              ))}
                              {commentRating > 0 && (
                                <span className="text-sm text-gray-500 mr-2">({commentRating}/5)</span>
                              )}
                            </div>
                          </div>

                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="اكتب رأيك في الخدمة... (مثال: الفني وصل بسرعة وكان محترم جداً)"
                            className="w-full p-3 rounded-xl bg-gray-50 border border-slate-400 text-gray-900 outline-none focus:border-red-500 focus:bg-white transition placeholder:text-gray-400 h-24 resize-none"
                            maxLength={500}
                          />
                          <p className="text-xs text-gray-400">{commentText.length}/500 حرف</p>
                          <div className="flex gap-3">
                            <button onClick={() => saveComment(order.id)} disabled={savingComment}
                              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-bold transition disabled:opacity-60 text-sm">
                              {savingComment ? "جارٍ الحفظ..." : "إرسال"}
                            </button>
                            <button onClick={() => { setCommentingId(""); setCommentText(""); setCommentRating(0); }}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-xl font-bold transition text-sm">
                              إلغاء
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">
                            ⓘ التعليق هيظهر في صفحة آراء العملاء بعد موافقة الإدارة
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {currentUser && !isDone && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-gray-400 text-xs text-center">
                        💡 تقدر تكتب تعليق بعد ما الطلب يكتمل
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}