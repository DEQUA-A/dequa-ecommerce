"use client";

import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarDays } from "lucide-react";

interface OrderData {
  total: number;
  createdAt: string;
}

interface Props {
  orders: OrderData[];
}

type Period = "daily" | "weekly" | "monthly";

function formatPrice(v: number) {
  return v.toLocaleString("fa-IR") + " تومان";
}

export function SalesChart({ orders }: Props) {
  const [period, setPeriod] = useState<Period>("daily");

  const chartData = useMemo(() => {
    const groups: Record<string, number> = {};

    for (const order of orders) {
      const d = new Date(order.createdAt);
      let key: string;

      if (period === "daily") {
        key = d.toLocaleDateString("fa-IR", { month: "short", day: "numeric" });
      } else if (period === "weekly") {
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        key = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
      } else {
        key = d.toLocaleDateString("fa-IR", { year: "numeric", month: "long" });
      }

      groups[key] = (groups[key] || 0) + order.total;
    }

    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [orders, period]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <CalendarDays className="w-4 h-4 text-primary" />
          </div>
          <h2 className="font-bold text-sm">نمودار فروش</h2>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all duration-200 ${
                period === p ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {{ daily: "روزانه", weekly: "هفتگی", monthly: "ماهانه" }[p]}
            </button>
          ))}
        </div>
      </div>

      <div dir="ltr" className="h-80">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">داده‌ای وجود ندارد</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={11} tick={{ fill: "#9ca3af" }} />
              <YAxis fontSize={11} tick={{ fill: "#9ca3af" }} tickFormatter={(v) => (v / 10000).toFixed(0) + "k"} />
              <Tooltip formatter={(v) => formatPrice(Number(v))} contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="value" fill="#e74c3c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
