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
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const dots: Record<string, string> = {
  PENDING: "bg-amber-500",
  PROCESSING: "bg-blue-500",
  SHIPPED: "bg-purple-500",
  COMPLETED: "bg-green-500",
  CANCELLED: "bg-red-500",
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
    <form action={submitAction} className="relative">
      <input type="hidden" name="orderId" value={orderId} />
      <div className="relative inline-flex items-center">
        <span className={`absolute right-2 w-1.5 h-1.5 rounded-full ${dots[current] || "bg-gray-500"}`} />
        <select
          name="status"
          defaultValue={current}
          onChange={(e) => e.target.form?.requestSubmit()}
          className={`text-[10px] font-bold px-2.5 py-1.5 pr-5 rounded-full border cursor-pointer transition-all duration-200 appearance-none ${colors[current] || "bg-gray-100 text-gray-700 border-gray-200"}`}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{labels[s] || s}</option>
          ))}
        </select>
      </div>
    </form>
  );
}
