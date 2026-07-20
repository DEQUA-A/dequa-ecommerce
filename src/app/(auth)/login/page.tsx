import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "ورود", description: "به حساب کاربری خود وارد شوید." };

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border p-8">
      <h1 className="text-2xl font-bold text-center mb-6">ورود</h1>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <p className="text-center text-sm text-gray-500 mt-6">
        حساب کاربری ندارید؟{" "}
        <Link href="/register" className="text-primary hover:underline font-medium">
          ثبت نام
        </Link>
      </p>
    </div>
  );
}
