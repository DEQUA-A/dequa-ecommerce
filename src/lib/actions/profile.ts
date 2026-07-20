"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

const profileSchema = z.object({
  name: z.string().min(2, "نام حداقل ۲ حرف باشد"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "رمز فعلی الزامی است"),
  newPassword: z.string().min(6, "رمز جدید حداقل ۶ حرف باشد"),
});

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "لطفا وارد حساب خود شوید" };

  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues.map((e) => e.message).join("، ") };

  await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
  });

  revalidatePath("/account");
  return { success: true };
}

export async function changePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "لطفا وارد حساب خود شوید" };

  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
  const parsed = passwordSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues.map((e) => e.message).join("، ") };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "کاربر یافت نشد" };

  const match = await bcrypt.compare(parsed.data.currentPassword, user.password);
  if (!match) return { error: "رمز فعلی اشتباه است" };

  const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}
