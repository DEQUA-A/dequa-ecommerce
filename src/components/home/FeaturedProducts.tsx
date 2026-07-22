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
    <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span className="tracking-wider">پرطرفدارترین‌ها</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">محصولات ویژه</h2>
          <p className="text-sm text-gray-500">محصولات برگزیده و پرطرفدار فروشگاه</p>
        </div>
        <Link
          href="/products"
          className="group text-sm text-primary hover:text-primary-hover font-bold flex items-center gap-1.5 transition-colors pb-1"
        >
          مشاهده همه
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, i) => (
          <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <ProductCard {...product} discountPrice={product.discountPrice} />
          </div>
        ))}
      </div>
    </section>
  );
}
