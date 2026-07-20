import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { DiscountList } from "@/components/admin/DiscountList";

export const metadata: Metadata = { title: "مدیریت تخفیف‌ها", description: "مدیریت کدهای تخفیف فروشگاه" };

export default async function AdminDiscountsPage() {
  const discounts = await prisma.discount.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">مدیریت تخفیف‌ها</h1>
      <DiscountList discounts={discounts.map((d) => ({
        ...d,
        expiresAt: d.expiresAt?.toISOString() || null,
        createdAt: d.createdAt.toISOString(),
      }))} />
    </div>
  );
}
