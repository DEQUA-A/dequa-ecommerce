"use client";

import { ShoppingCart, Check } from "lucide-react";
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

  if (stock === 0) {
    return (
      <button disabled className="w-full bg-gray-200 text-gray-500 py-3 rounded-xl font-bold cursor-not-allowed">
        ناموجود
      </button>
    );
  }

  function handleClick() {
    addItem({ productId, variantId, name, price, discountPrice, image, stock, variantLabel });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
        added
          ? "bg-green-500 text-white"
          : "bg-primary text-white hover:bg-primary-hover"
      }`}
    >
      {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
      {added ? "به سبد خرید اضافه شد" : "افزودن به سبد خرید"}
    </button>
  );
}
