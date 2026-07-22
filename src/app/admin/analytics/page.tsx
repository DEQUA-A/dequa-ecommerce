import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { SalesChart } from "@/components/admin/SalesChart";
import { DollarSign, ShoppingBag, TrendingUp } from "lucide-react";

export const metadata: Metadata = { title: "آمار فروش", description: "آمار و نمودارهای فروش فروشگاه" };

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR") + " تومان";
}

export default async function AdminAnalyticsPage() {
  const orders = await prisma.order.findMany({
    where: { status: { not: "CANCELLED" } },
    select: { total: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length > 0 ? Math.round(revenue / orders.length) : 0;
  const totalOrders = orders.length;

  const stats = [
    { label: "کل فروش", value: formatPrice(revenue), icon: DollarSign, color: "bg-blue-500" },
    { label: "تعداد سفارشات", value: totalOrders.toLocaleString("fa-IR"), icon: ShoppingBag, color: "bg-emerald-500" },
    { label: "میانگین هر سفارش", value: formatPrice(avgOrder), icon: TrendingUp, color: "bg-violet-500" },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">آمار فروش</h1>
          <p className="text-sm text-gray-500">نمودارها و آمار فروش فروشگاه</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 mb-8">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-gray-100 p-5 animate-fade-in-up hover:shadow-md transition-shadow duration-200"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={`w-11 h-11 rounded-xl ${stat.color} flex items-center justify-center mb-4 shadow-sm`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <SalesChart orders={orders.map((o) => ({ total: o.total, createdAt: o.createdAt.toISOString() }))} />
    </div>
  );
}
