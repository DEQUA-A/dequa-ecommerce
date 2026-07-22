import Link from "next/link";
import { Heart } from "lucide-react";

type ProductImage = { url: string; alt: string };
type Category = { name: string; slug: string };

interface ProductCardProps {
  slug: string;
  name: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  images: ProductImage[];
  category: Category;
}

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR") + " تومان";
}

export function ProductCard({ slug, name, price, discountPrice, stock, images, category }: ProductCardProps) {
  const hasDiscount = discountPrice !== null && discountPrice < price;
  const inStock = stock > 0;
  const imageUrl = images[0]?.url || "/placeholder.svg";
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice!) / price) * 100) : 0;

  return (
    <Link
      href={`/products/${slug}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col animate-fade-in-up relative"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-gradient-to-l from-red-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-0.5">
            {discountPercent}%
          </span>
        )}

        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-white/90 text-gray-800 text-sm font-bold px-5 py-2 rounded-xl shadow-lg">ناموجود</span>
          </div>
        )}

        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="flex items-center justify-center w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </span>
        </div>
      </div>

      <div className="p-3 md:p-4 flex flex-col flex-1 gap-1">
        <span className="text-[10px] md:text-xs text-gray-400 tracking-wide">{category.name}</span>
        <h3 className="font-bold text-xs md:text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        <div className="mt-auto pt-2">
          {hasDiscount ? (
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm md:text-lg font-bold text-red-500">{formatPrice(discountPrice!)}</span>
                <span className="text-[10px] md:text-xs text-gray-400 line-through">{formatPrice(price)}</span>
              </div>
            </div>
          ) : (
            <span className="text-sm md:text-lg font-bold text-gray-900">{formatPrice(price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
