"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CartSummary } from "@/components/cart/CartSummary";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-4 bg-gray-200 rounded w-32 mb-6" />
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">خانه</Link>
        <span>/</span>
        <span className="text-gray-600 font-bold">سبد خرید</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 animate-fade-in-up">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold mb-2">سبد خرید شما خالی است</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            به نظر می‌رسد هنوز محصولی به سبد خرید خود اضافه نکرده‌اید. برای شروع خرید به فروشگاه بروید.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-[0.97]"
          >
            <ArrowLeft className="w-4 h-4" />
            مشاهده محصولات
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">سبد خرید</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {items.reduce((s, i) => s + i.qty, 0).toLocaleString("fa-IR")} کالا
              </span>
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                حذف همه
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-3">
              {items.map((item) => (
                <CartItemRow key={item.productId + (item.variantId || "")} item={item} />
              ))}
            </div>
            <div>
              <CartSummary />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
