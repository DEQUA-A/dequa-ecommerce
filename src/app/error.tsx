"use client";

import { AlertTriangle } from "lucide-react";

export default function RootError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md px-4">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">خطایی رخ داد</h1>
        <p className="text-gray-500 mb-6">{error.message || "متأسفانه مشکلی پیش آمده است. لطفا دوباره تلاش کنید."}</p>
        <button
          onClick={reset}
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
}
