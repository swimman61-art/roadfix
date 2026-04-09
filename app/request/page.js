"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RequestContent() {
  const searchParams = useSearchParams();

  const name = searchParams.get("name");
  const phone = searchParams.get("phone");
  const service = searchParams.get("service");

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">تم استلام الطلب 🚗</h1>

        <p>الاسم: {name}</p>
        <p>الموبايل: {phone}</p>
        <p>الخدمة: {service}</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Loading...</div>}>
      <RequestContent />
    </Suspense>
  );
}