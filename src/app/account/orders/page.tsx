import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Package, ChevronLeft } from "lucide-react";
import Link from "next/link";

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR") + " تومان";
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "در انتظار بررسی", color: "bg-yellow-100 text-yellow-700" },
  PROCESSING: { label: "در حال پردازش", color: "bg-blue-100 text-blue-700" },
  SHIPPED: { label: "ارسال شده", color: "bg-purple-100 text-purple-700" },
  COMPLETED: { label: "تحویل شده", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "لغو شده", color: "bg-red-100 text-red-700" },
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">سفارشات من</h2>
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">شما هیچ سفارشی ندارید</p>
          <Link href="/products" className="text-primary text-sm hover:underline mt-2 inline-block">
            مشاهده محصولات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">سفارشات من</h2>
      <div className="space-y-4">
        {orders.map((order) => {
          const statusInfo = statusMap[order.status] || { label: order.status, color: "bg-gray-100 text-gray-700" };
          return (
            <div key={order.id} className="border rounded-2xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div>
                  <span className="text-xs text-gray-400" dir="ltr">
                    {order.createdAt.toLocaleDateString("fa-IR")}
                  </span>
                  <span className="text-xs text-gray-400 mx-2">|</span>
                  <span className="text-xs text-gray-400" dir="ltr">
                    کد: {order.id.slice(0, 8)}...
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
                  <span className="font-bold">{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {item.image && (
                        <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-50" />
                      )}
                      <span className="text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-gray-500">
                      {item.qty.toLocaleString("fa-IR")} × {formatPrice(item.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
