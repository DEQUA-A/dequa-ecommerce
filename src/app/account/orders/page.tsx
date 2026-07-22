import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Package, ChevronLeft, Clock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "سفارشات من", description: "مشاهده لیست سفارشات" };

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR") + " تومان";
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  PENDING: { label: "در انتظار بررسی", color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  PROCESSING: { label: "در حال پردازش", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  SHIPPED: { label: "ارسال شده", color: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" },
  COMPLETED: { label: "تحویل شده", color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
  CANCELLED: { label: "لغو شده", color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
};

function OrderStatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || { label: status, color: "bg-gray-50 text-gray-700 border-gray-200", dot: "bg-gray-500" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

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
      <div className="animate-fade-in-up">
        <h2 className="text-xl font-bold mb-6">سفارشات من</h2>
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-5">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold mb-2">هنوز سفارشی ثبت نکرده‌اید</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
            با ثبت اولین سفارش خود، می‌توانید وضعیت آن را در این بخش پیگیری کنید.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-hover transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-[0.97]"
          >
            مشاهده محصولات
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-xl font-bold mb-6">سفارشات من</h2>
      <div className="space-y-4">
        {orders.map((order) => {
          const cfg = statusConfig[order.status] || { label: order.status, color: "bg-gray-50 text-gray-700 border-gray-200", dot: "bg-gray-500" };
          return (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block bg-white border border-gray-100 rounded-2xl p-4 md:p-6 hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm">
                      سفارش #{order.id.slice(0, 8)}
                    </h3>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>
                      {order.createdAt.toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                  <ChevronLeft className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                {order.items.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                ))}
                {order.items.length > 4 && (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-100 border border-gray-100 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-gray-500">
                      +{order.items.length - 4}
                    </span>
                  </div>
                )}
                {order.items.length === 0 && (
                  <span className="text-xs text-gray-400">بدون آیتم</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
