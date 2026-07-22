import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/account/ProfileForm";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";
import { Mail, Shield, Calendar } from "lucide-react";

export const metadata: Metadata = { title: "پروفایل", description: "مشاهده و ویرایش اطلاعات حساب کاربری" };

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true, address: true, role: true, createdAt: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 pb-6 border-b border-gray-100 mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl md:text-2xl shadow-md shrink-0">
            {getInitials(user.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg md:text-xl">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-500 shrink-0">
            <Shield className="w-3.5 h-3.5" />
            {user.role === "ADMIN" ? "مدیر سیستم" : "کاربر عادی"}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400">ایمیل</p>
              <p className="text-sm font-bold truncate" dir="ltr">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400">تاریخ عضویت</p>
              <p className="text-sm font-bold">
                {user.createdAt.toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        <ProfileForm name={user.name} phone={user.phone} address={user.address} />
      </div>

      <ChangePasswordForm />
    </div>
  );
}
