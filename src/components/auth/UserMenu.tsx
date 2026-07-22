"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";

export function UserMenu() {
  const [mounted, setMounted] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
    );
  }

  if (session?.user) {
    return (
      <Link
        href="/account"
        className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-3 py-1.5"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline max-w-20 truncate">
          {session.user.name}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="text-sm bg-primary text-white hover:bg-primary-hover transition-colors rounded-full px-4 py-1.5"
    >
      ورود
    </Link>
  );
}
