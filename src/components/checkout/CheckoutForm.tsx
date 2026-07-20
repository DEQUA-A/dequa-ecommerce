"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { createOrder } from "@/lib/actions/orders";
import { Loader2 } from "lucide-react";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  async function submit(_prev: unknown, formData: FormData) {
    formData.append("cartItems", JSON.stringify(
      items.map((i) => ({
        productId: i.productId,
        qty: i.qty,
        price: i.discountPrice ?? i.price,
        name: i.name,
        image: i.image,
      }))
    ));

    const result = await createOrder(formData);
    if (result.success) {
      clearCart();
      router.push(`/checkout/success?orderId=${result.orderId}`);
      return null;
    }
    return result.error;
  }

  const [error, submitAction, pending] = useActionState(submit, null);

  return (
    <form action={submitAction} className="bg-white border rounded-2xl p-6 space-y-5">
      <h3 className="font-bold text-lg">اطلاعات تحویل گیرنده</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1">نام و نام خانوادگی</label>
          <input
            name="fullName"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="مثال: علی محمدی"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">شماره تماس</label>
          <input
            name="phone"
            required
            dir="ltr"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="۰۹۱۲۱۲۳۴۵۶۷"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold mb-1">شهر</label>
          <input
            name="city"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="مثال: تهران"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">کد پستی</label>
          <input
            name="postalCode"
            required
            dir="ltr"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="۱۲۳۴۵۶۷۸۹۰"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">آدرس</label>
        <textarea
          name="address"
          required
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          placeholder="آدرس کامل خود را وارد کنید"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">توضیحات (اختیاری)</label>
        <textarea
          name="notes"
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          placeholder="توضیحات اضافی برای سفارش"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
      >
        {pending && <Loader2 className="w-5 h-5 animate-spin" />}
        {pending ? "در حال ثبت سفارش..." : "ثبت سفارش"}
      </button>
    </form>
  );
}
