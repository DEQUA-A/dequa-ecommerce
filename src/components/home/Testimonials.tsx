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
    <section className="bg-gray-50/80 py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10 space-y-1">
          <div className="flex items-center justify-center gap-2 text-primary text-sm font-medium">
            <MessageCircle className="w-4 h-4" />
            <span>نظرات مشتریان</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">آنچه مشتریان ما می‌گویند</h2>
          <p className="text-sm text-gray-500">رضایت شما بزرگترین افتخار ماست</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="group bg-white border border-gray-100 rounded-2xl p-5 md:p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                <div className={`w-9 h-9 ${review.color} rounded-xl flex items-center justify-center text-white text-sm font-bold`}>
                  {review.initial}
                </div>
                <div>
                  <p className="font-bold text-sm">{review.name}</p>
                  <p className="text-[10px] text-gray-400">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
