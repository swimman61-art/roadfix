"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useLanguage } from "../components/LanguageProvider";

const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();
const isAdminEmail = (email) => (email || "").toLowerCase().trim() === ADMIN_EMAIL;

export default function SignupPage() {
  const router = useRouter();
  const { t, dir, lang } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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

  const validateEgyptPhone = (p) => /^01[0-2,5][0-9]{8}$/.test(p.replace(/\s+/g, ""));

  const getErrorMessage = (errorCode) => {
    const isAr = lang === "ar";
    switch (errorCode) {
      case "auth/email-already-in-use":
        return isAr ? "الإيميل ده مسجّل بالفعل. سجّل دخول من فضلك." : "This email is already registered. Please login.";
      case "auth/invalid-email":
        return isAr ? "صيغة البريد الإلكتروني غير صحيحة" : "Invalid email format";
      case "auth/weak-password":
        return isAr ? "كلمة المرور ضعيفة. لازم تكون 6 حروف على الأقل" : "Weak password. Must be at least 6 characters";
      case "auth/network-request-failed":
        return isAr ? "في مشكلة في الإنترنت" : "Network issue";
      default:
        return isAr ? `حصل خطأ: ${errorCode}` : `Error: ${errorCode}`;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const isAr = lang === "ar";

    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setErrorMessage(isAr ? "من فضلك املى كل الخانات" : "Please fill in all fields");
      return;
    }
    if (!validateEgyptPhone(phone)) {
      setErrorMessage(isAr ? "من فضلك اكتب رقم موبايل مصري صحيح مكوّن من 11 رقم" : "Please enter a valid 11-digit Egyptian mobile number");
      return;
    }
    if (password.length < 6) {
      setErrorMessage(isAr ? "كلمة المرور لازم تكون 6 حروف على الأقل" : "Password must be at least 6 characters");
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMessage(isAr ? "كلمة المرور وتأكيدها مش متطابقين" : "Passwords don't match");
      return;
    }
    if (isAdminEmail(email)) {
      setErrorMessage(isAr ? "الإيميل ده محجوز. استخدم إيميل تاني." : "This email is reserved. Use another email.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name.trim() });
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: "customer",
        createdAt: new Date(),
      });
      router.replace("/my-orders");
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage(getErrorMessage(error.code));
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
        </div>
      </main>
    );
  }

  const inputClass = "w-full p-3 rounded-xl bg-gray-50 border border-slate-400 text-gray-900 outline-none focus:border-red-500 focus:bg-white transition placeholder:text-gray-400";

  return (
    <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4 py-12" dir={dir}>
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="text-center mb-6">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">RoadFix</span>
          <h1 className="text-3xl font-black mt-4 mb-2">{t("signup.pageTitle")}</h1>
          <p className="text-gray-500 text-sm">{t("signup.pageSubtitle")}</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-gray-600 font-bold">{t("signup.name")}</label>
            <input type="text" placeholder={t("signup.namePlaceholder")} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600 font-bold">{t("signup.email")}</label>
            <input type="email" placeholder={t("signup.emailPlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600 font-bold">{t("signup.phone")}</label>
            <input type="text" inputMode="numeric" placeholder={t("signup.phonePlaceholder")} value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
            <p className="text-xs text-gray-400 mt-1">{t("signup.phoneHelp")}</p>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600 font-bold">{t("signup.password")}</label>
            <input type="password" placeholder={t("signup.passwordPlaceholder")} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600 font-bold">{t("signup.confirmPassword")}</label>
            <input type="password" placeholder="••••••••" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className={inputClass} />
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
              <p className="text-red-700 font-bold text-sm">{errorMessage}</p>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl font-black text-lg transition disabled:opacity-60 shadow-lg shadow-red-500/20">
            {loading ? t("signup.submitting") : t("signup.submit")}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm mb-2">{t("signup.hasAccount")}</p>
          <Link href="/login" className="text-red-500 hover:text-red-600 font-bold text-sm">
            {t("signup.goLogin")}
          </Link>
        </div>
      </div>
    </main>
  );
}