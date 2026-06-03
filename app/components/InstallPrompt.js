"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";

export default function InstallPrompt() {
  const { lang } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // نتأكد إن المستخدم مرفضش الـ prompt قبل كده
    const dismissed = localStorage.getItem("roadfix-install-dismissed");
    if (dismissed) return;

    // نتأكد إن التطبيق مش مثبّت بالفعل
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (window.navigator.standalone === true) return;

    // نكتشف iPhone/iPad (مالهومش beforeinstallprompt event)
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // على iPhone، نعرض الـ prompt بعد 5 ثواني
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => clearTimeout(timer);
    }

    // على Android/Chrome — نستنى الـ event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // نعرض الـ prompt بعد 5 ثواني
      setTimeout(() => setShowPrompt(true), 5000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      // على iPhone، نعرض التعليمات
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("✅ User accepted the install prompt");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    // نفتكر إن العميل رفض
    localStorage.setItem("roadfix-install-dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* خلفية شفافة (overlay) */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] animate-fadeIn"
        onClick={handleDismiss}
      />

      {/* الـ Popup */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 animate-slideUp"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className="max-w-md mx-auto p-6">

          {/* زرار الإغلاق */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition font-bold text-lg"
            aria-label="Close"
          >
            ✕
          </button>

          {/* المحتوى */}
          {!showIOSInstructions ? (
            <>
              {/* الأيقونة */}
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="/icons/icon-192.png"
                    alt="RoadFix"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* العنوان */}
              <div className="text-center mb-5">
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  {lang === "ar"
                    ? "📱 ثبّت RoadFix على موبايلك!"
                    : "📱 Install RoadFix on your phone!"}
                </h3>
                <p className="text-gray-600 text-sm leading-7">
                  {lang === "ar"
                    ? "وصول أسرع للخدمة في أي وقت، بدون الحاجة لفتح المتصفح."
                    : "Faster access anytime, no need to open the browser."}
                </p>
              </div>

              {/* المميزات */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="text-lg">⚡</span>
                    <span>{lang === "ar" ? "فتح أسرع — في ثانية واحدة" : "Opens instantly — in one second"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="text-lg">📱</span>
                    <span>{lang === "ar" ? "أيقونة على شاشتك الرئيسية" : "Icon on your home screen"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="text-lg">🔔</span>
                    <span>{lang === "ar" ? "وصول مباشر بدون متصفح" : "Direct access without a browser"}</span>
                  </div>
                </div>
              </div>

              {/* الأزرار */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleInstall}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.02] shadow-lg shadow-red-500/30"
                >
                  {lang === "ar" ? "✨ ثبّت دلوقتي" : "✨ Install Now"}
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-gray-500 hover:text-gray-700 text-sm font-bold py-2 transition"
                >
                  {lang === "ar" ? "مش دلوقتي" : "Not now"}
                </button>
              </div>
            </>
          ) : (
            // تعليمات iPhone
            <>
              <div className="text-center mb-5">
                <h3 className="text-2xl font-black text-gray-900 mb-3">
                  {lang === "ar" ? "📱 ازاي تثبّت التطبيق" : "📱 How to install"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {lang === "ar"
                    ? "خطوتين بسيطين فقط:"
                    : "Just 2 simple steps:"}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-start gap-3">
                  <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">1</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-1">
                      {lang === "ar" ? "اضغط على زرار المشاركة" : "Tap the Share button"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {lang === "ar"
                        ? "📤 الزرار اللي تحت في Safari"
                        : "📤 The button at the bottom of Safari"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-start gap-3">
                  <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">2</span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm mb-1">
                      {lang === "ar" ? "اختار \"Add to Home Screen\"" : 'Choose "Add to Home Screen"'}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {lang === "ar"
                        ? "➕ هتلاقيها في القائمة"
                        : "➕ You'll find it in the menu"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-bold transition"
              >
                {lang === "ar" ? "فهمت ✓" : "Got it ✓"}
              </button>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}