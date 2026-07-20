import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold text-primary">
          فروشگاه من
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-primary transition-colors">خانه</Link>
          <Link href="/products" className="hover:text-primary transition-colors">محصولات</Link>
          <Link href="/account/orders" className="hover:text-primary transition-colors">سفارشات</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/account/wishlist" className="hover:text-primary transition-colors">
            <Heart className="w-5 h-5" />
          </Link>
          <Link href="/cart" className="hover:text-primary transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </Link>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
