"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 30% 40%, rgba(231,76,60,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(102,126,234,0.3) 0%, transparent 50%)",
      }} />
      <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-primary/30">
            <Mail className="w-7 h-7 md:w-8 md:h-8 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">از تخفیف‌ها باخبر شوید</h2>
          <p className="text-gray-400 text-sm md:text-base mb-6 max-w-md mx-auto">
            با عضویت در خبرنامه، اولین نفری باشید که از تخفیف‌های ویژه و محصولات جدید مطلع می‌شوید
          </p>

          {submitted ? (
            <div className="inline-flex items-center gap-3 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-2xl px-6 py-4 animate-fade-in">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">با موفقیت عضو شدید!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ایمیل خود را وارد کنید"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pr-11 pl-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-primary focus:bg-white/15 transition-all duration-200"
                  required
                  dir="ltr"
                />
              </div>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-[0.97] inline-flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>عضویت</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
