import { prisma } from "@/lib/db";
import { SalesChart } from "@/components/admin/SalesChart";

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">آمار فروش</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">کل فروش</p>
          <p className="text-2xl font-bold mt-1">{formatPrice(revenue)}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">تعداد سفارشات</p>
          <p className="text-2xl font-bold mt-1">{totalOrders.toLocaleString("fa-IR")}</p>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <p className="text-sm text-gray-500">میانگین هر سفارش</p>
          <p className="text-2xl font-bold mt-1">{formatPrice(avgOrder)}</p>
        </div>
      </div>

      <SalesChart orders={orders.map((o) => ({ total: o.total, createdAt: o.createdAt.toISOString() }))} />
    </div>
  );
}
