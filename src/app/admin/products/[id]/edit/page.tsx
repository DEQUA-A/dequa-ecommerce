import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateProduct } from "@/lib/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/products" className="hover:text-primary transition-colors">محصولات</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-800 font-bold">ویرایش محصول</span>
      </div>
      <h1 className="text-2xl font-bold mb-6">ویرایش محصول</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
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
