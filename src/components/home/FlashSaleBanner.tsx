import Link from "next/link";
import { BadgePercent, Clock, Sparkles } from "lucide-react";

export function FlashSaleBanner() {
  return (
    <section className="relative bg-gradient-to-r from-primary via-primary-hover to-primary text-white overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M20 20L0 20L20 0L20 20Z'/%3E%3C/g%3E%3C/svg%3E\")",
        backgroundSize: "40px 40px",
      }} />
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-black/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
              <BadgePercent className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-white/80 mb-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>پیشنهاد ویژه و محدود</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black">تخفیف‌های ویژه فصل</h2>
              <p className="text-sm text-white/70 mt-1.5 max-w-md">
                با کد تخفیف <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-md">WELCOME10</span> از ۱۰٪ تخفیف اولین خرید بهره‌مند شوید
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-7 py-3.5 md:px-9 md:py-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-xl md:text-3xl font-black tracking-[0.15em] text-white">WELCOME10</span>
              </div>
            </div>
            <Link
              href="/products"
              className="bg-white text-primary hover:bg-gray-100 px-7 py-3.5 md:px-8 md:py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.97] shrink-0"
            >
              خرید کنید
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
