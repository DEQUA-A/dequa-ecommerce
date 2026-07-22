"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface SortSelectorProps {
  current: string;
}

export function SortSelector({ current }: SortSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-500">مرتب‌سازی:</label>
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        className="text-xs md:text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
      >
        <option value="newest">جدیدترین</option>
        <option value="price-asc">ارزان‌ترین</option>
        <option value="price-desc">گران‌ترین</option>
      </select>
    </div>
  );
}
