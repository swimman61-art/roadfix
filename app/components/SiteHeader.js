"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import LanguageSwitcher from "./LanguageSwitcher";

const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "").toLowerCase();
const isAdminEmail = (email) => (email || "").toLowerCase().trim() === ADMIN_EMAIL;

export default function SiteHeader() {
  const router = useRouter();
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
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

  const isAdmin = currentUser && isAdminEmail(currentUser.email);
  const isCustomer = currentUser && !isAdmin;

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
              {t("nav.siteTagline")}
            </span>
          </div>

          <nav className="flex flex-wrap items-center gap-2 md:gap-3">
            <Link href="/"
              className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition">
              {t("nav.home")}
            </Link>

            <Link href="/request"
              className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition">
              {t("nav.requestService")}
            </Link>

            <Link href="/my-orders"
              className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition">
              {t("nav.myOrders")}
            </Link>

            {!loading && !currentUser && (
              <>
                <Link href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition">
                  {t("nav.login")}
                </Link>
                <Link href="/signup"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 border border-red-500 transition">
                  {t("nav.signup")}
                </Link>
              </>
            )}

            {!loading && isAdmin && (
              <>
                <Link href="/dashboard"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 border border-blue-500 transition">
                  {t("nav.dashboard")}
                </Link>
                <button onClick={handleLogout} disabled={logoutLoading}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 border border-red-500 transition disabled:opacity-60">
                  {logoutLoading ? t("nav.loggingOut") : t("nav.logout")}
                </button>
              </>
            )}

            {!loading && isCustomer && (
              <button onClick={handleLogout} disabled={logoutLoading}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 border border-red-500 transition disabled:opacity-60">
                {logoutLoading ? t("nav.loggingOut") : t("nav.logout")}
              </button>
            )}

            {/* زرار اللغة */}
            <LanguageSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
}