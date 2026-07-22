import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { DollarSign, ShoppingBag, Users, Package, ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "داشبورد", description: "پنل مدیریت فروشگاه" };

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR") + " تومان";
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
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
    { label: "کل فروش", value: formatPrice(totalRevenue), icon: DollarSign, color: "bg-blue-500" },
    { label: "سفارشات", value: totalOrders.toLocaleString("fa-IR"), icon: ShoppingBag, color: "bg-green-500" },
    { label: "محصولات", value: totalProducts.toLocaleString("fa-IR"), icon: Package, color: "bg-purple-500" },
    { label: "کاربران", value: totalUsers.toLocaleString("fa-IR"), icon: Users, color: "bg-orange-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">داشبورد</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={stat.label} className="bg-white rounded-xl border p-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3 shadow-sm`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">سفارشات اخیر</h2>
            <Link href="/admin/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
              همه <ChevronLeft className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-bold">{order.user.name}</p>
                  <p className="text-xs text-gray-500">{formatPrice(order.total)}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${statusColors[order.status] || "bg-gray-100"}`}>
                  {{ PENDING: "در انتظار", PROCESSING: "پردازش", SHIPPED: "ارسال", COMPLETED: "تحویل", CANCELLED: "لغو" }[order.status] || order.status}
                </span>
              </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-gray-400">سفارشی وجود ندارد</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">کاربران جدید</h2>
            <Link href="/admin/users" className="text-sm text-primary hover:underline flex items-center gap-1">
              همه <ChevronLeft className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-bold">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <span className="text-xs text-gray-400">{user.createdAt.toLocaleDateString("fa-IR")}</span>
              </div>
            ))}
            {recentUsers.length === 0 && <p className="text-sm text-gray-400">کاربری وجود ندارد</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
