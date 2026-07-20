import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tags,
  Percent,
  BarChart3,
  Building2,
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
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-60 bg-white border-l shrink-0 hidden md:block">
        <div className="p-4 border-b">
          <Link href="/admin" className="text-lg font-bold text-primary">
            پنل مدیریت
          </Link>
        </div>
        <nav className="p-3 flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 min-w-0 p-6">{children}</main>
    </div>
  );
}
