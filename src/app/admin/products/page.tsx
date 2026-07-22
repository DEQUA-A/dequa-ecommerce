import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus, Search, Edit, Package } from "lucide-react";
import { deleteProduct } from "@/lib/actions/products";
import { DeleteButton } from "@/components/admin/DeleteButton";

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  ACTIVE: { label: "فعال", color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
  DRAFT: { label: "پیش‌نویس", color: "bg-gray-50 text-gray-600 border-gray-200", dot: "bg-gray-500" },
  OUT_OF_STOCK: { label: "ناموجود", color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  DISCONTINUED: { label: "متوقف شده", color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
};

async function deleteProductAction(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await deleteProduct(id);
}

export default async function AdminProductsPage(props: {
  searchParams: Promise<{ q?: string; category?: string; status?: string }>;
}) {
  const { q, category, status } = await props.searchParams;

  const where: Record<string, unknown> = {};
  if (q) where.name = { contains: q };
  if (category) where.categoryId = category;
  if (status) where.status = status;

  const products = await prisma.product.findMany({
    where,
    include: { category: true, brand: true, images: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">محصولات</h1>
          <p className="text-sm text-gray-500">{products.length.toLocaleString("fa-IR")} محصول</p>
        </div>
        <Link
          href="/admin/products/create"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-primary-hover transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.97]"
        >
          <Plus className="w-4 h-4" />
          محصول جدید
        </Link>
      </div>

      <form className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            name="q"
            defaultValue={q}
            placeholder="جستجوی محصول..."
            className="w-full pr-10 pl-4 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          name="category"
          defaultValue={category || ""}
          className="px-4 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
        >
          <option value="">همه دسته‌بندی‌ها</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={status || ""}
          className="px-4 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="ACTIVE">فعال</option>
          <option value="DRAFT">پیش‌نویس</option>
          <option value="OUT_OF_STOCK">ناموجود</option>
          <option value="DISCONTINUED">متوقف شده</option>
        </select>
        <button className="px-5 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-bold hover:bg-gray-700 transition-all duration-200 active:scale-[0.97] flex items-center gap-2">
          <Search className="w-4 h-4" />
          جستجو
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">محصول</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">دسته‌بندی</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">برند</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">قیمت</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">موجودی</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">وضعیت</th>
                <th className="text-left px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <Package className="w-12 h-12 mb-3 text-gray-200" />
                      <p className="text-sm font-bold">محصولی یافت نشد</p>
                      <p className="text-xs mt-1">شرایط فیلتر را تغییر دهید</p>
                    </div>
                  </td>
                </tr>
              )}
              {products.map((product) => {
                const sc = statusConfig[product.status] || statusConfig.DRAFT;
                return (
                  <tr key={product.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {product.images[0] && (
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <span className="font-bold text-sm">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 text-sm">{product.category.name}</td>
                    <td className="px-4 py-3.5 text-gray-500 text-sm">{product.brand.name}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-sm">{product.price.toLocaleString("fa-IR")}</span>
                      {product.discountPrice && (
                        <span className="text-red-500 mr-1.5 text-[10px] line-through">
                          {product.discountPrice.toLocaleString("fa-IR")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-bold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${sc.color}`}>
                        <span className={`w-1 h-1 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-95"
                          title="ویرایش"
                        >
                          <Edit className="w-4 h-4 text-gray-500" />
                        </Link>
                        <DeleteButton action={deleteProductAction} id={product.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
