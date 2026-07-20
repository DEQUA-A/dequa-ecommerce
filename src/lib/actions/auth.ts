"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

function normalizeDigits(str: string): string {
  const persian: Record<string, string> = {
    "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
    "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
  };
  return str.replace(/[۰-۹]/g, (d) => persian[d] || d);
}

const registerSchema = z
  .object({
    name: z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
    email: z.string().email("ایمیل نامعتبر است"),
    phone: z
      .string()
      .min(1, "شماره موبایل را وارد کنید")
      .transform(normalizeDigits)
      .refine((val) => /^[0-9]{11}$/.test(val), {
        message: "شماره موبایل باید ۱۱ رقم باشد",
      }),
    password: z.string().min(6, "رمز عبور باید حداقل ۶ حرف باشد"),
    confirmPassword: z.string().min(1, "تکرار رمز عبور را وارد کنید"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

export type RegisterState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export async function register(
  prevState: RegisterState | null,
  formData: FormData
): Promise<RegisterState> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const validated = registerSchema.safeParse(raw);

  if (!validated.success) {
    const fieldErrors = validated.error.flatten().fieldErrors;
    return {
      errors: fieldErrors,
      message: "لطفاً خطاهای فرم را برطرف کنید",
    };
  }

  const { name, email, phone, password } = validated.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      errors: { email: ["این ایمیل قبلاً ثبت شده است"] },
      message: "ایمیل تکراری",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, email, phone, password: hashedPassword, role: "USER" },
  });

  return { success: true, message: "ثبت نام با موفقیت انجام شد" };
}
