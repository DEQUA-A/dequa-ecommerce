import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowLeft, Star, ShoppingBag, Truck, Headset, ShieldCheck, BadgePercent, Sparkles } from "lucide-react";

export default async function HomePage() {
  const [featured, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE", featured: true },
      include: { images: true, category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  const heroBrands = brands.slice(0, 6);

  return (
    <>
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden min-h-[600px] md:min-h-[700px] flex items-center">
        <div className="absolute inset-0 opacity-[0.15]" style={{
          backgroundImage: "radial-gradient(circle at 20% 40%, rgba(231,76,60,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 60%, rgba(102,126,234,0.3) 0%, transparent 50%)",
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }} />
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2 text-primary bg-primary/15 backdrop-blur-sm w-fit px-4 py-1.5 rounded-full text-sm mb-6 border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                تخفیف‌های ویژه فصل
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
                فروشگاه <span className="text-primary">من</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-lg">
                بهترین محصولات با بهترین قیمت‌ها. تضمین اصالت، کیفیت و تحویل سریع در سراسر کشور.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="bg-primary hover:bg-primary-hover text-white px-7 py-3.5 rounded-xl font-bold transition-all duration-200 inline-flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>خرید کنید</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <Link
                  href="/products?category=new"
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-7 py-3.5 rounded-xl font-bold transition-all duration-200 border border-white/20 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  محصولات جدید
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-[40px] rotate-6" />
                <div className="absolute inset-4 bg-gradient-to-br from-gray-800 to-gray-700 rounded-[32px] border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <Star className="w-16 h-16 text-primary mx-auto mb-4 fill-current" />
                    <p className="text-2xl font-bold">تا ۵۰٪ تخفیف</p>
                    <p className="text-sm text-gray-400">تخفیف‌های ویژه فصل</p>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg animate-scale-in" style={{ animationDelay: "0.5s" }}>
                  <BadgePercent className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg animate-scale-in" style={{ animationDelay: "0.7s" }}>
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {brands.length > 0 && (
        <section className="border-b bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 py-5 flex items-center justify-center flex-wrap gap-x-8 gap-y-3">
            {heroBrands.map((b, i) => (
              <Link
                key={b.id}
                href={`/products?brand=${b.slug}`}
                className="text-gray-400 hover:text-primary font-bold text-sm transition-colors tracking-wide"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {b.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">محصولات ویژه</h2>
              <p className="text-sm text-gray-500 mt-1">پرطرفدارترین محصولات فروشگاه</p>
            </div>
            <Link href="/products" className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1 transition-colors">
              مشاهده همه <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} {...product} discountPrice={product.discountPrice} />
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="bg-gray-50 py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">دسته‌بندی محصولات</h2>
              <p className="text-sm text-gray-500">از بین دسته‌بندی‌های متنوع ما انتخاب کنید</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
              {categories.map((cat, i) => {
                const colors = [
                  "from-red-500 to-red-400",
                  "from-blue-500 to-blue-400",
                  "from-emerald-500 to-emerald-400",
                  "from-purple-500 to-pink-400",
                ];
                const icons = [Sparkles, ShoppingBag, Star, BadgePercent];
                const Icon = icons[i % icons.length];
                return (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className={`bg-gradient-to-br ${colors[i % colors.length]} text-white rounded-2xl p-5 md:p-6 hover:scale-[1.03] hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
                  >
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                    <Icon className="w-5 h-5 md:w-6 md:h-6 mb-3 opacity-80" />
                    <h3 className="font-bold text-base md:text-lg mb-1 relative">{cat.name}</h3>
                    {cat.description && <p className="text-xs md:text-sm opacity-80 leading-relaxed relative">{cat.description}</p>}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="relative bg-gradient-to-l from-primary via-primary-hover to-primary text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 30% 50%, white 0%, transparent 50%), radial-gradient(circle at 70% 50%, white 0%, transparent 50%)",
        }} />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <BadgePercent className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">تخفیف‌های ویژه</h2>
          <p className="text-base md:text-lg opacity-90 mb-6 max-w-lg mx-auto">
            با کد تخفیف <span className="font-bold text-white">WELCOME10</span> از ۱۰٪ تخفیف اولین خرید خود بهره‌مند شوید
          </p>
          <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-8 py-4">
            <span className="text-2xl md:text-3xl font-bold tracking-[0.2em] text-white">WELCOME10</span>
            <span className="hidden md:inline-block w-px h-8 bg-white/30" />
            <span className="text-sm opacity-80 hidden md:inline">کپی کنید</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14 md:py-20 text-center">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">چرا فروشگاه من؟</h2>
          <p className="text-sm text-gray-500">چرا مشتریان ما را انتخاب می‌کنند</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { title: "تضمین اصالت", desc: "تمام محصولات با ضمانت اصالت و سلامت فیزیکی", icon: ShieldCheck, color: "text-blue-500 bg-blue-50" },
            { title: "ارسال سریع", desc: "ارسال به سراسر کشور در کمترین زمان ممکن", icon: Truck, color: "text-green-500 bg-green-50" },
            { title: "پشتیبانی ۲۴/۷", desc: "تیم پشتیبانی در تمام ساعات شبانه‌روز پاسخگو است", icon: Headset, color: "text-purple-500 bg-purple-50" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base md:text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
