"use client";

import { Download, TrendingUp, PackageSearch, Users, FileText, Calendar } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="max-w-6xl mx-auto pb-24">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Reports & Exports</h1>
          <p className="text-neutral-500 mt-1">Generate comprehensive business reports for analysis and accounting.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sales Report */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-neutral-100 flex items-center gap-4 bg-emerald-50/50">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-200 shadow-sm shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <h2 className="font-black text-lg text-emerald-950">Sales Performance</h2>
              <p className="text-xs font-medium text-emerald-700/80 mt-0.5">Revenue breakdown by product & category</p>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-neutral-400 uppercase tracking-wider mb-2">Date Range</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input type="date" className="w-full pl-9 pr-3 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold text-neutral-700" />
                  </div>
                  <span className="text-neutral-400 font-bold">to</span>
                  <div className="relative flex-1">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input type="date" className="w-full pl-9 pr-3 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold text-neutral-700" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-neutral-400 uppercase tracking-wider mb-2">Format</label>
                <select className="w-full border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold text-neutral-700 bg-white">
                  <option>CSV (Excel compatible)</option>
                  <option>JSON</option>
                </select>
              </div>
            </div>
            <button className="w-full bg-emerald-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200 flex items-center justify-center gap-2">
              <Download size={18} /> Generate Export
            </button>
          </div>
        </div>

        {/* GST/Tax Report */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-neutral-100 flex items-center gap-4 bg-amber-50/50">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-200 shadow-sm shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="font-black text-lg text-amber-950">GST & Tax Report</h2>
              <p className="text-xs font-medium text-amber-700/80 mt-0.5">India-specific compliance exports (B2B/B2C)</p>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-neutral-400 uppercase tracking-wider mb-2">Filing Period (Month)</label>
                <input type="month" className="w-full border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 outline-none text-sm font-bold text-neutral-700 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-black text-neutral-400 uppercase tracking-wider mb-2">Report Type</label>
                <select className="w-full border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 outline-none text-sm font-bold text-neutral-700 bg-white">
                  <option>GSTR-1 (Sales)</option>
                  <option>GSTR-3B Summary</option>
                </select>
              </div>
            </div>
            <button className="w-full bg-amber-500 text-white px-4 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-md shadow-amber-200 flex items-center justify-center gap-2">
              <Download size={18} /> Generate Export
            </button>
          </div>
        </div>

        {/* Inventory Valuation */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-neutral-100 flex items-center gap-4 bg-blue-50/50">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-200 shadow-sm shrink-0">
              <PackageSearch size={24} />
            </div>
            <div>
              <h2 className="font-black text-lg text-blue-950">Inventory Valuation</h2>
              <p className="text-xs font-medium text-blue-700/80 mt-0.5">Asset value based on current stock levels</p>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-medium text-neutral-600 leading-relaxed">
                Generates a snapshot of current inventory quantities multiplied by unit cost and retail price to calculate total asset holding value.
              </p>
              <div>
                <label className="block text-xs font-black text-neutral-400 uppercase tracking-wider mb-2">Include Made-to-Order?</label>
                <select className="w-full border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold text-neutral-700 bg-white">
                  <option>Exclude (Pre-made stock only)</option>
                  <option>Include (at ₹0 holding value)</option>
                </select>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 flex items-center justify-center gap-2">
              <Download size={18} /> Generate Export
            </button>
          </div>
        </div>

        {/* Customer Acquisition */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-neutral-100 flex items-center gap-4 bg-purple-50/50">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center border border-purple-200 shadow-sm shrink-0">
              <Users size={24} />
            </div>
            <div>
              <h2 className="font-black text-lg text-purple-950">Customer Acquisition</h2>
              <p className="text-xs font-medium text-purple-700/80 mt-0.5">UTM and Coupon driven signups/orders</p>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-neutral-400 uppercase tracking-wider mb-2">Time Period</label>
                <select className="w-full border border-neutral-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 outline-none text-sm font-bold text-neutral-700 bg-white">
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>Year to Date</option>
                </select>
              </div>
              <p className="text-sm font-medium text-neutral-500 italic">
                Export includes Source/Medium (UTM), first-order coupon used, and LTV (Lifetime Value) per customer.
              </p>
            </div>
            <button className="w-full bg-purple-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-md shadow-purple-200 flex items-center justify-center gap-2">
              <Download size={18} /> Generate Export
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
