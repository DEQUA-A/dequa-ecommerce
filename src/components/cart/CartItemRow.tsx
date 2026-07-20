"use client";

import { Trash2, Minus, Plus } from "lucide-react";
import { useCartStore, type CartItem } from "@/lib/store/cart";

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR") + " تومان";
}

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQty, removeItem } = useCartStore();

  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="aspect-square w-20 md:w-24 shrink-0 rounded-xl overflow-hidden bg-gray-50 border">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm md:text-base truncate">{item.name}</h3>
        {item.variantLabel && <p className="text-xs text-gray-500 mt-0.5">{item.variantLabel}</p>}
        <p className="text-sm font-bold text-primary mt-1">
          {item.discountPrice ? formatPrice(item.discountPrice) : formatPrice(item.price)}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeItem(item.productId, item.variantId)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 border rounded-lg">
          <button
            onClick={() => updateQty(item.productId, item.qty - 1, item.variantId)}
            className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-bold">{item.qty.toLocaleString("fa-IR")}</span>
          <button
            onClick={() => updateQty(item.productId, item.qty + 1, item.variantId)}
            disabled={item.qty >= item.stock}
            className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-30"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
