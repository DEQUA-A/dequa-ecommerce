"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-20 md:bottom-6 left-4 z-40 w-10 h-10 bg-primary text-white rounded-xl shadow-lg hover:bg-primary-hover transition-all duration-300 flex items-center justify-center active:scale-90 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="بازگشت به بالا"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  );
}
