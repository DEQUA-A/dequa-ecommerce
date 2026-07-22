"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, User, Package } from "lucide-react";

const links = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/products", label: "محصولات", icon: Package },
  { href: "/cart", label: "سبد خرید", icon: ShoppingBag },
  { href: "/account/wishlist", label: "علاقه‌مندی", icon: Heart },
  { href: "/account", label: "حساب", icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 right-0 left-0 z-40 bg-white border-t shadow-lg">
      <div className="flex items-center justify-around h-14">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
              isActive(link.href)
                ? "text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <link.icon className="w-5 h-5" />
            <span className="text-[10px] leading-tight">{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
