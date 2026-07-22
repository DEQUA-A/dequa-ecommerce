import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ChevronRight, MapPin, Phone, User, Mail, Package, Clock, CreditCard, Truck } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

function formatPrice(price: number) {
  return price.toLocaleString("fa-IR") + " تومان";
}

const statusSequence = ["PENDING", "PROCESSING", "SHIPPED", "COMPLETED"];

const statusConfig: Record<string, { label: string; color: string; dot: string; icon: typeof Package }> = {
  PENDING: { label: "در انتظار بررسی", color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500", icon: Clock },
  PROCESSING: { label: "در حال پردازش", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500", icon: Package },
  SHIPPED: { label: "ارسال شده", color: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500", icon: Truck },
  COMPLETED: { label: "تحویل شده", color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500", icon: Package },
  CANCELLED: { label: "لغو شده", color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500", icon: Package },
};

function StatusTimeline({ currentStatus }: { currentStatus: string }) {
  const isCancelled = currentStatus === "CANCELLED";

  if (isCancelled) {
    const cfg = statusConfig.CANCELLED;
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 md:p-6 flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cfg.color}`}>
          <cfg.icon className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-red-700">{cfg.label}</p>
          <p className="text-xs text-red-500">این سفارش لغو شده است</p>
        </div>
      </div>
    );
  }

  const currentIdx = statusSequence.indexOf(currentStatus);
  if (currentIdx === -1) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6">
      <h3 className="font-bold text-sm mb-5 flex items-center gap-2">
        <Truck className="w-4 h-4 text-gray-400" />
        وضعیت سفارش
      </h3>
      <div className="relative flex justify-between">
        {statusSequence.map((status, idx) => {
          const cfg = statusConfig[status];
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={status} className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isDone
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-100 text-gray-300"
                } ${isCurrent ? "ring-2 ring-primary/30 ring-offset-2" : ""}`}
              >
                <cfg.icon className="w-5 h-5" />
              </div>
              <p
                className={`text-[10px] mt-2 font-bold whitespace-nowrap ${
                  isDone ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {cfg.label}
              </p>
            </div>
          );
        })}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(currentIdx / (statusSequence.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order || order.userId !== session.user.id) notFound();

  const isCancelled = order.status === "CANCELLED";
  const cfg = statusConfig[order.status] || statusConfig.PENDING;

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/account/orders" className="hover:text-primary flex items-center gap-1 transition-colors">
          <ChevronRight className="w-3 h-3" />
          سفارشات
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-bold">#{order.id.slice(0, 8)}</span>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cfg.color}`}>
              <cfg.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold">سفارش #{order.id.slice(0, 8)}</h2>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
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
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
            <span className="text-lg font-bold">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <StatusTimeline currentStatus={order.status} />

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            اطلاعات تحویل
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl">
              <User className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-sm">{order.fullName}</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl">
              <Phone className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-sm" dir="ltr">{order.phone}</span>
            </div>
            <div className="flex items-start gap-3 px-3 py-2.5 bg-gray-50 rounded-xl">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <span className="text-sm">{order.address}، {order.city}</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-sm" dir="ltr">{order.postalCode}</span>
            </div>
            {order.notes && (
              <div className="px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
                {order.notes}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-4 md:p-6">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-400" />
            محصولات سفارش
          </h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                {item.image && (
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.qty.toLocaleString("fa-IR")} عدد
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold">{formatPrice(item.price * item.qty)}</p>
                  <p className="text-[10px] text-gray-400">{formatPrice(item.price)} / عدد</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">جمع کل</span>
              <span className="font-bold">{formatPrice(order.total)}</span>
            </div>
          </div>

          {!isCancelled && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-green-600">
              <CreditCard className="w-3.5 h-3.5" />
              پرداخت در محل
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
