"use client";

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { IndianRupee, ShoppingBag, AlertTriangle, Users, Package, RotateCcw, Star, Clock } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { apiGet } from '@/lib/api';

// --- MOCK DATA ---
const mockData = {
  today: {
    revenue: 4500,
    ordersPlaced: 12,
    pendingAction: 5,
    lowStock: 2,
    newSignups: 3,
    salesTrend: [
      { label: '9 AM', revenue: 500 },
      { label: '12 PM', revenue: 1200 },
      { label: '3 PM', revenue: 800 },
      { label: '6 PM', revenue: 1500 },
      { label: '9 PM', revenue: 500 },
    ],
    topProducts: [
      { name: "Amigurumi Bunny", units: 5, revenue: 4250 },
      { name: "Custom Name Keychain", units: 4, revenue: 1000 },
      { name: "Crochet Coaster Set", units: 2, revenue: 800 },
      { name: "Sunflower Bouquet", units: 1, revenue: 1500 },
    ],
    categories: [
      { name: 'Toys', value: 40 },
      { name: 'Accessories', value: 30 },
      { name: 'Home Decor', value: 20 },
      { name: 'Apparel', value: 10 },
    ]
  },
  week: {
    revenue: 41100,
    ordersPlaced: 117,
    pendingAction: 15,
    lowStock: 8,
    newSignups: 45,
    salesTrend: [
      { label: 'Mon', revenue: 4500 },
      { label: 'Tue', revenue: 5200 },
      { label: 'Wed', revenue: 3800 },
      { label: 'Thu', revenue: 6100 },
      { label: 'Fri', revenue: 5900 },
      { label: 'Sat', revenue: 7200 },
      { label: 'Sun', revenue: 8400 },
    ],
    topProducts: [
      { name: "Custom Crochet Blanket", units: 25, revenue: 45000 },
      { name: "Granny Square Cardigan", units: 10, revenue: 32000 },
      { name: "Amigurumi Bunny", units: 80, revenue: 12000 },
      { name: "Chunky Winter Beanie", units: 35, revenue: 8500 },
      { name: "Sunflower Bouquet", units: 20, revenue: 30000 },
    ],
    categories: [
      { name: 'Toys', value: 35 },
      { name: 'Apparel', value: 30 },
      { name: 'Home Decor', value: 25 },
      { name: 'Accessories', value: 10 },
    ]
  },
  month: {
    revenue: 185000,
    ordersPlaced: 540,
    pendingAction: 22,
    lowStock: 14,
    newSignups: 180,
    salesTrend: [
      { label: 'Week 1', revenue: 42000 },
      { label: 'Week 2', revenue: 48000 },
      { label: 'Week 3', revenue: 41000 },
      { label: 'Week 4', revenue: 54000 },
    ],
    topProducts: [
      { name: "Custom Crochet Blanket", units: 110, revenue: 198000 },
      { name: "Sunflower Bouquet", units: 85, revenue: 127500 },
      { name: "Granny Square Cardigan", units: 45, revenue: 144000 },
      { name: "Amigurumi Bunny", units: 320, revenue: 48000 },
      { name: "Crochet Coaster Set", units: 150, revenue: 60000 },
    ],
    categories: [
      { name: 'Apparel', value: 35 },
      { name: 'Toys', value: 30 },
      { name: 'Home Decor', value: 25 },
      { name: 'Accessories', value: 10 },
    ]
  }
};

const COLORS = ['#171717', '#e11d48', '#10b981', '#f59e0b'];

import useSWR from 'swr';

const fetcher = (url: string) => apiGet<any>(url);

