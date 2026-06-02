"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { useLanguage } from "../components/LanguageProvider";

const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();
const isAdminEmail = (email) => (email || "").toLowerCase().trim() === ADMIN_EMAIL;

export default function MyOrdersPage() {
  const { t, dir, lang, translateService } = useLanguage();

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
  const [commentRating, setCommentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
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
        } catch (error) { console.error("Error fetching user data:", error); }
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
    if (!createdAt) return lang === "ar" ? "غير متوفر" : "Not available";
    try {
      const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
      if (isNaN(date.getTime())) return lang === "ar" ? "غير متوفر" : "Not available";
      const locale = lang === "ar" ? "ar-EG" : "en-US";
      return new Intl.DateTimeFormat(locale, {
        year: "numeric", month: "long", day: "numeric",
        hour: "numeric", minute: "2-digit",
      }).format(date);
    } catch {
      return lang === "ar" ? "غير متوفر" : "Not available";
    }
  };

  const getStatusLabel = (status) => {
    if ((status || "new") === "new") return t("myOrders.statusNew");
    if (status === "in-progress") return t("myOrders.statusInProgress");
    return t("myOrders.statusDone");
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
    if (commentStatus === "approved") return { text: t("myOrders.commentApproved"), className: "bg-green-100 text-green-800 border border-green-300" };
    if (commentStatus === "rejected") return { text: t("myOrders.commentRejected"), className: "bg-red-100 text-red-800 border border-red-300" };
    return { text: t("myOrders.commentPending"), className: "bg-yellow-100 text-yellow-800 border border-yellow-300" };
  };

  const mergeOrders = (list1, list2) => {
    const merged = [...list1];
    list2.forEach((order) => {
      if (!merged.some((o) => o.id === order.id)) merged.push(order);
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
      setErrorMessage(t("myOrders.errorFetch"));
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSearch = async () => {
    setErrorMessage("");
    const input = requestNumber.trim();
    if (!input) { setErrorMessage(t("myOrders.errorRequired")); return; }
    if (!isRequestNumber(input)) { setErrorMessage(t("myOrders.errorFormat")); return; }

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
      setErrorMessage(t("myOrders.errorFetch"));
    } finally {
      setLoading(false);
    }
  };

  const startCommenting = (orderId, existingComment, existingRating) => {
    setCommentingId(orderId);
    setCommentText(existingComment || "");
    setCommentRating(existingRating || 0);
    setHoverRating(0);
  };

  const saveComment = async (orderId) => {
    const text = commentText.trim();
    if (!text) { alert(t("myOrders.errorCommentEmpty")); return; }
    if (text.length < 10) { alert(t("myOrders.errorCommentShort")); return; }

    try {
      setSavingComment(true);
      const updateData = {
        customerComment: text,
        commentStatus: "pending",
        commentDate: new Date(),
        commentAuthor: customerData?.name || (lang === "ar" ? "عميل" : "Customer"),
      };
      if (commentRating > 0) updateData.customerRating = commentRating;

      await updateDoc(doc(db, "requests", orderId), updateData);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, customerComment: text, commentStatus: "pending", commentDate: new Date(), commentAuthor: customerData?.name || "عميل", customerRating: commentRating > 0 ? commentRating : o.customerRating }
            : o
        )
      );
      setCommentingId("");
      setCommentText("");
      setCommentRating(0);
      setHoverRating(0);
      alert(t("myOrders.commentSent"));
    } catch (error) {
      console.error("Save comment error:", error);
      alert(t("myOrders.commentSaveError"));
    } finally {
      setSavingComment(false);
    }
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center" dir={dir}>
        <div className="text-center">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">RoadFix</span>
          <h1 className="text-2xl font-black mt-4 mb-3">{t("myOrders.loading")}</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 py-12 md:px-6" dir={dir}>
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-10">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">RoadFix</span>
          <h1 className="text-3xl md:text-5xl font-black mt-4 mb-4">{t("myOrders.pageTitle")}</h1>
          {currentUser && customerData ? (
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-8">
              {t("myOrders.welcomeBack")} <span className="font-bold text-gray-900">{customerData.name}</span> 👋
              <br />
              {t("myOrders.yourHistory")}
            </p>
          ) : (
            <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-8">
              {t("myOrders.guestSubtitle")} <span className="font-bold text-gray-900">{t("myOrders.orderNumberWord")}</span> {t("myOrders.orderNumberDesc")}
            </p>
          )}
        </div>

        {!currentUser && (
          <>
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm mb-6">
              <label className="block mb-3 text-sm text-gray-600 font-bold">{t("myOrders.orderNumberLabel")}</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder={t("myOrders.orderNumberPlaceholder")}
                  value={requestNumber}
                  onChange={(e) => setRequestNumber(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleGuestSearch(); }}
                  className="flex-1 p-4 rounded-2xl bg-white border border-slate-400 text-gray-900 outline-none focus:border-red-500 transition placeholder:text-gray-400"
                />
                <button onClick={handleGuestSearch} disabled={loading}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black transition disabled:opacity-60">
                  {loading ? t("myOrders.searching") : t("myOrders.search")}
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
                  <h3 className="text-lg font-black text-amber-900 mb-2">{t("myOrders.forgotTitle")}</h3>
                  <p className="text-amber-800 text-sm leading-7 mb-4">{t("myOrders.forgotDesc")}</p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/signup" className="inline-block bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-bold transition text-sm">
                      {t("myOrders.createAccount")}
                    </Link>
                    <Link href="/login" className="inline-block bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-5 py-3 rounded-xl font-bold transition text-sm">
                      {t("myOrders.goLogin")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {loading && (
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-10 text-center">
            <p className="text-gray-500 text-lg">{t("myOrders.loading")}</p>
          </div>
        )}

        {!loading && ((currentUser && customerData) || searched) && orders.length === 0 && !errorMessage && (
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-10 text-center">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-500 text-lg font-bold mb-2">
              {currentUser ? t("myOrders.noOrdersAccount") : t("myOrders.noOrdersGuest")}
            </p>
            <p className="text-gray-400 text-sm">
              {currentUser ? t("myOrders.noOrdersAccountDesc") : t("myOrders.noOrdersGuestDesc")}
            </p>
            <Link href="/request" className="inline-block mt-5 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition">
              {t("myOrders.requestNow")}
            </Link>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-sm">
                {t("myOrders.foundOrders")} <span className="font-black text-gray-900">{orders.length}</span> {t("myOrders.ordersWord")}
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
                        {/* 🆕 ترجمة اسم الخدمة في العرض */}
                        <h2 className="text-lg font-black">{translateService(order.service) || (lang === "ar" ? "خدمة" : "Service")}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="text-red-500 text-sm font-bold">{t("myOrders.orderNumberLabel")}: {order.requestNumber}</p>
                    </div>
                    <p className="text-gray-400 text-sm">{formatDateTime(order.createdAt)}</p>
                  </div>

                  <div className="mb-4 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full transition-all duration-500"
                      style={{ width: getProgressWidth(order.status) }} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3">
                      <p className="text-gray-400 mb-1">{t("myOrders.descriptionLabel")}</p>
                      <p className="font-bold text-gray-900">{order.description || (lang === "ar" ? "غير متوفر" : "Not available")}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3">
                      <p className="text-gray-400 mb-1">{t("myOrders.priceLabel")}</p>
                      <p className="font-bold text-green-600">
                        {order.adminPrice ? `${order.adminPrice} ${t("myOrders.pricePounds")}` : t("myOrders.pricePending")}
                      </p>
                    </div>
                  </div>

                  {order.adminNotes && (
                    <div className="mt-3 bg-amber-50 border border-amber-100 rounded-2xl p-3">
                      <p className="text-amber-700 text-xs mb-1 font-bold">{t("myOrders.adminNotesLabel")}</p>
                      <p className="text-gray-900 text-sm">{order.adminNotes}</p>
                    </div>
                  )}

                  {currentUser && isDone && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      {!hasComment && !isEditing && (
                        <button onClick={() => startCommenting(order.id, "", 0)}
                          className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-3 rounded-xl font-bold transition text-sm">
                          {t("myOrders.writeCommentBtn")}
                        </button>
                      )}

                      {hasComment && !isEditing && (
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-gray-700 font-bold text-sm">{t("myOrders.yourComment")}</p>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${commentBadge.className}`}>
                              {commentBadge.text}
                            </span>
                          </div>

                          {order.customerRating > 0 && (
                            <div className="flex items-center gap-1 mb-2">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <span key={s} className={`text-lg ${s <= order.customerRating ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                              ))}
                              <span className="text-gray-500 text-xs mr-2">({order.customerRating}/5)</span>
                            </div>
                          )}

                          <p className="text-gray-900 text-sm leading-7 mb-3">{order.customerComment}</p>
                          {order.commentStatus !== "rejected" && (
                            <button onClick={() => startCommenting(order.id, order.customerComment, order.customerRating || 0)}
                              className="text-xs text-red-500 hover:text-red-600 font-bold">
                              {t("myOrders.editComment")}
                            </button>
                          )}
                        </div>
                      )}

                      {isEditing && (
                        <div className="space-y-3">
                          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                            <p className="text-sm text-gray-600 font-bold mb-3">{t("myOrders.ratingOptional")}</p>
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} type="button"
                                  onClick={() => setCommentRating(star === commentRating ? 0 : star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="text-3xl transition-transform hover:scale-110">
                                  <span className={star <= (hoverRating || commentRating) ? "text-yellow-400" : "text-gray-300"}>★</span>
                                </button>
                              ))}
                              {commentRating > 0 && <span className="text-sm text-gray-500 mr-2">({commentRating}/5)</span>}
                            </div>
                          </div>

                          <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder={t("myOrders.commentPlaceholder")}
                            className="w-full p-3 rounded-xl bg-gray-50 border border-slate-400 text-gray-900 outline-none focus:border-red-500 focus:bg-white transition placeholder:text-gray-400 h-24 resize-none"
                            maxLength={500}
                          />
                          <p className="text-xs text-gray-400">{commentText.length}/500</p>
                          <div className="flex gap-3">
                            <button onClick={() => saveComment(order.id)} disabled={savingComment}
                              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-bold transition disabled:opacity-60 text-sm">
                              {savingComment ? t("myOrders.sending") : t("myOrders.send")}
                            </button>
                            <button onClick={() => { setCommentingId(""); setCommentText(""); setCommentRating(0); }}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-xl font-bold transition text-sm">
                              {t("myOrders.cancel")}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">{t("myOrders.commentNote")}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {currentUser && !isDone && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-gray-400 text-xs text-center">{t("myOrders.addCommentLater")}</p>
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