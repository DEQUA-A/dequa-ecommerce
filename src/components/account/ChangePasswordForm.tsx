"use client";

import { useActionState } from "react";
import { changePassword } from "@/lib/actions/profile";
import { Loader2, Check } from "lucide-react";

export function ChangePasswordForm() {
  async function submit(_prev: unknown, formData: FormData) {
    const result = await changePassword(formData);
    if (result.success) {
      const form = document.getElementById("change-password-form") as HTMLFormElement;
      form?.reset();
      return "رمز عبور با موفقیت تغییر کرد";
    }
    return result.error;
  }

  const [message, submitAction, pending] = useActionState(submit, null);

  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="font-bold mb-4">تغییر رمز عبور</h3>
      <form id="change-password-form" action={submitAction} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-bold mb-1">رمز فعلی</label>
          <input
            name="currentPassword"
            type="password"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">رمز جدید</label>
          <input
            name="newPassword"
            type="password"
            required
            minLength={6}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {message && (
          <p className={`text-sm flex items-center gap-1 ${message.includes("تغییر کرد") ? "text-green-600" : "text-red-500"}`}>
            {message.includes("تغییر کرد") ? <Check className="w-4 h-4" /> : null}
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-60"
        >
          {pending && <Loader2 className="w-4 h-4 animate-spin" />}
          {pending ? "در حال تغییر..." : "تغییر رمز عبور"}
        </button>
      </form>
    </div>
  );
}
