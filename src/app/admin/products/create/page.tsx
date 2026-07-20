import { prisma } from "@/lib/db";
import { createProduct } from "@/lib/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";

const initialState = {};

export default async function CreateProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">محصول جدید</h1>
      <div className="bg-white rounded-xl border p-6">
        <ProductForm
          action={createProduct}
          initialState={initialState}
          categories={categories}
          brands={brands}
        />
      </div>
    </div>
  );
}
