"use client";

import { useActionState } from "react";
import { updateProfile } from "@/lib/actions/profile";
import { Loader2, Check } from "lucide-react";

interface Props {
  name: string;
  phone: string | null;
  address: string | null;
}

export function ProfileForm({ name, phone, address }: Props) {
  async function submit(_prev: unknown, formData: FormData) {
    const result = await updateProfile(formData);
    if (result.success) return "ذخیره شد";
    return result.error;
  }

  const [message, submitAction, pending] = useActionState(submit, null);

  return (
    <form action={submitAction} className="space-y-4">
      <h3 className="font-bold">ویرایش اطلاعات</h3>

      <div>
        <label className="block text-sm font-bold mb-1">نام و نام خانوادگی</label>
        <input
          name="name"
          defaultValue={name}
          required
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">شماره تماس</label>
        <input
          name="phone"
          defaultValue={phone || ""}
          dir="ltr"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1">آدرس</label>
        <textarea
          name="address"
          defaultValue={address || ""}
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
        />
      </div>

      {message && (
        <p className={`text-sm flex items-center gap-1 ${message === "ذخیره شد" ? "text-green-600" : "text-red-500"}`}>
          {message === "ذخیره شد" ? <Check className="w-4 h-4" /> : null}
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-60"
      >
        {pending && <Loader2 className="w-4 h-4 animate-spin" />}
        {pending ? "در حال ذخیره..." : "ذخیره"}
      </button>
    </form>
  );
}
