import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-2">سفارش شما ثبت شد</h1>
      <p className="text-gray-500 mb-6">
        از خرید شما متشکریم. سفارش شما با موفقیت ثبت شد و در اسرع وقت پردازش خواهد شد.
      </p>
      {orderId && (
        <p className="text-sm text-gray-400 mb-8">
          کد پیگیری: <span className="font-bold text-gray-700" dir="ltr">{orderId}</span>
        </p>
      )}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/account/orders"
          className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors"
        >
          پیگیری سفارش
        </Link>
        <Link
          href="/products"
          className="flex items-center gap-2 border px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          ادامه خرید
        </Link>
      </div>
    </div>
  );
}
