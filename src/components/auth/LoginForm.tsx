"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

interface Props {
  callbackUrl?: string;
}

export function LoginForm({ callbackUrl = "/account" }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!email.trim() || !password.trim()) {
      setError("لطفا ایمیل و رمز عبور را وارد کنید");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("ایمیل یا رمز عبور اشتباه است");
        setLoading(false);
        return;
      }

      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setError("خطایی رخ داد. لطفا دوباره تلاش کنید.");
        setLoading(false);
      }
    } catch {
      setError("خطایی رخ داد. لطفا دوباره تلاش کنید.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200 flex items-center gap-2 animate-fade-in-down">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <Input
        label="ایمیل"
        name="email"
        type="email"
        dir="ltr"
        placeholder="example@email.com"
        autoComplete="email"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          رمز عبور
        </label>
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className="w-full px-4 py-2.5 border border-gray-300 hover:border-gray-400 rounded-xl text-sm transition-all duration-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 pl-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        ورود
      </Button>
    </form>
  );
}
