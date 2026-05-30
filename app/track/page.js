"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TrackRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const number = searchParams.get("number");

  useEffect(() => {
    // نوجّه لصفحة طلباتي مع رقم الطلب لو موجود
    if (number) {
      router.replace(`/my-orders?ref=${encodeURIComponent(number)}`);
    } else {
      router.replace("/my-orders");
    }
  }, [router, number]);

  return (
    <main className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4" dir="rtl">
      <div className="text-center">
        <span className="bg-red-50 text-red-500 font-bold text-sm px-4 py-2 rounded-full">RoadFix</span>
        <h1 className="text-2xl font-black mt-4 mb-3">جارٍ التحويل...</h1>
        <p className="text-gray-500">صفحة التتبع بقت في "طلباتي"</p>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="text-gray-500 text-center mt-10">Loading...</div>}>
      <TrackRedirect />
    </Suspense>
  );
}