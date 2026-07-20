"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const categorySchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
  slug: z.string().min(2, "اسلاگ باید حداقل ۲ حرف باشد"),
  description: z.string().optional(),
});

export type CategoryState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export async function createCategory(prevState: CategoryState | null, formData: FormData): Promise<CategoryState> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return { message: "دسترسی غیرمجاز", success: false };

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || undefined,
  };

  const validated = categorySchema.safeParse(raw);
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors, message: "خطاهای فرم را برطرف کنید" };

  const existing = await prisma.category.findUnique({ where: { slug: validated.data.slug } });
  if (existing) return { errors: { slug: ["این اسلاگ قبلاً استفاده شده است"] }, message: "اسلاگ تکراری" };

  await prisma.category.create({ data: validated.data });
  revalidatePath("/admin/categories");
  return { success: true, message: "دسته‌بندی با موفقیت ایجاد شد" };
}

export async function updateCategory(id: string, prevState: CategoryState | null, formData: FormData): Promise<CategoryState> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return { message: "دسترسی غیرمجاز", success: false };

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || undefined,
  };

  const validated = categorySchema.safeParse(raw);
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors, message: "خطاهای فرم را برطرف کنید" };

  const conflict = await prisma.category.findFirst({ where: { slug: validated.data.slug, id: { not: id } } });
  if (conflict) return { errors: { slug: ["این اسلاگ قبلاً استفاده شده است"] }, message: "اسلاگ تکراری" };

  await prisma.category.update({ where: { id }, data: validated.data });
  revalidatePath("/admin/categories");
  return { success: true, message: "دسته‌بندی با موفقیت بروزرسانی شد" };
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("دسترسی غیرمجاز");

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) throw new Error("این دسته‌بندی دارای محصول است. ابتدا محصولات را جابجا کنید.");

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}
