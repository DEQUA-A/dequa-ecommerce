import type { Metadata } from "next";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "علاقه‌مندی‌ها", description: "محصولات مورد علاقه شما" };

export default function WishlistPage() {
  return (
    <div className="animate-fade-in-up">
      <h2 className="text-xl font-bold mb-6">علاقه‌مندی‌ها</h2>
      <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
        <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-5">
          <Heart className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-lg font-bold mb-2">لیست علاقه‌مندی‌ها خالی است</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
          محصولات مورد علاقه خود را با کلیک روی قلب محصول به این لیست اضافه کنید.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-hover transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-[0.97]"
        >
          <ArrowLeft className="w-4 h-4" />
          مشاهده محصولات
        </Link>
      </div>
    </div>
  );
}
