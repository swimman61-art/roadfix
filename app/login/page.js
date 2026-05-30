"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

// إيميل الأدمن من المتغير السري
const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();

// دالة بسيطة تحدد لو الإيميل ده أدمن ولا عميل
const isAdminEmail = (email) => {
  return (email || "").toLowerCase().trim() === ADMIN_EMAIL;
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // لو فيه حد مسجّل دخول بالفعل، نوجّهه حسب نوعه
        if (isAdminEmail(user.email)) {
          router.replace("/dashboard");
        } else {
          router.replace("/my-orders");
        }
        return;
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  const getArabicErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "صيغة البريد الإلكتروني غير صحيحة";
      case "auth/invalid-credential":
        return "الإيميل أو الباسورد غير صحيح، أو المستخدم غير موجود";
      case "auth/user-not-found":
        return "المستخدم غير موجود";
      case "auth/wrong-password":
        return "كلمة المرور غير صحيحة";
      case "auth/missing-password":
        return "من فضلك اكتب كلمة المرور";
      case "auth/too-many-requests":
        return "تمت محاولات كثيرة. حاول بعد قليل";
      case "auth/network-request-failed":
        return "في مشكلة في الإنترنت أو الاتصال بـ Firebase";
      default:
        return `حصل خطأ: ${errorCode}`;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("من فضلك اكتب الإيميل والباسورد");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const userEmail = userCredential.user.email;

      // التوجيه حسب نوع المستخدم
      if (isAdminEmail(userEmail)) {
        router.replace("/dashboard");
      } else {
        router.replace("/my-orders");
      }
    } catch (error) {
      console.error("Firebase login error:", error);
      alert(getArabicErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4" dir="rtl">
        <div className="text-center">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">RoadFix</span>
          <h1 className="text-2xl font-black mt-4 mb-3">جارٍ التحميل...</h1>
          <p className="text-gray-500">من فضلك انتظر لحظة</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4 py-12" dir="rtl">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="text-center mb-6">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">RoadFix</span>
          <h1 className="text-3xl font-black mt-4 mb-3">تسجيل الدخول</h1>
          <p className="text-gray-500 mt-2">
            سجّل دخولك للوصول لطلباتك أو لوحة التحكم
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-gray-600 font-bold">البريد الإلكتروني</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 border border-slate-400 text-gray-900 outline-none focus:border-red-500 focus:bg-white transition placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600 font-bold">كلمة المرور</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 border border-slate-400 text-gray-900 outline-none focus:border-red-500 focus:bg-white transition placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl font-black text-lg transition disabled:opacity-60 shadow-lg shadow-red-500/20"
          >
            {loading ? "جارٍ تسجيل الدخول..." : "دخول"}
          </button>
        </form>

        {/* رابط التسجيل للعملاء الجدد */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm mb-2">معندكش حساب؟</p>
          <Link href="/signup" className="text-red-500 hover:text-red-600 font-bold text-sm">
            اعمل حساب جديد ←
          </Link>
        </div>
      </div>
    </main>
  );
}