"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { createOrder } from "@/lib/actions/orders";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
    <form action={submitAction} className="bg-white border rounded-2xl p-6 space-y-5 animate-fade-in-up">
      <h3 className="font-bold text-lg">اطلاعات تحویل گیرنده</h3>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="نام و نام خانوادگی"
          name="fullName"
          placeholder="مثال: علی محمدی"
          required
          autoComplete="name"
        />
        <Input
          label="شماره تماس"
          name="phone"
          dir="ltr"
          placeholder="۰۹۱۲۱۲۳۴۵۶۷"
          required
          autoComplete="tel"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="شهر"
          name="city"
          placeholder="مثال: تهران"
          required
          autoComplete="address-level2"
        />
        <Input
          label="کد پستی"
          name="postalCode"
          dir="ltr"
          placeholder="۱۲۳۴۵۶۷۸۹۰"
          required
          autoComplete="postal-code"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          آدرس
        </label>
        <textarea
          name="address"
          required
          rows={3}
          className="w-full border border-gray-300 hover:border-gray-400 rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          placeholder="آدرس کامل خود را وارد کنید"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          توضیحات (اختیاری)
        </label>
        <textarea
          name="notes"
          rows={2}
          className="w-full border border-gray-300 hover:border-gray-400 rounded-xl px-4 py-2.5 text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          placeholder="توضیحات اضافی برای سفارش"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>
      )}

      <Button type="submit" loading={pending} className="w-full">
        {pending ? "در حال ثبت سفارش..." : "ثبت سفارش"}
      </Button>
    </form>
  );
}
