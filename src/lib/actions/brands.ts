"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const brandSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
  slug: z.string().min(2, "اسلاگ باید حداقل ۲ حرف باشد"),
});

export type BrandState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export async function createBrand(prevState: BrandState | null, formData: FormData): Promise<BrandState> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return { message: "دسترسی غیرمجاز", success: false };

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
  };

  const validated = brandSchema.safeParse(raw);
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors, message: "خطاهای فرم را برطرف کنید" };

  const existing = await prisma.brand.findUnique({ where: { slug: validated.data.slug } });
  if (existing) return { errors: { slug: ["این اسلاگ قبلاً استفاده شده است"] }, message: "اسلاگ تکراری" };

  await prisma.brand.create({ data: validated.data });
  revalidatePath("/admin/brands");
  return { success: true, message: "برند با موفقیت ایجاد شد" };
}

export async function updateBrand(id: string, prevState: BrandState | null, formData: FormData): Promise<BrandState> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") return { message: "دسترسی غیرمجاز", success: false };

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
  };

  const validated = brandSchema.safeParse(raw);
  if (!validated.success) return { errors: validated.error.flatten().fieldErrors, message: "خطاهای فرم را برطرف کنید" };

  const conflict = await prisma.brand.findFirst({ where: { slug: validated.data.slug, id: { not: id } } });
  if (conflict) return { errors: { slug: ["این اسلاگ قبلاً استفاده شده است"] }, message: "اسلاگ تکراری" };

  await prisma.brand.update({ where: { id }, data: validated.data });
  revalidatePath("/admin/brands");
  return { success: true, message: "برند با موفقیت بروزرسانی شد" };
}

export async function deleteBrand(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") throw new Error("دسترسی غیرمجاز");

  const productCount = await prisma.product.count({ where: { brandId: id } });
  if (productCount > 0) throw new Error("این برند دارای محصول است. ابتدا محصولات را جابجا کنید.");

  await prisma.brand.delete({ where: { id } });
  revalidatePath("/admin/brands");
}
