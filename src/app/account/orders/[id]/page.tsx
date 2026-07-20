import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ChevronRight, MapPin, Phone, User, Mail } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

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

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order || order.userId !== session.user.id) notFound();

  const statusInfo = statusMap[order.status] || { label: order.status, color: "bg-gray-100 text-gray-700" };

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/account/orders" className="hover:text-primary flex items-center gap-1">
          <ChevronRight className="w-3 h-3" />
          سفارشات
        </Link>
        <span>/</span>
        <span className="text-gray-800">{order.id.slice(0, 8)}...</span>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold mb-1">سفارش #{order.id.slice(0, 8)}</h2>
            <p className="text-sm text-gray-500">
              تاریخ ثبت: {order.createdAt.toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${statusInfo.color}`}>{statusInfo.label}</span>
            <span className="text-xl font-bold">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            اطلاعات تحویل
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span>{order.fullName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span dir="ltr">{order.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <span>{order.address}، {order.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span dir="ltr">{order.postalCode}</span>
            </div>
            {order.notes && (
              <p className="text-gray-500 bg-gray-50 p-3 rounded-lg mt-2">{order.notes}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-bold mb-4">محصولات سفارش</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0">
                {item.image && (
                  <img src={item.image} alt="" className="w-14 h-14 rounded-xl object-cover bg-gray-50 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">تعداد: {item.qty.toLocaleString("fa-IR")}</p>
                </div>
                <span className="text-sm font-bold">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
