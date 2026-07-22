import Link from "next/link";

interface Brand {
  id: string;
  name: string;
  slug: string;
}

interface BrandShowcaseProps {
  brands: Brand[];
}

export function BrandShowcase({ brands }: BrandShowcaseProps) {
  if (brands.length === 0) return null;

  return (
    <section className="border-y border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="text-center mb-6">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">برندهای معتبر</span>
        </div>
        <div className="flex items-center justify-center flex-wrap gap-x-10 gap-y-4 md:gap-x-14">
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/products?brand=${b.slug}`}
              className="text-gray-300 hover:text-primary font-black text-lg md:text-xl transition-all duration-300 hover:scale-110 tracking-tight"
            >
              {b.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
