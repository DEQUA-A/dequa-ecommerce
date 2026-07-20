"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors text-sm w-full text-right"
    >
      <LogOut className="w-4 h-4" />
      خروج
    </button>
  );
}
