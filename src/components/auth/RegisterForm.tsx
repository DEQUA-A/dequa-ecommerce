"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { register, type RegisterState } from "@/lib/actions/auth";

const initialState: RegisterState = {};

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [state, formAction, isPending] = useActionState<RegisterState, FormData>(
    register,
    initialState
  );

  if (state?.success) {
    return (
      <div className="text-center space-y-4 animate-scale-in">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-lg font-bold">ثبت نام با موفقیت انجام شد</h2>
        <p className="text-sm text-gray-500">اکنون می‌توانید وارد حساب خود شوید</p>
        <Button
          variant="primary"
          onClick={() => router.push("/login")}
          className="w-full"
        >
          رفتن به صفحه ورود
        </Button>
      </div>
    );
  }

  const getError = (field: string) => state?.errors?.[field]?.[0];

  return (
    <form action={formAction} className="space-y-4">
      {state?.message && !state.success && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200 flex items-center gap-2 animate-fade-in-down">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {state.message}
        </div>
      )}

      <Input
        label="نام و نام خانوادگی"
        name="name"
        placeholder="مثال: علی محمدی"
        autoComplete="name"
        error={getError("name")}
        required
      />

      <Input
        label="ایمیل"
        name="email"
        type="email"
        dir="ltr"
        placeholder="example@email.com"
        autoComplete="email"
        error={getError("email")}
        required
      />

      <Input
        label="شماره موبایل"
        name="phone"
        type="tel"
        placeholder="۰۹۱۲۱۲۳۴۵۶۷"
        autoComplete="tel"
        error={getError("phone")}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          رمز عبور
        </label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="حداقل ۶ حرف"
            autoComplete="new-password"
            required
            className="w-full px-4 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 pl-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {getError("password") && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0" />
            {getError("password")}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          تکرار رمز عبور
        </label>
        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="رمز عبور را دوباره وارد کنید"
            autoComplete="new-password"
            required
            className="w-full px-4 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 pl-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showConfirm ? "مخفی کردن رمز" : "نمایش رمز"}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {getError("confirmPassword") && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0" />
            {getError("confirmPassword")}
          </p>
        )}
      </div>

      <Button type="submit" loading={isPending} className="w-full">
        ثبت نام
      </Button>
    </form>
  );
}
