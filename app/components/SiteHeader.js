"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SiteHeader() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      alert("حصلت مشكلة أثناء تسجيل الخروج");
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="text-2xl font-black tracking-tight">
              <span className="text-white">Road</span>
              <span className="text-red-500">Fix</span>
            </Link>

            <span className="hidden sm:inline-block text-xs md:text-sm text-gray-400 border border-white/10 rounded-full px-3 py-1">
              Roadside Assistance System
            </span>
          </div>

          <nav className="flex flex-wrap items-center gap-2 md:gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              الرئيسية
            </Link>

            <Link
              href="/request"
              className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              اطلب خدمة
            </Link>

            <Link
              href="/track"
              className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              تتبع الطلب
            </Link>

            {!loading && !adminUser && (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 border border-red-500 transition"
              >
                دخول الأدمن
              </Link>
            )}

            {!loading && adminUser && (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 border border-blue-500 transition"
                >
                  لوحة التحكم
                </Link>

                <button
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 border border-red-500 transition disabled:opacity-60"
                >
                  {logoutLoading ? "جارٍ الخروج..." : "تسجيل الخروج"}
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}