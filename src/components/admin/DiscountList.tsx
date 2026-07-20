"use client";

import { useActionState, useState } from "react";
import { createDiscount, updateDiscount, deleteDiscount, toggleDiscount } from "@/lib/actions/admin";
import { Plus, Check, X, Loader2, Power, Trash2 } from "lucide-react";

interface Discount {
  id: string;
  code: string;
  percent: number;
  active: boolean;
  expiresAt: string | null;
  createdAt: string;
}

interface Props {
  discounts: Discount[];
}

export function DiscountList({ discounts: initial }: Props) {
  const [discounts, setDiscounts] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  async function handleCreate(_prev: unknown, formData: FormData) {
    const result = await createDiscount(formData);
    if (result.success) {
      setShowCreate(false);
    }
    return result.error || null;
  }

  async function handleUpdate(_prev: unknown, formData: FormData) {
    const result = await updateDiscount(formData);
    if (result.success) setEditingId(null);
    return result.error || null;
  }

  async function handleDelete(_prev: unknown, formData: FormData) {
    if (!confirm("آیا از حذف این کد تخفیف اطمینان دارید؟")) return null;
    const result = await deleteDiscount(formData);
    return result.error || null;
  }

  async function handleToggle(_prev: unknown, formData: FormData) {
    await toggleDiscount(formData);
    return null;
  }

  const [createError, createAction, createPending] = useActionState(handleCreate, null);
  const [updateError, updateAction, updatePending] = useActionState(handleUpdate, null);
  const [deleteError, deleteAction] = useActionState(handleDelete, null);
  const [, toggleAction] = useActionState(handleToggle, null);

  return (
    <div>
      {showCreate ? (
        <form action={createAction} className="bg-white border rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">کد تخفیف جدید</h3>
            <button type="button" onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold mb-1">کد تخفیف</label>
              <input name="code" required className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="WELCOME10" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">درصد تخفیف</label>
              <input name="percent" type="number" min="1" max="100" required className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">تاریخ انقضا (اختیاری)</label>
              <input name="expiresAt" type="date" className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          {createError && <p className="text-red-500 text-xs mb-3">{createError}</p>}
          <button type="submit" disabled={createPending} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 disabled:opacity-60">
            {createPending && <Loader2 className="w-3 h-3 animate-spin" />}
            <Plus className="w-3 h-3" /> ایجاد
          </button>
        </form>
      ) : (
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-1 text-sm text-primary hover:underline mb-4">
          <Plus className="w-4 h-4" /> کد تخفیف جدید
        </button>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-right p-3 font-bold">کد</th>
                <th className="text-right p-3 font-bold">درصد</th>
                <th className="text-right p-3 font-bold">انقضا</th>
                <th className="text-right p-3 font-bold">وضعیت</th>
                <th className="text-right p-3 font-bold">تاریخ ساخت</th>
                <th className="text-right p-3 font-bold">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => (
                <tr key={d.id} className="border-b last:border-0 hover:bg-gray-50">
                  {editingId === d.id ? (
                    <>
                      <td colSpan={6} className="p-3">
                        <form action={updateAction} className="flex items-center gap-3">
                          <input type="hidden" name="id" value={d.id} />
                          <input name="code" defaultValue={d.code} className="border rounded-lg px-2 py-1 text-sm w-28" />
                          <input name="percent" type="number" defaultValue={d.percent} min="1" max="100" className="border rounded-lg px-2 py-1 text-sm w-20" />
                          <input name="expiresAt" type="date" defaultValue={d.expiresAt?.split("T")[0] || ""} className="border rounded-lg px-2 py-1 text-sm" />
                          {updateError && <span className="text-red-500 text-xs">{updateError}</span>}
                          <button type="submit" disabled={updatePending} className="text-green-600 hover:text-green-700">
                            <Check className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                          </button>
                        </form>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 font-bold font-mono">{d.code}</td>
                      <td className="p-3">{d.percent}%</td>
                      <td className="p-3 text-gray-500">
                        {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString("fa-IR") : "بدون انقضا"}
                      </td>
                      <td className="p-3">
                        <form action={toggleAction}>
                          <input type="hidden" name="id" value={d.id} />
                          <button type="submit" className={`text-xs px-2.5 py-1 rounded-full font-bold ${d.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {d.active ? "فعال" : "غیرفعال"}
                          </button>
                        </form>
                      </td>
                      <td className="p-3 text-gray-500">{new Date(d.createdAt).toLocaleDateString("fa-IR")}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setEditingId(d.id)} className="text-blue-500 hover:text-blue-600">
                            ویرایش
                          </button>
                          <form action={deleteAction}>
                            <input type="hidden" name="id" value={d.id} />
                            <button type="submit" className="text-red-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {discounts.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-gray-400">کد تخفیفی وجود ندارد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
