import Link from "next/link";
import { BadgePercent, Clock, Sparkles } from "lucide-react";

export function FlashSaleBanner() {
  return (
    <section className="relative bg-gradient-to-l from-primary via-primary-hover to-primary text-white overflow-hidden">
      <div className="absolute inset-0 opacity-[0.12]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M20 20L0 20L20 0L20 20Z'/%3E%3C/g%3E%3C/svg%3E\")",
        backgroundSize: "40px 40px",
      }} />
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <BadgePercent className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-white/80 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>پیشنهاد ویژه و محدود</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold">تخفیف‌های ویژه فصل</h2>
              <p className="text-sm text-white/70 mt-1">
                با کد <span className="font-bold text-white">WELCOME10</span> از ۱۰٪ تخفیف اولین خرید بهره‌مند شوید
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-6 py-3 md:px-8 md:py-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-xl md:text-2xl font-bold tracking-[0.15em] text-white">WELCOME10</span>
              </div>
            </div>
            <Link
              href="/products"
              className="bg-white text-primary hover:bg-gray-100 px-6 py-3 md:px-7 md:py-3.5 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] shrink-0"
            >
              خرید کنید
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
