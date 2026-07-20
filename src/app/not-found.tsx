import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center max-w-md px-4">
        <FileQuestion className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">صفحه مورد نظر یافت نشد</h1>
        <p className="text-gray-500 mb-6">صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است.</p>
        <Link
          href="/"
          className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
