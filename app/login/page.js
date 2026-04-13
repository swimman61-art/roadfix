"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const getArabicErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "صيغة البريد الإلكتروني غير صحيحة";
      case "auth/invalid-credential":
        return "الإيميل أو الباسورد غير صحيح، أو المستخدم غير موجود";
      case "auth/user-not-found":
        return "المستخدم غير موجود في Firebase Authentication";
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

      await signInWithEmailAndPassword(auth, email.trim(), password);

      alert("تم تسجيل الدخول بنجاح ✅");
      router.push("/dashboard");
    } catch (error) {
      console.error("Firebase login error:", error);
      alert(getArabicErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen bg-black text-white flex items-center justify-center px-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <p className="text-red-500 font-bold mb-2">RoadFix Admin</p>
          <h1 className="text-3xl font-extrabold">تسجيل الدخول</h1>
          <p className="text-gray-400 mt-3">
            سجّل دخولك للوصول إلى لوحة التحكم
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-gray-300">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              placeholder="admin@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300">
              كلمة المرور
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-black border border-gray-700 text-white outline-none focus:border-red-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-xl font-bold disabled:opacity-60"
          >
            {loading ? "جارٍ تسجيل الدخول..." : "دخول"}
          </button>
        </form>
      </div>
    </main>
  );
}