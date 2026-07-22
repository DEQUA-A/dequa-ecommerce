import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { SortSelector } from "@/components/products/SortSelector";
import { ChevronLeft, ChevronRight, Slash } from "lucide-react";

export const metadata: Metadata = {
  title: "محصولات",
  description: "مشاهده و خرید انواع محصولات با بهترین قیمت‌ها. دسته‌بندی‌های متنوع، برندهای معتبر و تخفیف‌های ویژه.",
};

interface Props {
  searchParams: Promise<{ q?: string; category?: string; brand?: string; minPrice?: string; maxPrice?: string; page?: string; sort?: string }>;
}

const ITEMS_PER_PAGE = 12;

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);
  const currentSort = params.sort || "newest";

  const where: Record<string, unknown> = { status: "ACTIVE" };

  if (params.q) {
    where.name = { contains: params.q };
  }
  if (params.category) {
    where.category = { slug: params.category };
  }
  if (params.brand) {
    where.brand = { slug: params.brand };
  }
  if (params.minPrice || params.maxPrice) {
    const minVal = Number(params.minPrice);
    const maxVal = Number(params.maxPrice);
    const priceFilter: Record<string, number> = {};
    if (params.minPrice && !isNaN(minVal)) priceFilter.gte = minVal;
    if (params.maxPrice && !isNaN(maxVal)) priceFilter.lte = maxVal;
    if (Object.keys(priceFilter).length > 0) {
      where.OR = [{ price: priceFilter }, { discountPrice: priceFilter }];
    }
  }

  const orderBy: Record<string, string> =
    currentSort === "price-asc" ? { price: "asc" } :
    currentSort === "price-desc" ? { price: "desc" } :
    { createdAt: "desc" };

  const [products, totalCount, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where: where as any,
      include: { images: true, category: true },
      orderBy: orderBy as any,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.product.count({ where: where as any }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  function buildPageUrl(page: number) {
    const entries = Object.entries({ ...params, page: page > 1 ? String(page) : undefined }).filter(([, v]) => v);
    const qs = new URLSearchParams(entries as string[][]).toString();
    return `/products${qs ? `?${qs}` : ""}`;
  }

  const hasFilters = params.q || params.category || params.brand || params.minPrice || params.maxPrice;

  const paginationPages: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) paginationPages.push(i);
  } else {
    paginationPages.push(1);
    if (currentPage > 3) paginationPages.push("ellipsis");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      paginationPages.push(i);
    }
    if (currentPage < totalPages - 2) paginationPages.push("ellipsis");
    paginationPages.push(totalPages);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">خانه</Link>
        <Slash className="w-3 h-3 text-gray-300" />
        <span className="text-gray-700 font-medium">محصولات</span>
        {params.q && (
          <>
            <Slash className="w-3 h-3 text-gray-300" />
            <span className="text-gray-500">جستجو: {params.q}</span>
          </>
        )}
        {params.category && (
          <>
            <Slash className="w-3 h-3 text-gray-300" />
            <span className="text-gray-500">{categories.find(c => c.slug === params.category)?.name || params.category}</span>
          </>
        )}
      </nav>

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="w-full md:w-56 shrink-0">
          <ProductFilters categories={categories} brands={brands} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">محصولات</h1>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                {totalCount.toLocaleString("fa-IR")} محصول
                {hasFilters && (
                  <Link href="/products" className="text-primary hover:text-primary-hover mr-2 font-medium transition-colors">
                    حذف فیلترها
                  </Link>
                )}
              </p>
            </div>
            <SortSelector current={currentSort} />
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 md:py-24 animate-fade-in-up">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-1.414 1.414a1 1 0 01-.707.293h-2.343a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 009.293 13H6" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">محصولی یافت نشد</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                محصولی با مشخصات مورد نظر شما وجود ندارد. لطفا فیلترهای دیگری را امتحان کنید.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-hover transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.97]"
              >
                مشاهده همه محصولات
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} discountPrice={product.discountPrice} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10 md:mt-14">
              {currentPage > 1 && (
                <Link
                  href={buildPageUrl(currentPage - 1)}
                  className="flex items-center gap-1 px-3 md:px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.97]"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span className="hidden md:inline">قبلی</span>
                </Link>
              )}
              <div className="flex items-center gap-1.5">
                {paginationPages.map((page, idx) =>
                  page === "ellipsis" ? (
                    <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-xs text-gray-400">...</span>
                  ) : (
                    <Link
                      key={page}
                      href={buildPageUrl(page)}
                      className={`w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 ${
                        page === currentPage
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "hover:bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {page.toLocaleString("fa-IR")}
                    </Link>
                  )
                )}
              </div>
              {currentPage < totalPages && (
                <Link
                  href={buildPageUrl(currentPage + 1)}
                  className="flex items-center gap-1 px-3 md:px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.97]"
                >
                  <span className="hidden md:inline">بعدی</span>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
