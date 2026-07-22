import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowLeft, Sparkles } from "lucide-react";

interface ProductImage {
  url: string;
  alt: string;
}

interface Category {
  name: string;
  slug: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  images: ProductImage[];
  category: Category;
}

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-14 md:py-20">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>پرطرفدارترین‌ها</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">محصولات ویژه</h2>
        </div>
        <Link
          href="/products"
          className="group text-sm text-primary hover:text-primary-hover font-medium flex items-center gap-1.5 transition-colors"
        >
          مشاهده همه
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} discountPrice={product.discountPrice} />
        ))}
      </div>
    </section>
  );
}
