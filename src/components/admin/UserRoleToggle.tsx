"use client";

import { useActionState } from "react";
import { updateUserRole } from "@/lib/actions/admin";
import { Shield, User } from "lucide-react";

interface Props {
  userId: string;
  currentRole: string;
}

export function UserRoleToggle({ userId, currentRole }: Props) {
  async function submit(_prev: unknown, formData: FormData) {
    const result = await updateUserRole(formData);
    if (result.error) {
      alert(result.error);
    }
    return null;
  }

  const [, submitAction] = useActionState(submit, null);

  const isAdmin = currentRole === "ADMIN";

  return (
    <form action={submitAction}>
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        defaultValue={currentRole}
        onChange={(e) => e.target.form?.requestSubmit()}
        className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-full border cursor-pointer transition-all duration-200 ${
          isAdmin
            ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
        }`}
      >
        <option value="USER">کاربر</option>
        <option value="ADMIN">مدیر</option>
      </select>
    </form>
  );
}
