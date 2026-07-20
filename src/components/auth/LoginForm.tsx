"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Props {
  callbackUrl?: string;
}

export function LoginForm({ callbackUrl = "/account" }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      <Input
        label="ایمیل"
        name="email"
        type="email"
        dir="ltr"
        placeholder="example@email.com"
        required
      />

      <Input
        label="رمز عبور"
        name="password"
        type="password"
        placeholder="••••••••"
        required
      />

      <Button type="submit" loading={loading}>
        ورود
      </Button>
    </form>
  );
}
