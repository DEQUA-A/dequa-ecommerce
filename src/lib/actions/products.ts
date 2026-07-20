"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const productSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
  slug: z.string().min(2, "اسلاگ باید حداقل ۲ حرف باشد"),
  description: z.string().min(1, "توضیحات را وارد کنید"),
  price: z.coerce.number().min(1, "قیمت باید بزرگتر از ۰ باشد"),
  discountPrice: z.coerce.number().nullable().optional(),
  stock: z.coerce.number().min(0, "موجودی نامعتبر"),
  status: z.enum(["ACTIVE", "DRAFT", "OUT_OF_STOCK", "DISCONTINUED"]),
  featured: z.coerce.boolean(),
  categoryId: z.string().min(1, "دسته‌بندی را انتخاب کنید"),
  brandId: z.string().min(1, "برند را انتخاب کنید"),
  imageUrl: z.string().url("لینک تصویر معتبر نیست").optional().or(z.literal("")),
});

export type ProductState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export async function createProduct(
  prevState: ProductState | null,
  formData: FormData
): Promise<ProductState> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { message: "دسترسی غیرمجاز", success: false };
  }

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    price: formData.get("price"),
    discountPrice: formData.get("discountPrice") || null,
    stock: formData.get("stock"),
    status: formData.get("status") as string,
    featured: formData.get("featured") === "on",
    categoryId: formData.get("categoryId") as string,
    brandId: formData.get("brandId") as string,
    imageUrl: (formData.get("imageUrl") as string) || "",
  };

  const validated = productSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: "خطاهای فرم را برطرف کنید" };
  }

  const { imageUrl, ...data } = validated.data;

  const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return { errors: { slug: ["این اسلاگ قبلاً استفاده شده است"] }, message: "اسلاگ تکراری" };
  }

  const product = await prisma.product.create({ data });

  if (imageUrl) {
    await prisma.productImage.create({
      data: { url: imageUrl, alt: data.name, productId: product.id },
    });
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  prevState: ProductState | null,
  formData: FormData
): Promise<ProductState> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return { message: "دسترسی غیرمجاز", success: false };
  }

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    price: formData.get("price"),
    discountPrice: formData.get("discountPrice") || null,
    stock: formData.get("stock"),
    status: formData.get("status") as string,
    featured: formData.get("featured") === "on",
    categoryId: formData.get("categoryId") as string,
    brandId: formData.get("brandId") as string,
    imageUrl: (formData.get("imageUrl") as string) || "",
  };

  const validated = productSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, message: "خطاهای فرم را برطرف کنید" };
  }

  const { imageUrl, ...data } = validated.data;

  const conflict = await prisma.product.findFirst({
    where: { slug: data.slug, id: { not: id } },
  });
  if (conflict) {
    return { errors: { slug: ["این اسلاگ قبلاً استفاده شده است"] }, message: "اسلاگ تکراری" };
  }

  await prisma.product.update({ where: { id }, data });

  const existingImages = await prisma.productImage.findFirst({ where: { productId: id } });
  if (imageUrl && existingImages) {
    await prisma.productImage.update({ where: { id: existingImages.id }, data: { url: imageUrl, alt: data.name } });
  } else if (imageUrl) {
    await prisma.productImage.create({ data: { url: imageUrl, alt: data.name, productId: id } });
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("دسترسی غیرمجاز");
  }

  await prisma.productImage.deleteMany({ where: { productId: id } });
  await prisma.productVariant.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });

  revalidatePath("/admin/products");
}
