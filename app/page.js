"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !phone || !service) {
      alert("من فضلك املى كل البيانات");
      return;
    }

    // 👇 ده المهم (بنبعت البيانات مع اللينك)
    router.push(
      `/request?name=${name}&phone=${phone}&service=${service}`
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center mb-4">
          🚗 RoadFix - اطلب خدمة
        </h1>

        <input
          type="text"
          placeholder="الاسم"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 outline-none"
        />

        <input
          type="text"
          placeholder="رقم الموبايل"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 outline-none"
        />

        <input
          type="text"
          placeholder="نوع الخدمة"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 outline-none"
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-bold"
        >
          إرسال الطلب
        </button>
      </form>
    </div>
  );
}