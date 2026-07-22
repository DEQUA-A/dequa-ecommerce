"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { register, type RegisterState } from "@/lib/actions/auth";

const initialState: RegisterState = {};

export function RegisterForm() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState<RegisterState, FormData>(
    register,
    initialState
  );

  if (state?.success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-bold">ثبت نام با موفقیت انجام شد</h2>
        <p className="text-sm text-gray-500">اکنون می‌توانید وارد حساب خود شوید</p>
        <Button
          variant="primary"
          onClick={() => router.push("/login")}
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
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
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

      <Input
        label="رمز عبور"
        name="password"
        type="password"
        placeholder="حداقل ۶ حرف"
        autoComplete="new-password"
        error={getError("password")}
        required
      />

      <Input
        label="تکرار رمز عبور"
        name="confirmPassword"
        type="password"
        placeholder="رمز عبور را دوباره وارد کنید"
        autoComplete="new-password"
        error={getError("confirmPassword")}
        required
      />

      <Button type="submit" loading={isPending}>
        ثبت نام
      </Button>
    </form>
  );
}
