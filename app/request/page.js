"use client";

import { Suspense } from "react";
import RequestForm from "../components/RequestForm";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-gray-500 text-center mt-10">Loading...</div>}>
      <RequestForm />
    </Suspense>
  );
}