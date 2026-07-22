import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ArrowLeft, Package, FileText, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "سفارش ثبت شد",
  description: "سفارش شما با موفقیت ثبت شد.",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center animate-fade-in-up">
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
          <Package className="w-3 h-3 text-white" />
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">سفارش شما با موفقیت ثبت شد</h1>
      <p className="text-gray-500 mb-2 max-w-xs mx-auto">
        از خرید شما متشکریم. سفارش شما در اسرع وقت پردازش و ارسال خواهد شد.
      </p>

      {orderId && (
        <div className="bg-gray-50 rounded-2xl px-6 py-4 inline-flex items-center gap-3 mb-8 border border-gray-100">
          <FileText className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500">کد پیگیری:</span>
          <span className="font-bold text-gray-800" dir="ltr">{orderId}</span>
        </div>
      )}

      <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-8 text-xs text-green-700 space-y-2 text-right">
        <p className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
          پس از تأیید سفارش، پیامک تأیید برای شما ارسال خواهد شد
        </p>
        <p className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
          می‌توانید وضعیت سفارش خود را از بخش پیگیری سفارشات مشاهده کنید
        </p>
        <p className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
          در صورت نیاز به پشتیبانی با شماره ۰۲۱-۱۲۳۴۵۶۷۸ تماس بگیرید
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/account/orders"
          className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-[0.97] flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          پیگیری سفارش
        </Link>
        <Link
          href="/products"
          className="flex items-center gap-2 border border-gray-300 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all duration-200 active:scale-[0.97]"
        >
          <ShoppingBag className="w-4 h-4" />
          ادامه خرید
        </Link>
      </div>
    </div>
  );
}
