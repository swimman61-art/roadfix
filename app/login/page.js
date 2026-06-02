"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useLanguage } from "../components/LanguageProvider";

const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();
const isAdminEmail = (email) => (email || "").toLowerCase().trim() === ADMIN_EMAIL;

export default function LoginPage() {
  const router = useRouter();
  const { t, dir, lang } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
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

  const getErrorMessage = (errorCode) => {
    const isAr = lang === "ar";
    switch (errorCode) {
      case "auth/invalid-email":
        return isAr ? "صيغة البريد الإلكتروني غير صحيحة" : "Invalid email format";
      case "auth/invalid-credential":
        return isAr ? "الإيميل أو الباسورد غير صحيح، أو المستخدم غير موجود" : "Invalid email or password, or user not found";
      case "auth/user-not-found":
        return isAr ? "المستخدم غير موجود" : "User not found";
      case "auth/wrong-password":
        return isAr ? "كلمة المرور غير صحيحة" : "Wrong password";
      case "auth/missing-password":
        return isAr ? "من فضلك اكتب كلمة المرور" : "Please enter password";
      case "auth/too-many-requests":
        return isAr ? "تمت محاولات كثيرة. حاول بعد قليل" : "Too many attempts. Try again later";
      case "auth/network-request-failed":
        return isAr ? "في مشكلة في الإنترنت أو الاتصال بـ Firebase" : "Network or Firebase connection issue";
      default:
        return isAr ? `حصل خطأ: ${errorCode}` : `Error: ${errorCode}`;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert(lang === "ar" ? "من فضلك اكتب الإيميل والباسورد" : "Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const userEmail = userCredential.user.email;
      if (isAdminEmail(userEmail)) {
        router.replace("/dashboard");
      } else {
        router.replace("/my-orders");
      }
    } catch (error) {
      console.error("Firebase login error:", error);
      alert(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4" dir={dir}>
        <div className="text-center">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">RoadFix</span>
          <h1 className="text-2xl font-black mt-4 mb-3">{t("common.loading")}</h1>
          <p className="text-gray-500">{t("common.pleaseWait")}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4 py-12" dir={dir}>
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="text-center mb-6">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">RoadFix</span>
          <h1 className="text-3xl font-black mt-4 mb-3">{t("login.pageTitle")}</h1>
          <p className="text-gray-500 mt-2">{t("login.pageSubtitle")}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-gray-600 font-bold">{t("login.email")}</label>
            <input
              type="email"
              placeholder={t("login.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 border border-slate-400 text-gray-900 outline-none focus:border-red-500 focus:bg-white transition placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600 font-bold">{t("login.password")}</label>
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
            {loading ? t("login.submitting") : t("login.submit")}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm mb-2">{t("login.noAccount")}</p>
          <Link href="/signup" className="text-red-500 hover:text-red-600 font-bold text-sm">
            {t("login.createAccount")}
          </Link>
        </div>
      </div>
    </main>
  );
}