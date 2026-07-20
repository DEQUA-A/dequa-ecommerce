import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "ثبت‌نام", description: "حساب کاربری جدید ایجاد کنید." };

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border p-8">
      <h1 className="text-2xl font-bold text-center mb-6">ثبت نام</h1>
      <RegisterForm />
      <p className="text-center text-sm text-gray-500 mt-6">
        قبلاً ثبت نام کرده‌اید؟{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          ورود
        </Link>
      </p>
    </div>
  );
}
