import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/account/ProfileForm";
import { ChangePasswordForm } from "@/components/account/ChangePasswordForm";
import { Mail, Shield, User as UserIcon } from "lucide-react";

export const metadata: Metadata = { title: "پروفایل", description: "مشاهده و ویرایش اطلاعات حساب کاربری" };

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true, address: true, role: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">پروفایل</h2>

      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center gap-4 pb-4 border-b mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <UserIcon className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="font-bold text-lg">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm mb-6">
          <div className="flex items-center gap-3 text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Shield className="w-4 h-4" />
            <span>{user.role === "ADMIN" ? "مدیر سیستم" : "کاربر عادی"}</span>
          </div>
        </div>

        <ProfileForm name={user.name} phone={user.phone} address={user.address} />
      </div>

      <ChangePasswordForm />
    </div>
  );
}
