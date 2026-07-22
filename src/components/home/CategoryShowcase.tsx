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
  { bg: "from-red-600 to-red-500", shadow: "shadow-red-500/20" },
  { bg: "from-blue-600 to-blue-500", shadow: "shadow-blue-500/20" },
  { bg: "from-emerald-600 to-emerald-500", shadow: "shadow-emerald-500/20" },
  { bg: "from-purple-600 to-pink-500", shadow: "shadow-purple-500/20" },
  { bg: "from-orange-600 to-amber-500", shadow: "shadow-orange-500/20" },
  { bg: "from-teal-600 to-cyan-500", shadow: "shadow-teal-500/20" },
  { bg: "from-violet-600 to-indigo-500", shadow: "shadow-violet-500/20" },
  { bg: "from-rose-600 to-pink-500", shadow: "shadow-rose-500/20" },
];

const icons = [Sparkles, ShoppingBag, Star, BadgePercent, Layers, Palette, Zap, Gift];

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (categories.length === 0) return null;

  return (
    <section className="bg-gray-50/80 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 space-y-1.5">
          <span className="text-primary text-sm font-medium tracking-wider">دسته‌بندی‌ها</span>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight">خرید بر اساس دسته‌بندی</h2>
          <p className="text-sm text-gray-500">از بین دسته‌بندی‌های متنوع ما انتخاب کنید</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, i) => {
            const color = colors[i % colors.length];
            const Icon = icons[i % icons.length];
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`group bg-gradient-to-br ${color.bg} text-white rounded-2xl p-6 md:p-8 hover:scale-[1.03] hover:shadow-xl ${color.shadow} transition-all duration-300 relative overflow-hidden min-h-[160px] md:min-h-[180px] flex flex-col justify-end`}
              >
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />
                <div className="relative">
                  <Icon className="w-7 h-7 md:w-8 md:h-8 mb-4 opacity-90" />
                  <h3 className="font-bold text-lg md:text-xl mb-1">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-sm opacity-80 leading-relaxed line-clamp-2">{cat.description}</p>
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
