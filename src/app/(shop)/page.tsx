import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-to-l from-secondary to-accent text-white text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          به فروشگاه من خوش آمدید
        </h1>
        <p className="text-lg opacity-90 mb-8">
          بهترین محصولات با بهترین قیمت‌ها
        </p>
        <Link
          href="/products"
          className="inline-block bg-white text-accent font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          مشاهده محصولات
        </Link>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">محصولات ویژه</h2>
        <p className="text-center text-gray-500">
          محصولات به زودی اضافه می‌شوند...
        </p>
      </section>
    </>
  );
}
