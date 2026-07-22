import Link from "next/link";
import { Store } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-10">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">فروشگاه من</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
