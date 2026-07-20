"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR") + " تومان";
}

export function CartSummary() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());

  if (items.length === 0) return null;

  return (
    <div className="bg-white border rounded-2xl p-6">
      <h3 className="font-bold text-lg mb-4">خلاصه سبد خرید</h3>
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-500">تعداد کالا</span>
          <span className="font-bold">{items.reduce((s, i) => s + i.qty, 0).toLocaleString("fa-IR")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">جمع کل</span>
          <span className="font-bold">{formatPrice(subtotal)}</span>
        </div>
      </div>
      <Link
        href="/checkout"
        className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
      >
        <ShoppingBag className="w-5 h-5" />
        تسویه حساب
      </Link>
    </div>
  );
}
