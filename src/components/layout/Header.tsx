import Link from "next/link";
import { Heart } from "lucide-react";
import { UserMenu } from "@/components/auth/UserMenu";
import { CartBadge } from "@/components/cart/CartBadge";

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
          <CartBadge />

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
