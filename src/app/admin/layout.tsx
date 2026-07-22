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
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

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
      <aside className="w-64 bg-gray-900 text-white shrink-0 hidden lg:flex flex-col">
        <div className="p-5 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors mb-3">
            <Store className="w-3.5 h-3.5" />
            بازگشت به فروشگاه
          </Link>
          <Link href="/admin" className="text-base font-bold text-white flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
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
                  ? "bg-primary/20 text-primary font-bold shadow-sm"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive(item.href) ? "text-primary" : ""}`} />
              <span>{item.label}</span>
              {isActive(item.href) && (
                <ChevronLeft className="w-3.5 h-3.5 mr-auto text-primary" />
              )}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="w-3.5 h-3.5" />
            خروج
          </button>
          <p className="text-[10px] text-gray-600 mt-2">فروشگاه من v1.0</p>
          <p className="text-[9px] text-gray-700/50 tracking-wider font-mono mt-1">DEQUA | MMADI</p>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 right-0 left-0 z-40 bg-white border-b h-14 flex items-center px-4 shadow-sm">
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
            className="fixed inset-0 bg-black/40 z-40 lg:hidden animate-fade-in backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-2xl animate-slide-in-left flex flex-col">
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-sm">پنل مدیریت</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors active:scale-95"
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
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-sm ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary font-bold"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive(item.href) ? "text-primary" : ""}`} />
                  <span>{item.label}</span>
                  {isActive(item.href) && (
                    <ChevronLeft className="w-4 h-4 mr-auto text-primary" />
                  )}
                </Link>
              ))}
            </nav>
            <div className="p-5 border-t space-y-3">
              <Link href="/" className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary transition-colors">
                <Store className="w-3.5 h-3.5" />
                بازگشت به فروشگاه
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 text-xs text-red-500 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                خروج
              </button>
            </div>
          </aside>
        </>
      )}

      <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 pt-20 lg:pt-8">{children}</main>
    </div>
  );
}
