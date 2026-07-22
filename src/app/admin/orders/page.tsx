import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";
import Link from "next/link";
import { ChevronLeft, ShoppingBag } from "lucide-react";

export const metadata: Metadata = { title: "مدیریت سفارشات", description: "مشاهده و مدیریت تمام سفارشات" };

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
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">مدیریت سفارشات</h1>
          <p className="text-sm text-gray-500">{orders.length.toLocaleString("fa-IR")} سفارش</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">کد</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">مشتری</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">محصولات</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">تاریخ</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">وضعیت</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">مبلغ</th>
                <th className="text-left px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-xs text-gray-500">#{order.id.slice(0, 8)}</td>
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-sm">{order.user.name}</p>
                    <p className="text-xs text-gray-400">{order.user.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 text-sm">{order.items.length.toLocaleString("fa-IR")} عدد</td>
                  <td className="px-4 py-3.5 text-gray-500 text-sm">{order.createdAt.toLocaleDateString("fa-IR")}</td>
                  <td className="px-4 py-3.5"><OrderStatusBadge orderId={order.id} current={order.status} /></td>
                  <td className="px-4 py-3.5 font-bold text-sm">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-hover font-bold transition-colors"
                    >
                      جزئیات <ChevronLeft className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <ShoppingBag className="w-12 h-12 mb-3 text-gray-200" />
                      <p className="text-sm font-bold">سفارشی وجود ندارد</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
