"use client";

import { useState, useActionState } from "react";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
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
    <div className="bg-white rounded-xl border">
      <div className="p-4 border-b flex items-center justify-between">
        <span className="text-sm text-gray-500">{categories.length} دسته‌بندی</span>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 text-sm text-primary hover:text-primary-hover font-medium"
        >
          <Plus className="w-4 h-4" />
          افزودن
        </button>
      </div>

      {showAdd && (
        <div className="p-4 border-b bg-gray-50">
          <form action={createAction} className="flex gap-2">
            <input name="name" placeholder="نام دسته‌بندی" className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary" required />
            <input name="slug" placeholder="اسلاگ" className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary ltr" required />
            <button type="submit" disabled={createPending} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
              <Check className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </form>
          {createState?.message && (
            <p className="text-red-500 text-xs mt-2">{createState.message}</p>
          )}
        </div>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-right px-4 py-3 font-medium">نام</th>
            <th className="text-right px-4 py-3 font-medium">اسلاگ</th>
            <th className="text-right px-4 py-3 font-medium">محصولات</th>
            <th className="text-left px-4 py-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="border-b last:border-0 hover:bg-gray-50">
              {editingId === cat.id ? (
                <td colSpan={4} className="px-4 py-3">
                  <form
                    action={updateAction}
                    className="flex gap-2"
                  >
                    <input name="name" defaultValue={cat.name} className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary" required />
                    <input name="slug" defaultValue={cat.slug} className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary ltr" required />
                    <input name="description" defaultValue={cat.description || ""} placeholder="توضیحات (اختیاری)" className="flex-[2] px-3 py-2 border rounded-lg text-sm outline-none focus:border-primary" />
                    <button type="submit" disabled={updatePending} className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors">
                      <Check className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-100 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                  {updateState?.message && (
                    <p className="text-red-500 text-xs mt-2">{updateState.message}</p>
                  )}
                </td>
              ) : (
                <>
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                  <td className="px-4 py-3">{cat._count.products}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditingId(cat.id); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
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
