import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { DollarSign, ShoppingBag, Users, Package, ChevronLeft, Clock, UserIcon } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "داشبورد", description: "پنل مدیریت فروشگاه" };

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR") + " تومان";
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  PENDING: { label: "در انتظار", color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  PROCESSING: { label: "پردازش", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  SHIPPED: { label: "ارسال", color: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" },
  COMPLETED: { label: "تحویل", color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
  CANCELLED: { label: "لغو", color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};

export default async function AdminDashboard() {
  const [totalProducts, totalOrders, totalUsers, orders, recentUsers] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({
      include: { user: { select: { name: true } }, items: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
  ]);

  const revenue = await prisma.order.aggregate({ _sum: { total: true } });
  const totalRevenue = revenue._sum.total || 0;

  const stats = [
    { label: "کل فروش", value: formatPrice(totalRevenue), icon: DollarSign, color: "bg-blue-500", sub: "از ابتدا" },
    { label: "سفارشات", value: totalOrders.toLocaleString("fa-IR"), icon: ShoppingBag, color: "bg-emerald-500", sub: "ثبت شده" },
    { label: "محصولات", value: totalProducts.toLocaleString("fa-IR"), icon: Package, color: "bg-violet-500", sub: "در فروشگاه" },
    { label: "کاربران", value: totalUsers.toLocaleString("fa-IR"), icon: Users, color: "bg-orange-500", sub: "ثبت نام" },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">داشبورد</h1>
          <p className="text-sm text-gray-500">خلاصه وضعیت فروشگاه</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 p-5 animate-fade-in-up hover:shadow-md transition-shadow duration-200"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${stat.color} flex items-center justify-center shadow-sm`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="font-bold text-sm">سفارشات اخیر</h2>
            </div>
            <Link href="/admin/orders" className="text-xs text-primary hover:text-primary-hover font-bold flex items-center gap-1 transition-colors">
              همه <ChevronLeft className="w-3 h-3" />
            </Link>
          </div>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">سفارشی وجود ندارد</div>
          ) : (
            <div className="space-y-1">
              {orders.map((order) => {
                const sc = statusConfig[order.status] || statusConfig.PENDING;
                return (
                  <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold truncate">{order.user.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatPrice(order.total)}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 mr-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${sc.color}`}>
                        <span className={`w-1 h-1 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-orange-600" />
              </div>
              <h2 className="font-bold text-sm">کاربران جدید</h2>
            </div>
            <Link href="/admin/users" className="text-xs text-primary hover:text-primary-hover font-bold flex items-center gap-1 transition-colors">
              همه <ChevronLeft className="w-3 h-3" />
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">کاربری وجود ندارد</div>
          ) : (
            <div className="space-y-1">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 shrink-0 mr-3">
                    <Clock className="w-3 h-3" />
                    <span>{user.createdAt.toLocaleDateString("fa-IR")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
