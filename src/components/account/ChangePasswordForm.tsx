"use client";

import { useActionState, useState } from "react";
import { changePassword } from "@/lib/actions/profile";
import { Button } from "@/components/ui/Button";
import { CheckCircle, AlertCircle, Eye, EyeOff, Lock, Key } from "lucide-react";

export function ChangePasswordForm() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function submit(_prev: unknown, formData: FormData) {
    const result = await changePassword(formData);
    if (result.success) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      return null;
    }
    return result.error;
  }

  const [message, submitAction, pending] = useActionState(submit, null);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
      <h3 className="font-bold text-base mb-4 flex items-center gap-2">
        <Lock className="w-4 h-4 text-gray-400" />
        تغییر رمز عبور
      </h3>
      <form action={submitAction} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">رمز فعلی</label>
          <div className="relative">
            <Key className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              name="currentPassword"
              type={showCurrent ? "text" : "password"}
              required
              className="w-full pr-10 pl-10 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showCurrent ? "مخفی کردن" : "نمایش"}
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">رمز جدید</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              name="newPassword"
              type={showNew ? "text" : "password"}
              required
              minLength={6}
              className="w-full pr-10 pl-10 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="حداقل ۶ حرف"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showNew ? "مخفی کردن" : "نمایش"}
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {submitted && (
          <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl border bg-green-50 text-green-600 border-green-200">
            <CheckCircle className="w-4 h-4 shrink-0" />
            رمز عبور با موفقیت تغییر کرد
          </div>
        )}

        {message && !submitted && (
          <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl border bg-red-50 text-red-600 border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {message}
          </div>
        )}

        <Button type="submit" loading={pending}>
          تغییر رمز عبور
        </Button>
      </form>
    </div>
  );
}
