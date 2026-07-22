"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR") + " تومان";
}

export function CartSummary() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse"><div className="h-4 bg-gray-200 rounded w-2/3 mb-4" /><div className="h-3 bg-gray-100 rounded w-full mb-2" /><div className="h-3 bg-gray-100 rounded w-full mb-2" /><div className="h-3 bg-gray-100 rounded w-1/2" /></div>;

  if (items.length === 0) return null;

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const shipping = subtotal >= 200000 ? 0 : 35000;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 animate-fade-in-up sticky top-24">
      <h3 className="font-bold text-lg mb-4">خلاصه سبد خرید</h3>

      <div className="space-y-3 text-sm mb-2">
        <div className="flex justify-between">
          <span className="text-gray-500">تعداد کالا</span>
          <span className="font-bold">{totalQty.toLocaleString("fa-IR")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">جمع کالاها</span>
          <span className="font-bold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">هزینه ارسال</span>
          <span className={`font-bold ${shipping === 0 ? "text-green-600" : ""}`}>
            {shipping === 0 ? "رایگان" : formatPrice(shipping)}
          </span>
        </div>
        {shipping > 0 && (
          <p className="text-[10px] text-gray-400 text-left">
            حداقل خرید ۲۰۰,۰۰۰ تومان برای ارسال رایگان
          </p>
        )}
        <div className="border-t pt-3 flex justify-between font-bold text-lg">
          <span>مبلغ قابل پرداخت</span>
          <span className="text-primary">{formatPrice(subtotal + shipping)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.97] mt-4"
      >
        <ShoppingBag className="w-5 h-5" />
        تسویه حساب
      </Link>

      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          پرداخت امن با درگاه‌های معتبر
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Truck className="w-4 h-4 text-primary" />
          ارسال سریع به سراسر کشور
        </div>
      </div>
    </div>
  );
}
