import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Mail, Phone, User as UserIcon, Shield } from "lucide-react";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { name, email, role } = session.user;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">پروفایل</h2>

      <div className="bg-white rounded-xl border p-6 space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <UserIcon className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="font-bold text-lg">{name}</p>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Shield className="w-4 h-4" />
            <span>
              {role === "ADMIN" ? "مدیر سیستم" : "کاربر عادی"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
