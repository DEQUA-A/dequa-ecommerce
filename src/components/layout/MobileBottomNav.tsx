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
    if (href === "/account") return pathname === "/account";
    return pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 right-0 left-0 z-40 bg-white border-t shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around h-16 px-2">
        {links.map((link) => {
          const active = isActive(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] ${
                active ? "text-primary" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                active ? "bg-primary/10" : ""
              }`}>
                <Icon className="w-5 h-5" />
                {active && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className={`text-[10px] leading-tight font-medium ${
                active ? "font-bold" : ""
              }`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
