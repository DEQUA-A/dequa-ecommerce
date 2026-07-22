import Link from "next/link";
import { Sparkles, ShoppingBag, Star, BadgePercent, Layers, Palette, Zap, Gift } from "lucide-react";

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
}

interface CategoryShowcaseProps {
  categories: Category[];
}

const colors = [
  { bg: "from-red-600 to-red-400", shadow: "shadow-red-500/25" },
  { bg: "from-blue-600 to-blue-400", shadow: "shadow-blue-500/25" },
  { bg: "from-emerald-600 to-emerald-400", shadow: "shadow-emerald-500/25" },
  { bg: "from-purple-600 to-pink-400", shadow: "shadow-purple-500/25" },
  { bg: "from-orange-600 to-amber-400", shadow: "shadow-orange-500/25" },
  { bg: "from-teal-600 to-cyan-400", shadow: "shadow-teal-500/25" },
  { bg: "from-violet-600 to-indigo-400", shadow: "shadow-violet-500/25" },
  { bg: "from-rose-600 to-pink-400", shadow: "shadow-rose-500/25" },
];

const icons = [Sparkles, ShoppingBag, Star, BadgePercent, Layers, Palette, Zap, Gift];

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-gray-50/80 py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10 space-y-1">
          <span className="text-primary text-sm font-medium">دسته‌بندی‌ها</span>
          <h2 className="text-2xl md:text-3xl font-bold">خرید بر اساس دسته‌بندی</h2>
          <p className="text-sm text-gray-500">از بین دسته‌بندی‌های متنوع ما انتخاب کنید</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {categories.map((cat, i) => {
            const color = colors[i % colors.length];
            const Icon = icons[i % icons.length];
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`group bg-gradient-to-br ${color.bg} text-white rounded-2xl p-5 md:p-6 hover:scale-[1.03] hover:shadow-xl ${color.shadow} transition-all duration-300 relative overflow-hidden min-h-[140px] md:min-h-[160px] flex flex-col justify-end`}
              >
                <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/5 rounded-full" />
                <div className="relative">
                  <Icon className="w-6 h-6 md:w-7 md:h-7 mb-3 opacity-90" />
                  <h3 className="font-bold text-base md:text-lg mb-0.5">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-xs md:text-sm opacity-80 leading-relaxed line-clamp-2">{cat.description}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
