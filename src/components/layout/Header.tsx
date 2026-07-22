"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X, Store, Search, ChevronLeft, User, Package, ShoppingBag, Phone, Mail } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu";
import { CartBadge } from "@/components/cart/CartBadge";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "خانه" },
  { href: "/products", label: "محصولات" },
  { href: "/account/orders", label: "سفارشات" },
];

const mobileLinks = [
  { href: "/", label: "خانه", icon: Store },
  { href: "/products", label: "محصولات", icon: Package },
  { href: "/cart", label: "سبد خرید", icon: ShoppingBag },
  { href: "/account/orders", label: "سفارشات", icon: ChevronLeft },
  { href: "/account/wishlist", label: "علاقه‌مندی‌ها", icon: Heart },
  { href: "/account", label: "حساب کاربری", icon: User },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/account") return pathname === "/account";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b">
      <div className="hidden md:flex bg-gray-900 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between h-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-gray-400">
              <Phone className="w-3 h-3" />
              ۰۲۱-۱۲۳۴۵۶۷۸
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <Mail className="w-3 h-3" />
              info@example.com
            </span>
          </div>
          <span className="text-gray-400">
            تا ۵۰٪ تخفیف ویژه‌ فصل | <span className="text-primary font-bold">کد: WELCOME10</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-bold text-primary shrink-0">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
            <Store className="w-4 h-4 text-white" />
          </div>
          فروشگاه من
        </Link>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="جستجوی محصول..."
              className="w-full border border-gray-200 hover:border-gray-300 rounded-xl pr-10 pl-4 py-2 text-sm bg-gray-50 focus:bg-white transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-2 rounded-lg transition-colors ${
                isActive(link.href)
                  ? "text-primary font-medium"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-0 right-2 left-2 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-600 active:scale-95"
            aria-label="جستجو"
          >
            <Search className="w-5 h-5" />
          </button>
          <Link
            href="/account/wishlist"
            className="hidden sm:flex p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-600 active:scale-95"
          >
            <Heart className="w-5 h-5" />
          </Link>
          <CartBadge />
          <UserMenu />
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-600 active:scale-95"
            aria-label="منو"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="md:hidden border-t bg-white p-3 animate-fade-in-down">
          <div className="relative">
            <input
              type="text"
              placeholder="جستجوی محصول..."
              className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      )}

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden animate-fade-in backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 md:hidden shadow-2xl animate-slide-in-left flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-primary">فروشگاه من</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors active:scale-95"
                aria-label="بستن منو"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-3 flex flex-col gap-0.5 flex-1 overflow-y-auto">
              {mobileLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-sm ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary font-bold"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t text-xs text-gray-400 text-center">
              فروشگاه من - تضمین اصالت و کیفیت
            </div>
          </div>
        </>
      )}
    </header>
  );
}
