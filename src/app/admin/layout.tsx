"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tags,
  Percent,
  BarChart3,
  Building2,
  Menu,
  X,
  Store,
  ChevronLeft,
} from "lucide-react";

const sidebarItems = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: Tags },
  { href: "/admin/brands", label: "برندها", icon: Building2 },
  { href: "/admin/orders", label: "سفارشات", icon: ShoppingBag },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/discounts", label: "تخفیف‌ها", icon: Percent },
  { href: "/admin/analytics", label: "آمار", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    if (href === "/admin/orders") return pathname === "/admin/orders" || pathname.startsWith("/admin/orders/");
    if (href === "/admin/products") return pathname === "/admin/products" || pathname.startsWith("/admin/products/");
    if (href === "/admin/users") return pathname === "/admin/users" || pathname.startsWith("/admin/users/");
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      <aside className="w-60 bg-gray-900 text-white shrink-0 hidden md:flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-2">
            <Store className="w-3.5 h-3.5" />
            بازگشت به فروشگاه
          </Link>
          <Link href="/admin" className="text-base font-bold text-white">
            پنل مدیریت
          </Link>
        </div>
        <nav className="p-3 flex flex-col gap-0.5 flex-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                isActive(item.href)
                  ? "bg-primary/20 text-primary font-bold"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive(item.href) ? "text-primary" : ""}`} />
              {item.label}
              {isActive(item.href) && (
                <ChevronLeft className="w-3.5 h-3.5 mr-auto text-primary" />
              )}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
          فروشگاه من v1.0
        </div>
      </aside>

      <div className="md:hidden fixed top-0 right-0 left-0 z-40 bg-white border-b h-14 flex items-center px-4 shadow-sm">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors active:scale-95"
          aria-label="منو"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="mr-3 font-bold text-sm text-primary">پنل مدیریت</span>
      </div>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden animate-fade-in backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed top-0 right-0 bottom-0 w-64 bg-white z-50 md:hidden shadow-2xl animate-slide-in-left flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold text-sm text-primary">پنل مدیریت</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors active:scale-95"
                aria-label="بستن منو"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-3 flex flex-col gap-0.5 flex-1 overflow-y-auto">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary font-bold"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t text-xs text-gray-400 text-center">
              <Link href="/" className="hover:text-primary transition-colors">
                بازگشت به فروشگاه
              </Link>
            </div>
          </aside>
        </>
      )}

      <main className="flex-1 min-w-0 md:p-6 pt-20 md:pt-6">{children}</main>
    </div>
  );
}
