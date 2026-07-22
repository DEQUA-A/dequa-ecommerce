import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowLeft, Star } from "lucide-react";

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
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 25% 50%, rgba(231,76,60,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(102,126,234,0.3) 0%, transparent 50%)",
        }} />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="flex items-center gap-2 text-primary bg-primary/10 w-fit px-4 py-1.5 rounded-full text-sm mb-6">
              <Star className="w-4 h-4 fill-current" />
              تخفیف‌های ویژه فصل
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
              فروشگاه <span className="text-primary">من</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
              بهترین محصولات با بهترین قیمت‌ها. تضمین اصالت، کیفیت و تحویل سریع.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl font-bold transition-all duration-200 inline-flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.97]"
              >
                <span>خرید کنید</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                href="/products?category=new"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-3.5 rounded-xl font-bold transition-all duration-200 border border-white/20 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97]"
              >
                محصولات جدید
              </Link>
            </div>
          </div>
        </div>
      </section>

      {brands.length > 0 && (
        <section className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-center flex-wrap gap-x-10 gap-y-4">
            {heroBrands.map((b) => (
              <Link
                key={b.id}
                href={`/products?brand=${b.slug}`}
                className="text-gray-500 hover:text-primary font-bold text-sm transition-colors"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">محصولات ویژه</h2>
            <Link href="/products" className="text-sm text-primary hover:underline flex items-center gap-1">
              مشاهده همه <ArrowLeft className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} {...product} discountPrice={product.discountPrice} />
            ))}
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">دسته‌بندی محصولات</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat, i) => {
                const colors = ["from-primary to-red-400", "from-secondary to-blue-400", "from-green-500 to-emerald-400", "from-purple-500 to-pink-400"];
                return (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className={`bg-gradient-to-br ${colors[i % colors.length]} text-white rounded-2xl p-6 hover:scale-[1.02] transition-transform`}
                  >
                    <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                    {cat.description && <p className="text-sm opacity-80">{cat.description}</p>}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-gradient-to-l from-primary to-primary-hover text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">تخفیف‌های ویژه</h2>
          <p className="text-lg opacity-90 mb-8">با کد تخفیف WELCOME10 از ۱۰٪ تخفیف اولین خرید خود بهره‌مند شوید</p>
          <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl px-8 py-4">
            <span className="text-2xl font-bold tracking-wider">WELCOME10</span>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-10">چرا فروشگاه من؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "تضمین اصالت", desc: "تمام محصولات با ضمانت اصالت و سلامت فیزیکی" },
            { title: "ارسال سریع", desc: "ارسال به سراسر کشور در کمترین زمان ممکن" },
            { title: "پشتیبانی ۲۴/۷", desc: "تیم پشتیبانی در تمام ساعات شبانه‌روز پاسخگو است" },
          ].map((item) => (
            <div key={item.title} className="bg-white border rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
