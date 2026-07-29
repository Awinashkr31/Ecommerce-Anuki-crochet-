"use client";

import useSWR from "swr";
import { apiGet } from "@/lib/api";
import { Package, Truck, XCircle, CreditCard, Gift, Archive } from "lucide-react";

const fetcher = (url: string) => apiGet(url);

export default function OrderStatsCards() {
  const { data: stats } = useSWR('/orders/my-orders/analytics', fetcher);

  if (!stats) return null; // or a skeleton

  const statItems = [
    { label: "Total Orders", value: stats.totalOrders, icon: Package, color: "bg-blue-100 text-blue-600" },
    { label: "Active Orders", value: stats.activeOrders, icon: Truck, color: "bg-amber-100 text-amber-600" },
    { label: "Delivered", value: stats.deliveredOrders, icon: Archive, color: "bg-emerald-100 text-emerald-600" },
    { label: "Total Spent", value: `₹${stats.totalSpent?.toFixed(2) || '0.00'}`, icon: CreditCard, color: "bg-purple-100 text-purple-600" },
    { label: "Saved Amount", value: `₹${stats.totalSaved?.toFixed(2) || '0.00'}`, icon: Gift, color: "bg-rose-100 text-rose-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statItems.map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-neutral-300 transition-colors">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${item.color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-black text-neutral-900">{item.value}</p>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mt-1">{item.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
