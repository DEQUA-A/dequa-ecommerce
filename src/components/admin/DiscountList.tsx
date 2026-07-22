"use client";

import { useActionState, useState } from "react";
import { createDiscount, updateDiscount, deleteDiscount, toggleDiscount } from "@/lib/actions/admin";
import { Plus, Check, X, Loader2, Power, Trash2, Edit3, Tag } from "lucide-react";

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
        <form action={createAction} className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Tag className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-sm">کد تخفیف جدید</h3>
            </div>
            <button type="button" onClick={() => setShowCreate(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">کد تخفیف</label>
              <input name="code" required className="w-full px-3 py-2 border border-gray-300 hover:border-gray-400 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" placeholder="WELCOME10" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">درصد تخفیف</label>
              <input name="percent" type="number" min="1" max="100" required className="w-full px-3 py-2 border border-gray-300 hover:border-gray-400 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">تاریخ انقضا (اختیاری)</label>
              <input name="expiresAt" type="date" className="w-full px-3 py-2 border border-gray-300 hover:border-gray-400 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
          </div>
          {createError && <p className="text-red-500 text-xs mb-3 flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-red-500" />{createError}</p>}
          <button type="submit" disabled={createPending} className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-hover transition-all duration-200 active:scale-[0.97] disabled:opacity-60">
            {createPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <Plus className="w-3.5 h-3.5" /> ایجاد کد تخفیف
          </button>
        </form>
      ) : (
        <button onClick={() => setShowCreate(true)} className="inline-flex items-center gap-1.5 text-sm text-primary font-bold hover:text-primary-hover transition-colors mb-5">
          <Plus className="w-4 h-4" /> کد تخفیف جدید
        </button>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">کد</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">درصد</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">انقضا</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">وضعیت</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">تاریخ ساخت</th>
                <th className="text-left px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => (
                <tr key={d.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  {editingId === d.id ? (
                    <td colSpan={6} className="px-4 py-3">
                      <form action={updateAction} className="flex items-center gap-2 flex-wrap">
                        <input type="hidden" name="id" value={d.id} />
                        <input name="code" defaultValue={d.code} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary w-24" />
                        <input name="percent" type="number" defaultValue={d.percent} min="1" max="100" className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary w-20" />
                        <input name="expiresAt" type="date" defaultValue={d.expiresAt?.split("T")[0] || ""} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary" />
                        {updateError && <span className="text-red-500 text-[10px]">{updateError}</span>}
                        <button type="submit" disabled={updatePending} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => setEditingId(null)} className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-3.5 font-bold font-mono text-sm">{d.code}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                          {d.percent}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-sm">
                        {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString("fa-IR") : "بدون انقضا"}
                      </td>
                      <td className="px-4 py-3.5">
                        <form action={toggleAction}>
                          <input type="hidden" name="id" value={d.id} />
                          <button type="submit" className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all duration-200 ${
                            d.active
                              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                              : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${d.active ? "bg-green-500" : "bg-red-500"}`} />
                            {d.active ? "فعال" : "غیرفعال"}
                          </button>
                        </form>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 text-sm">{new Date(d.createdAt).toLocaleDateString("fa-IR")}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setEditingId(d.id)} className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-95" title="ویرایش">
                            <Edit3 className="w-4 h-4 text-gray-500" />
                          </button>
                          <form action={deleteAction}>
                            <input type="hidden" name="id" value={d.id} />
                            <button type="submit" className="p-2 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-95" title="حذف">
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {discounts.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <Tag className="w-12 h-12 mb-3 text-gray-200" />
                      <p className="text-sm font-bold">کد تخفیفی وجود ندارد</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
