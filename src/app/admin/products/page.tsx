import Link from "next/link";
import { prisma } from "@/lib/db";
import { Plus, Search, Edit } from "lucide-react";
import { deleteProduct } from "@/lib/actions/products";
import { DeleteButton } from "@/components/admin/DeleteButton";

const statusBadge: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  DRAFT: "bg-gray-100 text-gray-600",
  OUT_OF_STOCK: "bg-red-100 text-red-700",
  DISCONTINUED: "bg-yellow-100 text-yellow-700",
};

const statusLabel: Record<string, string> = {
  ACTIVE: "فعال",
  DRAFT: "پیش‌نویس",
  OUT_OF_STOCK: "ناموجود",
  DISCONTINUED: "متوقف شده",
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">محصولات</h1>
        <Link
          href="/admin/products/create"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          محصول جدید
        </Link>
      </div>

      <form className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
          className="px-4 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">همه دسته‌بندی‌ها</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={status || ""}
          className="px-4 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="ACTIVE">فعال</option>
          <option value="DRAFT">پیش‌نویس</option>
          <option value="OUT_OF_STOCK">ناموجود</option>
          <option value="DISCONTINUED">متوقف شده</option>
        </select>
        <button className="px-5 py-2.5 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-all duration-200 active:scale-[0.97]">
          جستجو
        </button>
      </form>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-right px-4 py-3 font-medium">محصول</th>
                <th className="text-right px-4 py-3 font-medium">دسته‌بندی</th>
                <th className="text-right px-4 py-3 font-medium">برند</th>
                <th className="text-right px-4 py-3 font-medium">قیمت</th>
                <th className="text-right px-4 py-3 font-medium">موجودی</th>
                <th className="text-right px-4 py-3 font-medium">وضعیت</th>
                <th className="text-left px-4 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    محصولی یافت نشد
                  </td>
                </tr>
              )}
              {products.map((product) => (
                <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images[0] && (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.category.name}</td>
                  <td className="px-4 py-3 text-gray-600">{product.brand.name}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium">{product.price.toLocaleString("fa-IR")}</span>
                    {product.discountPrice && (
                      <span className="text-red-500 mr-2 text-xs line-through">
                        {product.discountPrice.toLocaleString("fa-IR")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge[product.status] || "bg-gray-100"}`}>
                      {statusLabel[product.status] || product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </Link>
                      <DeleteButton action={deleteProductAction} id={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
