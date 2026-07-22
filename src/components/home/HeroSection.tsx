"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingBag, Sparkles, Truck, ShieldCheck, Headset } from "lucide-react";

interface Brand {
  name: string;
  slug: string;
}

interface HeroSectionProps {
  brands: Brand[];
}

export function HeroSection({ brands }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle at 15% 30%, rgba(231,76,60,0.5) 0%, transparent 45%), radial-gradient(circle at 85% 70%, rgba(102,126,234,0.35) 0%, transparent 45%)",
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }} />

      <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="animate-fade-in-up space-y-8">
            <div className="flex items-center gap-2 w-fit">
              <span className="flex items-center gap-2 text-primary bg-primary/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                تخفیف‌های ویژه فصل
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-none tracking-tight">
                <span className="text-white">جدیدترین</span>
                <br />
                <span className="text-primary">محصولات دیجیتال</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-lg font-medium">
                با بهترین قیمت و ضمانت اصالت کالا
              </p>
            </div>

            <p className="text-base text-gray-400 leading-relaxed max-w-md">
              از جدیدترین تکنولوژی‌ها تا پرطرفدارترین برندها، همه را با بهترین کیفیت و سریع‌ترین ارسال تجربه کنید.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="group bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 inline-flex items-center gap-2 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:scale-[0.97] text-base"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
                <span>خرید کنید</span>
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </Link>
              <Link
                href="/products?sort=newest"
                className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 border border-white/20 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.97] text-base"
              >
                محصولات جدید
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2.5 text-gray-400 text-sm">
                <Truck className="w-4 h-4 text-primary" />
                <span>ارسال سریع</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-400 text-sm">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>تضمین اصالت</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-400 text-sm">
                <Headset className="w-4 h-4 text-primary" />
                <span>پشتیبانی ۲۴/۷</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-80 h-80 bg-primary/20 rounded-[60px] rotate-12 blur-3xl" />
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[40px] border border-white/10 p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-gray-700/50 rounded-2xl flex items-center justify-center border border-white/5 hover:border-primary/30 transition-colors duration-300">
                    <ShoppingBag className="w-10 h-10 text-gray-500" />
                  </div>
                  <div className="aspect-square bg-gray-700/50 rounded-2xl flex items-center justify-center border border-white/5 hover:border-primary/30 transition-colors duration-300">
                    <ShoppingBag className="w-10 h-10 text-gray-500" />
                  </div>
                  <div className="aspect-square bg-gray-700/50 rounded-2xl flex items-center justify-center border border-white/5 hover:border-primary/30 transition-colors duration-300">
                    <ShoppingBag className="w-10 h-10 text-gray-500" />
                  </div>
                  <div className="aspect-square bg-gray-700/50 rounded-2xl flex items-center justify-center border border-white/5 hover:border-primary/30 transition-colors duration-300">
                    <ShoppingBag className="w-10 h-10 text-gray-500" />
                  </div>
                </div>
                <div className="absolute -bottom-5 -left-5 bg-gradient-to-br from-primary to-primary-hover rounded-2xl px-5 py-3.5 shadow-2xl">
                  <p className="text-xl font-black">تا ۵۰٪</p>
                  <p className="text-xs opacity-80">تخفیف ویژه</p>
                </div>
                <div className="absolute -top-4 -right-4 w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-xl animate-scale-in">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {brands.length > 0 && (
        <div className="border-t border-white/5 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-center flex-wrap gap-x-10 gap-y-2">
            {brands.map((b) => (
              <Link
                key={b.slug}
                href={`/products?brand=${b.slug}`}
                className="text-gray-500 hover:text-primary font-bold text-sm transition-colors tracking-wider uppercase"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
