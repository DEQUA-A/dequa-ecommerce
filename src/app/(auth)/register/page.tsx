import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { UserPlus } from "lucide-react";

export const metadata: Metadata = { title: "ثبت‌نام", description: "حساب کاربری جدید ایجاد کنید." };

export default function RegisterPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fade-in-up">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
        <UserPlus className="w-6 h-6 text-primary" />
      </div>
      <h1 className="text-xl md:text-2xl font-bold text-center mb-1">ایجاد حساب کاربری</h1>
      <p className="text-sm text-gray-500 text-center mb-6">با ثبت نام سریع از تخفیف‌ها بهره‌مند شوید</p>
      <RegisterForm />
      <p className="text-center text-sm text-gray-500 mt-6">
        قبلاً ثبت نام کرده‌اید؟{" "}
        <Link href="/login" className="text-primary hover:text-primary-hover font-bold transition-colors">
          ورود
        </Link>
      </p>
    </div>
  );
}
