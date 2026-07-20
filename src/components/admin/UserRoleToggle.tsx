"use client";

import { useActionState } from "react";
import { updateUserRole } from "@/lib/actions/admin";

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

  return (
    <form action={submitAction}>
      <input type="hidden" name="userId" value={userId} />
      <select
        name="role"
        defaultValue={currentRole}
        onChange={(e) => e.target.form?.requestSubmit()}
        className={`text-xs font-bold px-2.5 py-1 rounded-full border-0 cursor-pointer ${
          currentRole === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
        }`}
      >
        <option value="USER">کاربر</option>
        <option value="ADMIN">مدیر</option>
      </select>
    </form>
  );
}
