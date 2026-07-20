import { prisma } from "@/lib/db";
import { createCategory, deleteCategory } from "@/lib/actions/categories";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">مدیریت دسته‌بندی‌ها</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
