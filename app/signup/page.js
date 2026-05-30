"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();

const isAdminEmail = (email) => {
  return (email || "").toLowerCase().trim() === ADMIN_EMAIL;
};

export default function SignupPage() {
  const router = useRouter();

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
        // لو فيه حد مسجّل دخول بالفعل، نوجّهه
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

  const validateEgyptPhone = (p) => {
    const normalized = p.replace(/\s+/g, "");
    return /^01[0-2,5][0-9]{8}$/.test(normalized);
  };

  const getArabicErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "الإيميل ده مسجّل بالفعل. سجّل دخول من فضلك.";
      case "auth/invalid-email":
        return "صيغة البريد الإلكتروني غير صحيحة";
      case "auth/weak-password":
        return "كلمة المرور ضعيفة. لازم تكون 6 حروف على الأقل";
      case "auth/network-request-failed":
        return "في مشكلة في الإنترنت";
      default:
        return `حصل خطأ: ${errorCode}`;
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // التحقق من البيانات
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      setErrorMessage("من فضلك املى كل الخانات");
      return;
    }

    if (!validateEgyptPhone(phone)) {
      setErrorMessage("من فضلك اكتب رقم موبايل مصري صحيح مكوّن من 11 رقم");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("كلمة المرور لازم تكون 6 حروف على الأقل");
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage("كلمة المرور وتأكيدها مش متطابقين");
      return;
    }

    // منع التسجيل بإيميل الأدمن
    if (isAdminEmail(email)) {
      setErrorMessage("الإيميل ده محجوز. استخدم إيميل تاني.");
      return;
    }

    try {
      setLoading(true);

      // 1. إنشاء حساب في Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. تحديث اسم المستخدم
      await updateProfile(user, { displayName: name.trim() });

      // 3. حفظ بيانات العميل في Firestore (users collection)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: "customer",
        createdAt: new Date(),
      });

      // 4. توجيه العميل لصفحة طلباته
      router.replace("/my-orders");
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage(getArabicErrorMessage(error.code));
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
        </div>
      </main>
    );
  }

  const inputClass = "w-full p-3 rounded-xl bg-gray-50 border border-slate-400 text-gray-900 outline-none focus:border-red-500 focus:bg-white transition placeholder:text-gray-400";

  return (
    <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4 py-12" dir="rtl">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="text-center mb-6">
          <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">RoadFix</span>
          <h1 className="text-3xl font-black mt-4 mb-2">إنشاء حساب جديد</h1>
          <p className="text-gray-500 text-sm">
            اعمل حسابك علشان تتابع طلباتك في مكان واحد
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-gray-600 font-bold">الاسم</label>
            <input
              type="text"
              placeholder="اكتب اسمك"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600 font-bold">البريد الإلكتروني</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600 font-bold">رقم الموبايل</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="مثال: 01012345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
            <p className="text-xs text-gray-400 mt-1">هنستخدمه عشان نربط طلباتك السابقة بحسابك</p>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600 font-bold">كلمة المرور</label>
            <input
              type="password"
              placeholder="6 حروف على الأقل"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600 font-bold">تأكيد كلمة المرور</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className={inputClass}
            />
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
              <p className="text-red-700 font-bold text-sm">{errorMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl font-black text-lg transition disabled:opacity-60 shadow-lg shadow-red-500/20"
          >
            {loading ? "جارٍ إنشاء الحساب..." : "إنشاء الحساب"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm mb-2">عندك حساب بالفعل؟</p>
          <Link href="/login" className="text-red-500 hover:text-red-600 font-bold text-sm">
            سجّل دخول ←
          </Link>
        </div>
      </div>
    </main>
  );
}