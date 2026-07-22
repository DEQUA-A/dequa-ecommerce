"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/store/cart";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { ShoppingBag, ArrowLeft, Truck, ShieldCheck, RotateCcw } from "lucide-react";
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
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in-up">
        <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold mb-2">برای تسویه حساب وارد شوید</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          برای ادامه فرایند خرید و ثبت سفارش لطفا وارد حساب کاربری خود شوید.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-[0.97]"
        >
          ورود به حساب
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in-up">
        <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-bold mb-2">سبد خرید شما خالی است</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          قبل از تسویه حساب باید محصولاتی را به سبد خرید خود اضافه کنید.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-[0.97]"
        >
          <ArrowLeft className="w-4 h-4" />
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  const shipping = subtotal >= 200000 ? 0 : 35000;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">خانه</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-gray-600 transition-colors">سبد خرید</Link>
        <span>/</span>
        <span className="text-gray-600 font-bold">تسویه حساب</span>
      </div>

      <h1 className="text-2xl font-bold mb-8">تسویه حساب</h1>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">۱</span>
            </div>
            <span className="font-bold text-sm">اطلاعات تحویل گیرنده</span>
            <div className="flex-1 h-px bg-gray-200 mx-4" />
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-sm font-bold">۲</span>
            </div>
            <span className="text-sm text-gray-400">پرداخت</span>
          </div>

          <CheckoutForm />
        </div>

        <div className="md:col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24 animate-fade-in-up">
            <h3 className="font-bold text-lg mb-4">خلاصه سفارش</h3>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {items.map((item) => {
                const unitPrice = item.discountPrice ?? item.price;
                return (
                  <div key={item.productId + (item.variantId || "")} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover border shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{item.name}</p>
                      <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                        <span>{item.qty.toLocaleString("fa-IR")} × {formatPrice(unitPrice)}</span>
                        <span className="font-bold text-gray-700">{formatPrice(unitPrice * item.qty)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">جمع کل</span>
                <span className="font-bold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">هزینه ارسال</span>
                <span className={`font-bold ${shipping === 0 ? "text-green-600" : ""}`}>
                  {shipping === 0 ? "رایگان" : formatPrice(shipping)}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>قابل پرداخت</span>
                <span className="text-primary">{formatPrice(subtotal + shipping)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Truck className="w-4 h-4 text-primary" />
                ارسال سریع به سراسر کشور
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                پرداخت امن با درگاه‌های معتبر
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <RotateCcw className="w-4 h-4 text-amber-500" />
                امکان بازگشت تا ۷ روز
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
