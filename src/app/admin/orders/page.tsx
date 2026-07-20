import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import Link from "next/link";

export const metadata: Metadata = { title: "مدیریت سفارشات", description: "مشاهده و مدیریت تمام سفارشات" };
import { ChevronLeft } from "lucide-react";

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR") + " تومان";
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">مدیریت سفارشات</h1>
        <span className="text-sm text-gray-500">{orders.length.toLocaleString("fa-IR")} سفارش</span>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-right p-3 font-bold">کد</th>
                <th className="text-right p-3 font-bold">مشتری</th>
                <th className="text-right p-3 font-bold">محصولات</th>
                <th className="text-right p-3 font-bold">تاریخ</th>
                <th className="text-right p-3 font-bold">وضعیت</th>
                <th className="text-right p-3 font-bold">مبلغ</th>
                <th className="text-right p-3 font-bold">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">{order.id.slice(0, 8)}</td>
                  <td className="p-3">
                    <p className="font-bold">{order.user.name}</p>
                    <p className="text-xs text-gray-500">{order.user.email}</p>
                  </td>
                  <td className="p-3 text-gray-500">{order.items.length.toLocaleString("fa-IR")} عدد</td>
                  <td className="p-3 text-gray-500">{order.createdAt.toLocaleDateString("fa-IR")}</td>
                  <td className="p-3"><OrderStatusBadge orderId={order.id} current={order.status} /></td>
                  <td className="p-3 font-bold">{formatPrice(order.total)}</td>
                  <td className="p-3">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="text-primary text-xs hover:underline flex items-center gap-1"
                    >
                      جزئیات <ChevronLeft className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={7} className="p-6 text-center text-gray-400">سفارشی وجود ندارد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
