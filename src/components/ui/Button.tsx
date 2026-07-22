"use client";

import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
}

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20 active:scale-[0.97]",
  secondary:
    "bg-gray-800 text-white hover:bg-gray-700 hover:shadow-lg active:scale-[0.97]",
  outline:
    "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:scale-[0.97]",
  ghost:
    "text-gray-600 hover:bg-gray-100 active:scale-[0.97]",
  danger:
    "bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.97]",
};

export function Button({
  children,
  loading = false,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
