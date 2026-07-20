"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export function DeleteButton({ action, id }: { action: (formData: FormData) => Promise<void>; id: string }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <button type="submit" className="px-2 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors">
            تأیید
          </button>
        </form>
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300 transition-colors"
        >
          انصراف
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
    >
      <Trash2 className="w-4 h-4 text-red-500" />
    </button>
  );
}
