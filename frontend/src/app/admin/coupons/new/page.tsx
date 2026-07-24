"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Tag, Settings2, Users, Calendar, Info } from 'lucide-react';

export default function NewCouponPage() {
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [autoApply, setAutoApply] = useState(false);
  const [limitUsage, setLimitUsage] = useState(false);

  return (
    <div className="max-w-4xl mx-auto pb-24 relative">
      
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-50 bg-neutral-50/80 backdrop-blur-md pb-4 pt-2 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <Link href="/admin/coupons" className="p-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Create Campaign</h1>
            <p className="text-sm font-medium text-neutral-500">Configure discounts, limits, and targeting.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-2.5 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors shadow-md shadow-neutral-200 flex items-center justify-center gap-2">
            <Save size={18} /> Save Campaign
          </button>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* Basic Config */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50 flex items-center gap-3">
            <Tag size={20} className="text-rose-600" />
            <h2 className="font-black text-lg text-neutral-900">Discount Configuration</h2>
          </div>
          
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-black text-neutral-900 mb-3">Discount Type</label>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 border border-neutral-200 rounded-2xl cursor-pointer hover:bg-neutral-50 transition-colors bg-white shadow-sm has-[:checked]:border-rose-500 has-[:checked]:ring-1 has-[:checked]:ring-rose-500">
                    <div>
                      <span className="font-bold block text-neutral-900">Percentage</span>
                      <span className="text-xs font-medium text-neutral-500">e.g., 10% off</span>
                    </div>
                    <input type="radio" name="type" value="PERCENTAGE" checked={discountType === 'PERCENTAGE'} onChange={(e) => setDiscountType(e.target.value)} className="w-4 h-4 text-rose-600" />
                  </label>
                  
                  <label className="flex items-center justify-between p-4 border border-neutral-200 rounded-2xl cursor-pointer hover:bg-neutral-50 transition-colors bg-white shadow-sm has-[:checked]:border-rose-500 has-[:checked]:ring-1 has-[:checked]:ring-rose-500">
                    <div>
                      <span className="font-bold block text-neutral-900">Fixed Amount</span>
                      <span className="text-xs font-medium text-neutral-500">e.g., ₹500 off</span>
                    </div>
                    <input type="radio" name="type" value="FLAT" checked={discountType === 'FLAT'} onChange={(e) => setDiscountType(e.target.value)} className="w-4 h-4 text-rose-600" />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-neutral-200 rounded-2xl cursor-pointer hover:bg-neutral-50 transition-colors bg-white shadow-sm has-[:checked]:border-rose-500 has-[:checked]:ring-1 has-[:checked]:ring-rose-500">
                    <div>
                      <span className="font-bold block text-neutral-900">Free Shipping</span>
                      <span className="text-xs font-medium text-neutral-500">Waive shipping fees</span>
                    </div>
                    <input type="radio" name="type" value="FREE_SHIPPING" checked={discountType === 'FREE_SHIPPING'} onChange={(e) => setDiscountType(e.target.value)} className="w-4 h-4 text-rose-600" />
                  </label>
                </div>
              </div>

              {/* Value & Code */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-neutral-900 mb-2">Campaign Code</label>
                  <input type="text" placeholder="e.g., WELCOME10" className="w-full border border-neutral-200 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 outline-none font-black text-lg tracking-wider uppercase transition-shadow" />
                  
                  <div className="mt-4 flex items-center gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <input 
                      type="checkbox" 
                      id="autoApply"
                      checked={autoApply}
                      onChange={(e) => setAutoApply(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-blue-300"
                    />
                    <label htmlFor="autoApply" className="text-sm font-bold text-blue-900 cursor-pointer">Auto-apply at checkout (No code needed)</label>
                  </div>
                </div>

                {discountType !== 'FREE_SHIPPING' && (
                  <div>
                    <label className="block text-sm font-black text-neutral-900 mb-2">Discount Value</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-neutral-500">
                        {discountType === 'PERCENTAGE' ? '%' : '₹'}
                      </div>
                      <input type="number" placeholder="0" className="w-full pl-10 pr-4 py-4 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-rose-500 outline-none font-black text-xl transition-shadow" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rules & Limits */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50 flex items-center gap-3">
            <Settings2 size={20} className="text-neutral-600" />
            <h2 className="font-black text-lg text-neutral-900">Usage Rules</h2>
          </div>
          
          <div className="p-6 space-y-6">
            
            {/* Min Order Value */}
            <div>
              <label className="block text-sm font-black text-neutral-900 mb-2">Minimum Order Value</label>
              <div className="relative max-w-sm">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-neutral-500">₹</div>
                <input type="number" placeholder="Leave empty for no minimum" className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-bold transition-shadow" />
              </div>
            </div>

            {/* Applicable Products */}
            <div className="pt-6 border-t border-neutral-100">
              <label className="block text-sm font-black text-neutral-900 mb-3">Applies To</label>
              <select className="w-full max-w-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none font-bold text-neutral-700 bg-white">
                <option>Entire Store</option>
                <option>Specific Categories</option>
                <option>Specific Products</option>
              </select>
            </div>
            
            {/* Usage Limits */}
            <div className="pt-6 border-t border-neutral-100">
              <div className="flex items-center gap-3 mb-4">
                <input 
                  type="checkbox" 
                  id="limitUsage"
                  checked={limitUsage}
                  onChange={(e) => setLimitUsage(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-neutral-300"
                />
                <label htmlFor="limitUsage" className="text-sm font-black text-neutral-900 cursor-pointer">Set Usage Limits</label>
              </div>

              {limitUsage && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">Total number of redemptions</label>
                    <input type="number" placeholder="e.g., 100" className="w-full border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none font-bold" />
                    <p className="text-xs font-medium text-neutral-500 mt-1">Total times this can be used across all customers.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-2">Limit per customer</label>
                    <input type="number" placeholder="e.g., 1" className="w-full border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none font-bold" />
                    <p className="text-xs font-medium text-neutral-500 mt-1">Max uses per logged-in account.</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Date Window */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50 flex items-center gap-3">
            <Calendar size={20} className="text-neutral-600" />
            <h2 className="font-black text-lg text-neutral-900">Campaign Schedule</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-black text-neutral-900 mb-2">Start Date</label>
                <input type="datetime-local" className="w-full border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none font-bold text-neutral-700 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-black text-neutral-900 mb-2">End Date (Optional)</label>
                <input type="datetime-local" className="w-full border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none font-bold text-neutral-700 bg-white" />
              </div>
            </div>
            
            <div className="mt-6 flex items-start gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <Info size={18} className="text-neutral-500 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-neutral-600">If you leave the end date empty, the campaign will run indefinitely until manually disabled or until usage limits are reached.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
