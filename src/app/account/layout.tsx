"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShoppingBag, Heart, LogOut, ChevronLeft, Store } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const sidebarItems = [
  { href: "/account", label: "پروفایل", icon: User },
  { href: "/account/orders", label: "سفارشات", icon: ShoppingBag },
  { href: "/account/wishlist", label: "علاقه‌مندی‌ها", icon: Heart },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    setMounted(true);
  }, []);

  const initials = user?.name?.trim()
    ? user.name.trim().split(" ").filter(Boolean).map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl font-bold mb-6">حساب کاربری</h1>
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            <div className="hidden md:flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">
                {mounted ? initials : "?"}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{mounted && user ? user.name : "کاربر"}</p>
                <p className="text-[10px] text-gray-400 truncate">{mounted && user ? user.email : ""}</p>
              </div>
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all shrink-0 md:shrink md:mb-2"
            >
              <Store className="w-3.5 h-3.5" />
              بازگشت به فروشگاه
            </Link>

            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/account" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 shrink-0 md:shrink ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {isActive && <ChevronLeft className="w-4 h-4 mr-auto hidden md:block" />}
                </Link>
              );
            })}

            <hr className="my-2 hidden md:block border-gray-100" />

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all duration-200 w-full"
            >
              <LogOut className="w-4 h-4" />
              خروج از حساب
            </button>
          </nav>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="md:hidden fixed bottom-20 right-4 z-40 w-12 h-12 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 transition-all active:scale-95"
            title="خروج"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </aside>

        <main className="flex-1 min-w-0 pb-16 md:pb-0">{children}</main>
      </div>
    </div>
  );
}
