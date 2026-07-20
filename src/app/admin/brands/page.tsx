import { prisma } from "@/lib/db";
import { BrandManager } from "@/components/admin/BrandManager";

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">مدیریت برندها</h1>
      <BrandManager brands={brands} />
    </div>
  );
}
