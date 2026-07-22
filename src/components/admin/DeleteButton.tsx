"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";

export function DeleteButton({ action, id }: { action: (formData: FormData) => Promise<void>; id: string }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] font-bold hover:bg-red-600 transition-all duration-200 active:scale-95 flex items-center gap-1"
          >
            <AlertTriangle className="w-3 h-3" />
            تأیید
          </button>
        </form>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold hover:bg-gray-200 transition-all duration-200 active:scale-95 flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          انصراف
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-2 hover:bg-red-50 rounded-lg transition-all duration-200 active:scale-95 group"
      title="حذف"
    >
      <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
    </button>
  );
}
