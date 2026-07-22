"use client";

import { useActionState, useState } from "react";
import { updateProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/Button";
import { CheckCircle, AlertCircle, User, Phone, MapPin } from "lucide-react";

interface Props {
  name: string;
  phone: string | null;
  address: string | null;
}

export function ProfileForm({ name, phone, address }: Props) {
  const [submitted, setSubmitted] = useState(false);

  async function submit(_prev: unknown, formData: FormData) {
    const result = await updateProfile(formData);
    if (result.success) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
      return null;
    }
    return result.error;
  }

  const [message, submitAction, pending] = useActionState(submit, null);

  return (
    <form action={submitAction} className="space-y-4">
      <h3 className="font-bold text-base">ویرایش اطلاعات</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">نام و نام خانوادگی</label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              name="name"
              defaultValue={name}
              required
              className="w-full pr-10 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">شماره تماس</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              name="phone"
              defaultValue={phone || ""}
              dir="ltr"
              className="w-full pr-10 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">آدرس</label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
          <textarea
            name="address"
            defaultValue={address || ""}
            rows={2}
            className="w-full pr-10 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>
      </div>

      {message && (
        <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl border bg-red-50 text-red-600 border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {message}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" loading={pending}>
          ذخیره تغییرات
        </Button>
        {submitted && (
          <span className="flex items-center gap-1.5 text-green-600 text-sm font-bold animate-fade-in-down">
            <CheckCircle className="w-4 h-4" />
            ذخیره شد
          </span>
        )}
      </div>
    </form>
  );
}
