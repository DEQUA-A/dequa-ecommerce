import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { LogIn } from "lucide-react";

export const metadata: Metadata = { title: "ورود", description: "به حساب کاربری خود وارد شوید." };

interface Props {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-fade-in-up">
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
        <LogIn className="w-6 h-6 text-primary" />
      </div>
      <h1 className="text-xl md:text-2xl font-bold text-center mb-1">ورود به حساب</h1>
      <p className="text-sm text-gray-500 text-center mb-6">برای خرید و مشاهده سفارشات وارد شوید</p>
      <LoginForm callbackUrl={callbackUrl || "/account"} />
      <p className="text-center text-sm text-gray-500 mt-6">
        حساب کاربری ندارید؟{" "}
        <Link href="/register" className="text-primary hover:text-primary-hover font-bold transition-colors">
          ثبت نام
        </Link>
      </p>
      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-400">
          حساب آزمایشی: admin@shop.com / 123456
        </p>
      </div>
    </div>
  );
}