export default function AdminDashboardPage() {
  const [timeframe, setTimeframe] = useState<"today" | "week" | "month">("week");
  
  const { data, error, isLoading } = useSWR('/analytics', fetcher, {
    refreshInterval: 60000, // Refresh every minute
    revalidateOnFocus: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        <span className="ml-3 text-neutral-500 font-medium">Loading analytics...</span>
      </div>
    );
  }

  const currentData = data?.[timeframe] || mockData[timeframe];

  return (
    <>
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Dashboard Overview</h1>
          <p className="text-neutral-500 mt-1">Here's what's happening with your store.</p>
        </div>
        <div className="flex bg-neutral-100 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setTimeframe("today")}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${timeframe === "today" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"}`}
          >
            Today
          </button>
          <button 
            onClick={() => setTimeframe("week")}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${timeframe === "week" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"}`}
          >
            This Week
          </button>
          <button 
            onClick={() => setTimeframe("month")}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${timeframe === "month" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900"}`}
          >
            This Month
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-200">
          <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-600 mb-3">
            <IndianRupee size={20} />
          </div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Revenue</p>
          <p className="text-2xl font-black tracking-tight">₹{currentData.revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-200">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3">
            <ShoppingBag size={20} />
          </div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Orders Placed</p>
          <p className="text-2xl font-black tracking-tight">{currentData.ordersPlaced}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-200">
          <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-600 mb-3">
            <Clock size={20} />
          </div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Pending Action</p>
          <p className="text-2xl font-black tracking-tight text-rose-600">{currentData.pendingAction}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-200">
          <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-3">
            <AlertTriangle size={20} />
          </div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Low Stock Alerts</p>
          <p className="text-2xl font-black tracking-tight">{currentData.lowStock}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-200 col-span-2 lg:col-span-1">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-3">
            <Users size={20} />
          </div>
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">New Signups</p>
          <p className="text-2xl font-black tracking-tight">{currentData.newSignups}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/orders" className="bg-neutral-900 text-white p-4 rounded-2xl flex items-center justify-between hover:bg-neutral-800 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><Package size={20}/></div>
              <span className="font-bold">Orders Needing Packing</span>
            </div>
            <span className="bg-rose-500 text-white text-xs font-black px-2 py-1 rounded-full">{currentData.pendingAction}</span>
          </Link>
          <Link href="/admin/returns" className="bg-white border border-neutral-200 text-neutral-900 p-4 rounded-2xl flex items-center justify-between hover:border-neutral-300 transition-colors group shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center"><RotateCcw size={20}/></div>
              <span className="font-bold">Returns Awaiting Approval</span>
            </div>
            <span className="bg-neutral-100 text-neutral-600 text-xs font-black px-2 py-1 rounded-full">3</span>
          </Link>
          <Link href="/admin/reviews" className="bg-white border border-neutral-200 text-neutral-900 p-4 rounded-2xl flex items-center justify-between hover:border-neutral-300 transition-colors group shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center"><Star size={20}/></div>
              <span className="font-bold">Reviews to Moderate</span>
            </div>
            <span className="bg-neutral-100 text-neutral-600 text-xs font-black px-2 py-1 rounded-full">12</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-neutral-200">
          <h2 className="text-lg font-bold mb-6">Sales Trend</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} tickFormatter={(value) => `₹${value}`} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#f5f5f5' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  formatter={(value: any) => [`₹${value}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#171717" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Split */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-200">
          <h2 className="text-lg font-bold mb-6">Category Performance</h2>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={currentData.categories}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {currentData.categories.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                  formatter={(value: any) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col mt-2">
              <span className="text-xs font-bold text-neutral-400 uppercase">Top Category</span>
              <span className="text-xl font-black">{currentData.categories?.[0]?.name || 'N/A'}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            {currentData.categories.map((cat: any, idx: number) => (
              <div key={cat.name} className="flex items-center gap-2 text-xs font-bold text-neutral-600">
                <span className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}}></span>
                {cat.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-200">
        <h2 className="text-lg font-bold mb-6 flex justify-between items-center">
          Top 5 Products
          <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">By Revenue</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 text-xs uppercase tracking-wider text-neutral-500">
                <th className="pb-4 font-bold">Product Name</th>
                <th className="pb-4 font-bold text-right">Units Sold</th>
                <th className="pb-4 font-bold text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {currentData.topProducts.map((prod: any, idx: number) => (
                <tr key={idx} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center text-xs font-bold group-hover:bg-white transition-colors">{idx + 1}</span>
                      <span className="font-bold text-sm">{prod.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right text-sm text-neutral-600 font-medium">{prod.units}</td>
                  <td className="py-4 text-right text-sm font-bold">₹{prod.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
}
