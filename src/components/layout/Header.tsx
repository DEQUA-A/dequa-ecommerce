"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X, Store } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu";
import { CartBadge } from "@/components/cart/CartBadge";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "خانه" },
  { href: "/products", label: "محصولات" },
  { href: "/account/orders", label: "سفارشات" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Store className="w-6 h-6" />
          فروشگاه من
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive(link.href)
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/account/wishlist"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
          >
            <Heart className="w-5 h-5" />
          </Link>
          <CartBadge />
          <UserMenu />
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="منو"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-64 bg-white z-50 md:hidden shadow-xl animate-slide-in-left">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold text-primary">فروشگاه من</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="بستن منو"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
