import { ShieldCheck, Truck, Headset, RefreshCw } from "lucide-react";

const trustItems = [
  {
    title: "تضمین اصالت کالا",
    desc: "تمام محصولات با ضمانت اصالت و سلامت فیزیکی تحویل داده می‌شوند",
    icon: ShieldCheck,
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "ارسال سریع و رایگان",
    desc: "ارسال به سراسر کشور در کمترین زمان ممکن با بسته‌بندی حرفه‌ای",
    icon: Truck,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "پشتیبانی ۲۴ ساعته",
    desc: "تیم پشتیبانی در تمام ساعات شبانه‌روز پاسخگوی سوالات شماست",
    icon: Headset,
    color: "text-purple-600 bg-purple-50",
  },
  {
    title: "بازگشت کالا",
    desc: "امکان بازگشت کالا تا ۷ روز در صورت عدم رضایت از خرید",
    icon: RefreshCw,
    color: "text-orange-600 bg-orange-50",
  },
];

export function TrustSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-14 md:py-20">
      <div className="text-center mb-10 space-y-1">
        <span className="text-primary text-sm font-medium">چرا فروشگاه من؟</span>
        <h2 className="text-2xl md:text-3xl font-bold">دلیل اعتماد مشتریان ما</h2>
        <p className="text-sm text-gray-500">چرا هزاران مشتری ما را انتخاب می‌کنند</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {trustItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group bg-white border border-gray-100 rounded-2xl p-5 md:p-6 hover:shadow-lg hover:border-gray-200 transition-all duration-300 text-center"
            >
              <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1.5">{item.title}</h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
