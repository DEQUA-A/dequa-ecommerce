"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";

export function CartBadge() {
  const [mounted, setMounted] = useState(false);
  const count = useCartStore((s) => s.itemCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link href="/cart" className="hover:text-primary transition-colors relative">
      <ShoppingCart className="w-5 h-5" />
      {mounted && count > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full min-w-4 h-4 flex items-center justify-center px-1">
          {count > 99 ? "99+" : count.toLocaleString("fa-IR")}
        </span>
      )}
    </Link>
  );
}
