"use client";

import { Trash2, Minus, Plus, Tag } from "lucide-react";
import { useCartStore, type CartItem } from "@/lib/store/cart";
import Link from "next/link";

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR") + " تومان";
}

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateQty, removeItem } = useCartStore();
  const hasDiscount = item.discountPrice !== null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 animate-fade-in-up hover:shadow-sm transition-shadow duration-200">
      <Link
        href={`/products/${item.productId}`}
        className="aspect-square w-20 md:w-24 shrink-0 rounded-xl overflow-hidden bg-gray-50 border group"
      >
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </Link>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <Link href={`/products/${item.productId}`}>
            <h3 className="font-bold text-sm md:text-base truncate hover:text-primary transition-colors">
              {item.name}
            </h3>
          </Link>
          {item.variantLabel && (
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {item.variantLabel}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1">
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(item.price)}
              </span>
            )}
            <p className="text-sm font-bold text-primary">
              {formatPrice(item.discountPrice ?? item.price)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => updateQty(item.productId, item.qty - 1, item.variantId)}
              className="p-2 hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-bold tabular-nums">
              {item.qty.toLocaleString("fa-IR")}
            </span>
            <button
              onClick={() => updateQty(item.productId, item.qty + 1, item.variantId)}
              disabled={item.qty >= item.stock}
              className="p-2 hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.productId, item.variantId)}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
            title="حذف"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
