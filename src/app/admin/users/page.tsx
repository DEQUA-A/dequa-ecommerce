import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { UserRoleToggle } from "@/components/admin/UserRoleToggle";
import { Search, Users } from "lucide-react";

export const metadata: Metadata = { title: "مدیریت کاربران", description: "مشاهده و مدیریت کاربران فروشگاه" };

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
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
          <p className="text-sm text-gray-500">{users.length.toLocaleString("fa-IR")} کاربر</p>
        </div>
      </div>

      <form className="relative mb-6 max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          name="q"
          defaultValue={q || ""}
          placeholder="جستجوی کاربر..."
          className="w-full pr-10 pl-4 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </form>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">نام</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">ایمیل</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">تاریخ ثبت</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">سفارشات</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">نقش</th>
                <th className="text-right px-4 py-3.5 font-bold text-xs text-gray-500 tracking-wide">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-sm">{user.name}</td>
                  <td className="px-4 py-3.5 text-gray-500 text-sm" dir="ltr">{user.email}</td>
                  <td className="px-4 py-3.5 text-gray-500 text-sm">{user.createdAt.toLocaleDateString("fa-IR")}</td>
                  <td className="px-4 py-3.5 text-gray-500 text-sm">{user._count.orders.toLocaleString("fa-IR")}</td>
                  <td className="px-4 py-3.5"><UserRoleToggle userId={user.id} currentRole={user.role} /></td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      user.active
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${user.active ? "bg-green-500" : "bg-red-500"}`} />
                      {user.active ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                      <Users className="w-12 h-12 mb-3 text-gray-200" />
                      <p className="text-sm font-bold">کاربری یافت نشد</p>
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
