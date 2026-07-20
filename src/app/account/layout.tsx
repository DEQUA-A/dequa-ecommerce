import Link from "next/link";
import { User, ShoppingBag, Heart } from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";

const sidebarItems = [
  { href: "/account", label: "پروفایل", icon: User },
  { href: "/account/orders", label: "سفارشات", icon: ShoppingBag },
  { href: "/account/wishlist", label: "علاقه‌مندی‌ها", icon: Heart },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">حساب کاربری</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-56 shrink-0">
          <nav className="flex flex-col gap-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            <hr className="my-2" />
            <SignOutButton />
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
