import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/products/ProductCard";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { CheckCircle, XCircle, ChevronLeft, Slash, ShieldCheck, Truck, RotateCcw } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR") + " تومان";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug }, select: { name: true, description: true } });
  if (!product) return {};
  const desc = (product.description ?? "").slice(0, 160);
  return {
    title: product.name,
    description: desc,
    openGraph: {
      title: product.name,
      description: desc,
    },
    twitter: {
      title: product.name,
      description: desc,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true, category: true, brand: true },
  });

  if (!product || product.status !== "ACTIVE") notFound();

  const hasDiscount = product.discountPrice !== null && product.discountPrice < product.price;
  const inStock = product.stock > 0;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) : 0;

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: "ACTIVE",
    },
    include: { images: true, category: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">خانه</Link>
        <Slash className="w-3 h-3 text-gray-300" />
        <Link href="/products" className="hover:text-primary transition-colors">محصولات</Link>
        <Slash className="w-3 h-3 text-gray-300" />
        {product.category && (
          <>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary transition-colors">
              {product.category.name}
            </Link>
            <Slash className="w-3 h-3 text-gray-300" />
          </>
        )}
        <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-14 mb-16">
        <div className="space-y-4 animate-fade-in-up">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm relative group">
            <img
              src={product.images[0]?.url || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {hasDiscount && (
              <span className="absolute top-4 right-4 bg-gradient-to-l from-red-500 to-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-xl shadow-lg">
                {discountPercent}% تخفیف
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <div key={img.id} className={`aspect-square w-16 md:w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${idx === 0 ? "border-primary" : "border-gray-200 hover:border-gray-300"}`}>
                  <img src={img.url} alt={img.alt || product.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex items-center gap-3 mb-4">
            {product.brand && (
              <Link
                href={`/products?brand=${product.brand.slug}`}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full transition-colors font-medium"
              >
                {product.brand.name}
              </Link>
            )}
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-xs bg-primary/5 hover:bg-primary/10 text-primary px-3 py-1 rounded-full transition-colors font-medium"
              >
                {product.category.name}
              </Link>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4">{product.name}</h1>

          <div className="flex items-center gap-1 mb-6">
            {inStock ? (
              <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                موجود در انبار
                <span className="text-green-400">({product.stock.toLocaleString("fa-IR")} عدد)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-red-500 bg-red-50 px-3 py-1 rounded-full font-medium">
                <XCircle className="w-3.5 h-3.5" />
                ناموجود
              </span>
            )}
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 md:p-6 mb-6">
            {hasDiscount ? (
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl md:text-4xl font-bold text-red-500">{formatPrice(product.discountPrice!)}</span>
                <span className="text-base md:text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {discountPercent}%-
                </span>
              </div>
            ) : (
              <span className="text-3xl md:text-4xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed mb-6">
            {product.description}
          </div>

          <div className="mb-6">
            <AddToCartButton
              productId={product.id}
              name={product.name}
              price={product.price}
              discountPrice={product.discountPrice}
              image={product.images[0]?.url || "/placeholder.svg"}
              stock={product.stock}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {[
              { icon: ShieldCheck, label: "ضمانت اصالت", color: "text-blue-500" },
              { icon: Truck, label: "ارسال سریع", color: "text-green-500" },
              { icon: RotateCcw, label: "۷ روز بازگشت", color: "text-purple-500" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex flex-col items-center gap-1.5 bg-gray-50 rounded-xl py-3 px-2">
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-[10px] md:text-xs text-gray-500 font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">محصولات مرتبط</h2>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">محصولات مشابه در دسته {product.category?.name}</p>
            </div>
            {product.category && (
              <Link href={`/products?category=${product.category.slug}`} className="text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1 transition-colors">
                مشاهده همه <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} {...p} discountPrice={p.discountPrice} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
