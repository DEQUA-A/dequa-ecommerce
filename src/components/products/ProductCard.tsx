import Link from "next/link";

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

  return (
    <Link
      href={`/products/${slug}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 flex flex-col animate-fade-in-up"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {Math.round(((price - discountPrice!) / price) * 100)}%-
          </span>
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-sm font-bold px-4 py-2 rounded-full">ناموجود</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-gray-500 mb-1">{category.name}</span>
        <h3 className="font-bold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        <div className="mt-auto">
          {hasDiscount ? (
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-red-500">{formatPrice(discountPrice!)}</span>
              <span className="text-sm text-gray-400 line-through">{formatPrice(price)}</span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-900">{formatPrice(price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
