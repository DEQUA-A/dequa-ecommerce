"use client";

import { useActionState } from "react";
import { updateOrderStatus } from "@/lib/actions/admin";

const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"] as const;

const labels: Record<string, string> = {
  PENDING: "در انتظار",
  PROCESSING: "پردازش",
  SHIPPED: "ارسال",
  COMPLETED: "تحویل",
  CANCELLED: "لغو",
};

const colors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

interface Props {
  orderId: string;
  current: string;
}

export function OrderStatusBadge({ orderId, current }: Props) {
  async function submit(_prev: unknown, formData: FormData) {
    const result = await updateOrderStatus(formData);
    if (result.error) return result.error;
    return null;
  }

  const [error, submitAction] = useActionState(submit, null);

  return (
    <form action={submitAction}>
      <input type="hidden" name="orderId" value={orderId} />
      <select
        name="status"
        defaultValue={current}
        onChange={(e) => e.target.form?.requestSubmit()}
        className={`text-xs font-bold px-2.5 py-1 rounded-full border-0 cursor-pointer ${colors[current] || "bg-gray-100"}`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{labels[s] || s}</option>
        ))}
      </select>
    </form>
  );
}
