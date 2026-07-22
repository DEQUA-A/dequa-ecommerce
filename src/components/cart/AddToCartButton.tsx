"use client";

import { ShoppingCart, Check, Plus, Minus, XCircle } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useState } from "react";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  discountPrice: number | null;
  image: string;
  stock: number;
  variantId?: string;
  variantLabel?: string;
}

export function AddToCartButton({
  productId, name, price, discountPrice, image, stock, variantId, variantLabel,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  if (stock === 0) {
    return (
      <button disabled className="w-full bg-gray-100 text-gray-400 py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2 text-sm">
        <XCircle className="w-5 h-5" />
        ناموجود
      </button>
    );
  }

  function handleClick() {
    addItem({ productId, variantId, name, price, discountPrice, image, stock, variantLabel, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="p-2.5 hover:bg-gray-50 transition-colors active:scale-95"
          aria-label="کاهش تعداد"
        >
          <Minus className="w-4 h-4 text-gray-500" />
        </button>
        <span className="w-10 text-center text-sm font-bold tabular-nums">{qty.toLocaleString("fa-IR")}</span>
        <button
          onClick={() => setQty(Math.min(stock, qty + 1))}
          className="p-2.5 hover:bg-gray-50 transition-colors active:scale-95"
          aria-label="افزایش تعداد"
        >
          <Plus className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <button
        onClick={handleClick}
        disabled={added}
        className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 text-sm ${
          added
            ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
            : "bg-primary text-white hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20 active:scale-[0.97]"
        }`}
      >
        {added ? (
          <>
            <Check className="w-5 h-5" />
            به سبد خرید اضافه شد
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            افزودن به سبد خرید
          </>
        )}
      </button>
    </div>
  );
}
