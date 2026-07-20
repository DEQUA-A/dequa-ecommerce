"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/store/cart";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR") + " تومان";
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">برای تسویه حساب لطفا وارد حساب خود شوید</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors"
        >
          ورود به حساب
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">سبد خرید شما خالی است</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">تسویه حساب</h1>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <CheckoutForm />
        </div>

        <div className="md:col-span-2">
          <div className="bg-white border rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4">خلاصه سفارش</h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => {
                const unitPrice = item.discountPrice ?? item.price;
                return (
                  <div key={item.productId + (item.variantId || "")} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate">
                      {item.name} <span className="text-gray-400">x{item.qty.toLocaleString("fa-IR")}</span>
                    </span>
                    <span className="font-bold">{formatPrice(unitPrice * item.qty)}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>جمع کل</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
