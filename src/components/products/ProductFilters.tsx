"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X, Filter } from "lucide-react";
import { useState } from "react";

type FilterItem = { slug: string; name: string };

interface ProductFiltersProps {
  categories: FilterItem[];
  brands: FilterItem[];
}

const PRICE_RANGES = [
  { label: "همه قیمت‌ها", min: undefined, max: undefined },
  { label: "زیر ۱ میلیون", min: undefined, max: 1000000 },
  { label: "۱ تا ۵ میلیون", min: 1000000, max: 5000000 },
  { label: "۵ تا ۱۰ میلیون", min: 5000000, max: 10000000 },
  { label: "بالای ۱۰ میلیون", min: 10000000, max: undefined },
];

export function ProductFilters({ categories, brands }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentQ = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentBrand = searchParams.get("brand") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const q = form.get("q") as string;
    setParam("q", q.trim());
  }

  function clearAll() {
    router.push(pathname);
  }

  const hasFilters = currentQ || currentCategory || currentBrand || currentMinPrice || currentMaxPrice;

  const activePriceRange = PRICE_RANGES.find(
    (r) => String(r.min || "") === currentMinPrice && String(r.max || "") === currentMaxPrice
  );

  const content = (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="relative">
        <input
          name="q"
          defaultValue={currentQ}
          placeholder="جستجوی محصول..."
          className="w-full border border-gray-300 hover:border-gray-400 rounded-xl pr-10 pl-4 py-2.5 text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </form>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          پاک کردن فیلترها
        </button>
      )}

      <div>
        <h4 className="flex items-center gap-1 font-bold text-sm mb-3">
          <SlidersHorizontal className="w-4 h-4" />
          دسته‌بندی
        </h4>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setParam("category", currentCategory === cat.slug ? "" : cat.slug)}
              className={`block w-full text-right px-3 py-1.5 rounded-lg text-sm transition-colors ${
                currentCategory === cat.slug
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-bold text-sm mb-3">برند</h4>
        <div className="space-y-1">
          {brands.map((b) => (
            <button
              key={b.slug}
              onClick={() => setParam("brand", currentBrand === b.slug ? "" : b.slug)}
              className={`block w-full text-right px-3 py-1.5 rounded-lg text-sm transition-colors ${
                currentBrand === b.slug
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-bold text-sm mb-3">محدوده قیمت</h4>
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() => {
                if (activePriceRange?.label === range.label) {
                  setParam("minPrice", "");
                  setParam("maxPrice", "");
                } else {
                  setParam("minPrice", range.min ? String(range.min) : "");
                  setParam("maxPrice", range.max ? String(range.max) : "");
                }
              }}
              className={`block w-full text-right px-3 py-1.5 rounded-lg text-sm transition-colors ${
                activePriceRange?.label === range.label
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border rounded-xl px-4 py-2.5 hover:bg-gray-50 transition-colors mb-4"
      >
        <Filter className="w-4 h-4" />
        فیلترها
        {hasFilters && (
          <span className="w-2 h-2 rounded-full bg-primary" />
        )}
      </button>

      <div className="hidden md:block">{content}</div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 md:hidden shadow-xl animate-slide-in-left overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <span className="font-bold text-sm flex items-center gap-1">
                <Filter className="w-4 h-4" />
                فیلترها
              </span>
              {hasFilters && (
                <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-600">
                  پاک کردن همه
                </button>
              )}
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="بستن"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">{content}</div>
          </div>
        </>
      )}
    </>
  );
}
