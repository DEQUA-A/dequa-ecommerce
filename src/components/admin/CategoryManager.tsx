"use client";

import { useState, useActionState } from "react";
import { Plus, Edit2, Trash2, Check, X, Tags } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { products: number };
};

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const [createState, createAction, createPending] = useActionState(createCategory, null);
  const [updateState, updateAction, updatePending] = useActionState(
    editingId ? updateCategory.bind(null, editingId) : async () => null,
    null
  );

  async function handleDelete(id: string) {
    if (!confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) return;
    try {
      await deleteCategory(id);
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Tags className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">{categories.length} دسته‌بندی</span>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-1.5 text-sm text-primary font-bold hover:text-primary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          افزودن
        </button>
      </div>

      {showAdd && (
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <form action={createAction} className="flex flex-wrap gap-2">
            <input name="name" placeholder="نام دسته‌بندی" className="flex-1 min-w-[140px] px-3 py-2 border border-gray-300 hover:border-gray-400 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" required />
            <input name="slug" placeholder="اسلاگ" className="flex-1 min-w-[100px] px-3 py-2 border border-gray-300 hover:border-gray-400 rounded-xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all ltr" required />
            <div className="flex gap-1.5">
              <button type="submit" disabled={createPending} className="px-3 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover transition-all duration-200 active:scale-95">
                <Check className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-3 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-100 transition-all duration-200 active:scale-95">
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
          {createState?.message && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-red-500" />{createState.message}</p>
          )}
        </div>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="text-right px-5 py-3.5 font-bold text-xs text-gray-500 tracking-wide">نام</th>
            <th className="text-right px-5 py-3.5 font-bold text-xs text-gray-500 tracking-wide">اسلاگ</th>
            <th className="text-right px-5 py-3.5 font-bold text-xs text-gray-500 tracking-wide">محصولات</th>
            <th className="text-left px-5 py-3.5 font-bold text-xs text-gray-500 tracking-wide">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
              {editingId === cat.id ? (
                <td colSpan={4} className="px-5 py-3">
                  <form action={updateAction} className="flex flex-wrap gap-2">
                    <input name="name" defaultValue={cat.name} className="flex-1 min-w-[120px] px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary" required />
                    <input name="slug" defaultValue={cat.slug} className="flex-1 min-w-[80px] px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary ltr" required />
                    <input name="description" defaultValue={cat.description || ""} placeholder="توضیحات" className="flex-1 min-w-[120px] px-3 py-1.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-primary" />
                    <div className="flex gap-1.5">
                      <button type="submit" disabled={updatePending} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => setEditingId(null)} className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                  {updateState?.message && (
                    <p className="text-red-500 text-xs mt-2">{updateState.message}</p>
                  )}
                </td>
              ) : (
                <>
                  <td className="px-5 py-3.5 font-bold text-sm">{cat.name}</td>
                  <td className="px-5 py-3.5 text-gray-500 text-sm">{cat.slug}</td>
                  <td className="px-5 py-3.5 text-sm">{cat._count.products.toLocaleString("fa-IR")}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setEditingId(cat.id); }} className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-95" title="ویرایش">
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-95" title="حذف">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
