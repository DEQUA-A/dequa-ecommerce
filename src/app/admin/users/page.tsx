import { prisma } from "@/lib/db";
import { UserRoleToggle } from "@/components/admin/UserRoleToggle";
import { Search } from "lucide-react";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const { q } = await searchParams;

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { email: { contains: q } },
    ];
  }

  const users = await prisma.user.findMany({
    where: where as any,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
        <span className="text-sm text-gray-500">{users.length.toLocaleString("fa-IR")} کاربر</span>
      </div>

      <form className="relative mb-6 max-w-md">
        <input
          name="q"
          defaultValue={q || ""}
          placeholder="جستجوی کاربر..."
          className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </form>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-right p-3 font-bold">نام</th>
                <th className="text-right p-3 font-bold">ایمیل</th>
                <th className="text-right p-3 font-bold">تاریخ ثبت</th>
                <th className="text-right p-3 font-bold">سفارشات</th>
                <th className="text-right p-3 font-bold">نقش</th>
                <th className="text-right p-3 font-bold">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3 font-bold">{user.name}</td>
                  <td className="p-3 text-gray-500">{user.email}</td>
                  <td className="p-3 text-gray-500">{user.createdAt.toLocaleDateString("fa-IR")}</td>
                  <td className="p-3 text-gray-500">{user._count.orders.toLocaleString("fa-IR")}</td>
                  <td className="p-3"><UserRoleToggle userId={user.id} currentRole={user.role} /></td>
                  <td className="p-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${user.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {user.active ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-gray-400">کاربری یافت نشد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
