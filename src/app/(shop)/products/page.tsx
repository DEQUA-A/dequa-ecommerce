import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  searchParams: Promise<{ q?: string; category?: string; brand?: string; minPrice?: string; maxPrice?: string; page?: string }>;
}

const ITEMS_PER_PAGE = 12;

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);

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
    const priceFilter: Record<string, number> = {};
    if (params.minPrice) priceFilter.gte = Number(params.minPrice);
    if (params.maxPrice) priceFilter.lte = Number(params.maxPrice);
    where.OR = [{ price: priceFilter }, { discountPrice: priceFilter }];
  }

  const [products, totalCount, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where: where as any,
      include: { images: true, category: true },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.product.count({ where: where as any }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">خانه</Link>
        <span>/</span>
        <span className="text-gray-800">محصولات</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-56 shrink-0">
          <ProductFilters categories={categories} brands={brands} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">محصولات</h1>
            <span className="text-sm text-gray-500">{totalCount.toLocaleString("fa-IR")} محصول</span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">محصولی یافت نشد</p>
              <Link href="/products" className="text-primary hover:underline text-sm">مشاهده همه محصولات</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} discountPrice={product.discountPrice} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12" dir="ltr">
              {currentPage > 1 && (
                <Link
                  href={`/products?page=${currentPage - 1}&q=${params.q || ""}&category=${params.category || ""}&brand=${params.brand || ""}&minPrice=${params.minPrice || ""}&maxPrice=${params.maxPrice || ""}`}
                  className="flex items-center gap-1 px-4 py-2 border rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                  قبلی
                </Link>
              )}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const start = Math.max(1, currentPage - 2);
                  const page = start + i;
                  if (page > totalPages) return null;
                  return (
                    <Link
                      key={page}
                      href={`/products?page=${page}&q=${params.q || ""}&category=${params.category || ""}&brand=${params.brand || ""}&minPrice=${params.minPrice || ""}                       &maxPrice=${params.maxPrice || ""}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                        page === currentPage
                          ? "bg-primary text-white"
                          : "hover:bg-gray-50 border"
                      }`}
                    >
                      {page.toLocaleString("fa-IR")}
                    </Link>
                  );
                })}
              </div>
              {currentPage < totalPages && (
                <Link
                  href={`/products?page=${currentPage + 1}&q=${params.q || ""}&category=${params.category || ""}&brand=${params.brand || ""}&minPrice=${params.minPrice || ""}&maxPrice=${params.maxPrice || ""}`}
                  className="flex items-center gap-1 px-4 py-2 border rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                  بعدی
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
