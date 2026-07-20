"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") throw new Error("دسترسی غیرمجاز");
}

// ─── Order Status ───

const statusSchema = z.object({
  orderId: z.string(),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"]),
});

export async function updateOrderStatus(formData: FormData) {
  try {
    await requireAdmin();
    const raw = Object.fromEntries(formData) as Record<string, string>;
    const parsed = statusSchema.safeParse(raw);
    if (!parsed.success) return { error: "داده‌های نامعتبر" };

    await prisma.order.update({
      where: { id: parsed.data.orderId },
      data: { status: parsed.data.status },
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch {
    return { error: "خطا در بروزرسانی وضعیت" };
  }
}

// ─── User Role ───

export async function updateUserRole(formData: FormData) {
  try {
    await requireAdmin();
    const userId = formData.get("userId") as string;
    const role = formData.get("role") as string;
    if (!userId || !["USER", "ADMIN"].includes(role)) return { error: "داده‌های نامعتبر" };

    const session = await auth();
    if (userId === session?.user?.id) return { error: "نمی‌توانید نقش خود را تغییر دهید" };

    await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch {
    return { error: "خطا در بروزرسانی نقش" };
  }
}

// ─── Discount CRUD ───

const discountSchema = z.object({
  code: z.string().min(1, "کد تخفیف الزامی است").toUpperCase(),
  percent: z.coerce.number().min(1).max(100),
  expiresAt: z.string().optional(),
});

export async function createDiscount(formData: FormData) {
  try {
    await requireAdmin();
    const raw = Object.fromEntries(formData) as Record<string, string>;
    const parsed = discountSchema.safeParse(raw);
    if (!parsed.success) return { error: parsed.error.issues.map((e) => e.message).join("، ") };

    const data: any = {
      code: parsed.data.code,
      percent: parsed.data.percent,
      active: true,
    };
    if (parsed.data.expiresAt) {
      data.expiresAt = new Date(parsed.data.expiresAt);
    }

    await prisma.discount.create({ data });
    revalidatePath("/admin/discounts");
    return { success: true };
  } catch (e: any) {
    if (e?.code === "P2002") return { error: "این کد تخفیف قبلا ثبت شده است" };
    return { error: "خطا در ایجاد کد تخفیف" };
  }
}

export async function updateDiscount(formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get("id") as string;
    const raw = Object.fromEntries(formData) as Record<string, string>;
    const parsed = discountSchema.safeParse(raw);
    if (!parsed.success) return { error: parsed.error.issues.map((e) => e.message).join("، ") };

    const data: any = {
      code: parsed.data.code,
      percent: parsed.data.percent,
    };
    if (parsed.data.expiresAt) {
      data.expiresAt = new Date(parsed.data.expiresAt);
    } else {
      data.expiresAt = null;
    }

    await prisma.discount.update({ where: { id }, data });
    revalidatePath("/admin/discounts");
    return { success: true };
  } catch (e: any) {
    if (e?.code === "P2002") return { error: "این کد تخفیف قبلا ثبت شده است" };
    return { error: "خطا در بروزرسانی کد تخفیف" };
  }
}

export async function deleteDiscount(formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get("id") as string;
    await prisma.discount.delete({ where: { id } });
    revalidatePath("/admin/discounts");
    return { success: true };
  } catch {
    return { error: "خطا در حذف کد تخفیف" };
  }
}

export async function toggleDiscount(formData: FormData) {
  try {
    await requireAdmin();
    const id = formData.get("id") as string;
    const current = await prisma.discount.findUnique({ where: { id } });
    if (!current) return { error: "کد تخفیف یافت نشد" };

    await prisma.discount.update({
      where: { id },
      data: { active: !current.active },
    });

    revalidatePath("/admin/discounts");
    return { success: true };
  } catch {
    return { error: "خطا در تغییر وضعیت" };
  }
}
