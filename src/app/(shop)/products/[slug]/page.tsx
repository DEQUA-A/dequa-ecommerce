import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/products/ProductCard";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { CheckCircle, XCircle, ChevronLeft } from "lucide-react";

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
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
    },
    twitter: {
      title: product.name,
      description: product.description.slice(0, 160),
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">محصولات</Link>
        <span>/</span>
        <span className="text-gray-800">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border">
            <img
              src={product.images[0]?.url || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <div key={img.id} className={`aspect-square w-20 shrink-0 rounded-xl overflow-hidden border-2 ${idx === 0 ? "border-primary" : "border-gray-200"}`}>
                  <img src={img.url} alt={img.alt || product.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.brand && (
            <Link
              href={`/products?brand=${product.brand.slug}`}
              className="text-xs text-gray-500 hover:text-primary transition-colors"
            >
              {product.brand.name}
            </Link>
          )}

          <h1 className="text-2xl md:text-3xl font-bold mt-1 mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                {product.category.name}
              </Link>
            )}
            <span className={`flex items-center gap-1 text-sm ${inStock ? "text-green-600" : "text-red-500"}`}>
              {inStock ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {inStock ? "موجود" : "ناموجود"}
            </span>
          </div>

          <div className="border-t border-b py-6 mb-6">
            {hasDiscount ? (
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-red-500">{formatPrice(product.discountPrice!)}</span>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%-
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed mb-6">
            {product.description}
          </div>

          <AddToCartButton
            productId={product.id}
            name={product.name}
            price={product.price}
            discountPrice={product.discountPrice}
            image={product.images[0]?.url || "/placeholder.svg"}
            stock={product.stock}
          />
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">محصولات مرتبط</h2>
            <Link href={`/products?category=${product.category?.slug}`} className="text-sm text-primary hover:underline flex items-center gap-1">
              مشاهده همه <ChevronLeft className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} {...p} discountPrice={p.discountPrice} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
