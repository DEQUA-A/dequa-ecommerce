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
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-60 bg-white border-l shrink-0 hidden md:flex flex-col">
        <div className="p-4 border-b">
          <Link href="/admin" className="text-lg font-bold text-primary">
            پنل مدیریت
          </Link>
        </div>
        <nav className="p-3 flex flex-col gap-1 flex-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                isActive(item.href)
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="md:hidden fixed top-0 right-0 left-0 z-40 bg-white border-b h-14 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="منو"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="mr-3 font-bold text-sm text-primary">پنل مدیریت</span>
      </div>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed top-0 right-0 bottom-0 w-64 bg-white z-50 md:hidden shadow-xl animate-slide-in-left">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold text-primary">پنل مدیریت</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="بستن منو"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 flex flex-col gap-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}

      <main className="flex-1 min-w-0 md:p-6 pt-20 md:pt-6">{children}</main>
    </div>
  );
}
