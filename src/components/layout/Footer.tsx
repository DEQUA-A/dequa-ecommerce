"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="bg-gradient-to-l from-primary/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold">از تخفیف‌ها باخبر شوید!</h3>
              <p className="text-gray-400 text-sm mt-1">
                با عضویت در خبرنامه، اولین نفری باشید که از تخفیف‌ها مطلع می‌شوید.
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 shrink-0"
              >
                عضویت
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">م</span>
              </div>
              <h3 className="text-lg font-bold">فروشگاه من</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              بهترین محصولات با بهترین قیمت‌ها. تضمین اصالت و کیفیت با سال‌ها تجربه در فروش آنلاین.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm tracking-wide">دسترسی سریع</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">خانه</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">محصولات</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">سبد خرید</Link></li>
              <li><Link href="/products?category=new" className="hover:text-white transition-colors">تخفیف‌ها</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm tracking-wide">حساب کاربری</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link href="/account" className="hover:text-white transition-colors">پروفایل</Link></li>
              <li><Link href="/account/orders" className="hover:text-white transition-colors">سفارشات</Link></li>
              <li><Link href="/account/wishlist" className="hover:text-white transition-colors">علاقه‌مندی‌ها</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm tracking-wide">تماس با ما</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                ایمیل: info@example.com
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                تلفن: ۰۲۱-۱۲۳۴۵۶۷۸
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                ساعات پاسخگویی: ۸ صبح تا ۸ شب
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {year.toLocaleString("fa-IR")} فروشگاه من. تمامی حقوق محفوظ است.
          </p>
          <p className="text-[10px] text-gray-600/50 tracking-wider font-mono">
            DEQUA | MMADI
          </p>
          <div className="flex items-center gap-4 text-gray-500">
            <span className="text-xs">نماد اعتماد</span>
            <span className="text-xs">پرداخت امن</span>
            <span className="text-xs">ضمانت بازگشت</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
