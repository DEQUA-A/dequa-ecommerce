import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateProduct } from "@/lib/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";

const initialState = {};

export default async function EditProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const boundAction = updateProduct.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ویرایش محصول</h1>
      <div className="bg-white rounded-xl border p-6">
        <ProductForm
          action={boundAction}
          initialState={initialState}
          categories={categories}
          brands={brands}
          product={product}
        />
      </div>
    </div>
  );
}
