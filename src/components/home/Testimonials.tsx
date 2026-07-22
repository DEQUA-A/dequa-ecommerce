import { Star, MessageCircle } from "lucide-react";

const reviews = [
  {
    name: "سارا محمدی",
    role: "خریدار محصولات دیجیتال",
    text: "واقعاً از کیفیت محصولات راضی هستم. بسته‌بندی عالی و ارسال سریع. حتماً دوباره خرید خواهم کرد.",
    rating: 5,
    initial: "س",
    color: "bg-blue-500",
  },
  {
    name: "امیر حسینی",
    role: "فروشنده آنلاین",
    text: "بهترین فروشگاه اینترنتی که تا حالا دیدم. قیمت‌ها منصفانه و پشتیبانی عالی. خرید مطمئن رو تجربه کنید.",
    rating: 5,
    initial: "ا",
    color: "bg-emerald-500",
  },
  {
    name: "مریم احمدی",
    role: "کاربر حرفه‌ای",
    text: "تنوع محصولات فوق‌العاده است. هر چی نیاز دارم پیدا می‌شه. تجربه کاربری عالی و تحویل به موقع.",
    rating: 5,
    initial: "م",
    color: "bg-purple-500",
  },
  {
    name: "رضا کریمی",
    role: "مشتری دائمی",
    text: "چندین بار خرید کردم و همیشه راضی بودم. تضمین اصالت کالا واقعاً ارزشمند است. پیشنهاد می‌کنم.",
    rating: 4,
    initial: "ر",
    color: "bg-orange-500",
  },
];

export function Testimonials() {
  return (
    <section className="bg-gray-50/80 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 space-y-1.5">
          <div className="flex items-center justify-center gap-2 text-primary text-sm font-medium tracking-wider">
            <MessageCircle className="w-4 h-4" />
            <span>نظرات مشتریان</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">آنچه مشتریان ما می‌گویند</h2>
          <p className="text-sm text-gray-500">رضایت شما بزرگترین افتخار ماست</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="group bg-white border border-gray-100 rounded-2xl p-6 md:p-8 hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className={`w-10 h-10 ${review.color} rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {review.initial}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{review.name}</p>
                  <p className="text-xs text-gray-400 truncate">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
