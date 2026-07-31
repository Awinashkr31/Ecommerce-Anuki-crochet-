"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Tag, Settings2, Calendar, Info, Loader2, Package, Layers } from 'lucide-react';
import { apiPost } from '@/lib/api';
import toast from 'react-hot-toast';

export default function NewCouponPage() {
  const router = useRouter();
  
  // Basic Info
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // Discount Config
  const [discountType, setDiscountType] = useState('PERCENTAGE'); // PERCENTAGE, FLAT, FREE_SHIPPING, BOGO
  const [value, setValue] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [autoApply, setAutoApply] = useState(false);
  
  // BOGO Config
  const [buyQuantity, setBuyQuantity] = useState('');
  const [getQuantity, setGetQuantity] = useState('');
  
  // Order Requirements
  const [minOrderValue, setMinOrderValue] = useState('');
  const [minQuantity, setMinQuantity] = useState('');
  
  // Limits
  const [limitUsage, setLimitUsage] = useState(false);
  const [usageLimit, setUsageLimit] = useState('');
  const [maxUsesPerUser, setMaxUsesPerUser] = useState('');
  const [firstOrderOnly, setFirstOrderOnly] = useState(false);
  
  // Schedule
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!code) {
      toast.error('Campaign code is required');
      return;
    }
    if (discountType !== 'FREE_SHIPPING' && discountType !== 'BOGO' && (!value || Number(value) <= 0)) {
      toast.error('Please enter a valid discount value');
      return;
    }
    if (discountType === 'BOGO' && (!buyQuantity || !getQuantity)) {
      toast.error('Please enter Buy and Get quantities');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        code: code.toUpperCase(),
        name: name || undefined,
        description: description || undefined,
        type: discountType,
        value: (discountType === 'FREE_SHIPPING' || discountType === 'BOGO') ? 0 : Number(value),
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        
        minOrderValue: minOrderValue ? Number(minOrderValue) : 0,
        minQuantity: minQuantity ? Number(minQuantity) : null,
        
        buyQuantity: discountType === 'BOGO' ? Number(buyQuantity) : null,
        getQuantity: discountType === 'BOGO' ? Number(getQuantity) : null,
        
        usageLimit: limitUsage && usageLimit ? Number(usageLimit) : null,
        maxUsesPerUser: maxUsesPerUser ? Number(maxUsesPerUser) : null,
        firstOrderOnly,
        autoApply,
        
        validFrom: validFrom ? new Date(validFrom).toISOString() : new Date().toISOString(),
        validTo: validTo ? new Date(validTo).toISOString() : null,
        status: 'ACTIVE',
      };
      
      await apiPost('/coupons', payload);
      toast.success('Coupon created successfully');
      router.push('/admin/coupons');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create coupon');
    } finally {
      setIsSaving(false);
    }
  };

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
            <p className="text-sm font-medium text-neutral-500">Configure advanced enterprise discounts.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex-1 md:flex-none px-6 py-2.5 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors shadow-md shadow-neutral-200 flex items-center justify-center gap-2 disabled:bg-neutral-400"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
            {isSaving ? 'Saving...' : 'Save Campaign'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        
        {/* General Info */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50 flex items-center gap-3">
            <Tag size={20} className="text-rose-600" />
            <h2 className="font-black text-lg text-neutral-900">Campaign Details</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black text-neutral-900 mb-2">Campaign Code *</label>
                <input 
                  type="text" 
                  placeholder="e.g., WELCOME10" 
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full border border-neutral-200 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 outline-none font-black text-lg tracking-wider uppercase transition-shadow" 
                />
              </div>
              <div>
                <label className="block text-sm font-black text-neutral-900 mb-2">Internal Name (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g., Summer Sale 2024" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-neutral-200 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 outline-none font-medium text-lg transition-shadow" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-black text-neutral-900 mb-2">Public Description (Optional)</label>
              <textarea 
                placeholder="Shown to customers when they view the coupon" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-neutral-200 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 outline-none font-medium transition-shadow min-h-[100px]" 
              />
            </div>

            <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
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
        </div>

        {/* Discount Config */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50 flex items-center gap-3">
            <Layers size={20} className="text-indigo-600" />
            <h2 className="font-black text-lg text-neutral-900">Discount Logic</h2>
          </div>
          
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { id: 'PERCENTAGE', label: 'Percentage', sub: 'e.g., 10% off' },
                { id: 'FLAT', label: 'Fixed Amount', sub: 'e.g., ₹500 off' },
                { id: 'FREE_SHIPPING', label: 'Free Shipping', sub: 'Waive fees' },
                { id: 'BOGO', label: 'Buy X Get Y', sub: 'e.g. Buy 2 Get 1' }
              ].map(t => (
                <label key={t.id} className="flex flex-col p-4 border border-neutral-200 rounded-2xl cursor-pointer hover:bg-neutral-50 transition-colors bg-white shadow-sm has-[:checked]:border-indigo-500 has-[:checked]:ring-1 has-[:checked]:ring-indigo-500 relative overflow-hidden">
                  <input type="radio" name="type" value={t.id} checked={discountType === t.id} onChange={(e) => setDiscountType(e.target.value)} className="absolute right-4 top-4 w-4 h-4 text-indigo-600" />
                  <span className="font-bold block text-neutral-900 mb-1">{t.label}</span>
                  <span className="text-xs font-medium text-neutral-500">{t.sub}</span>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-neutral-100">
              {discountType === 'BOGO' ? (
                <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                  <div>
                    <label className="block text-sm font-black text-neutral-900 mb-2">Customer Buys (Quantity)</label>
                    <input type="number" value={buyQuantity} onChange={(e) => setBuyQuantity(e.target.value)} placeholder="e.g., 2" className="w-full border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-bold" />
                  </div>
                  <div>
                    <label className="block text-sm font-black text-neutral-900 mb-2">Customer Gets (Quantity)</label>
                    <input type="number" value={getQuantity} onChange={(e) => setGetQuantity(e.target.value)} placeholder="e.g., 1" className="w-full border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-bold" />
                    <p className="text-xs font-medium text-indigo-600 mt-2">The cheapest items in the cart will be discounted to free.</p>
                  </div>
                </div>
              ) : discountType !== 'FREE_SHIPPING' ? (
                <>
                  <div>
                    <label className="block text-sm font-black text-neutral-900 mb-2">Discount Value</label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-neutral-500">
                        {discountType === 'PERCENTAGE' ? '%' : '₹'}
                      </div>
                      <input 
                        type="number" 
                        placeholder="0" 
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-black text-xl transition-shadow" 
                      />
                    </div>
                  </div>
                  
                  {discountType === 'PERCENTAGE' && (
                    <div>
                      <label className="block text-sm font-black text-neutral-900 mb-2">Maximum Discount Amount (Optional)</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-neutral-500">₹</div>
                        <input 
                          type="number" 
                          placeholder="e.g., 500" 
                          value={maxDiscount}
                          onChange={(e) => setMaxDiscount(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold transition-shadow" 
                        />
                      </div>
                      <p className="text-xs font-medium text-neutral-500 mt-2">Cap the total discount to this amount.</p>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Order Requirements */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50 flex items-center gap-3">
            <Package size={20} className="text-amber-600" />
            <h2 className="font-black text-lg text-neutral-900">Cart Requirements</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black text-neutral-900 mb-2">Minimum Order Value</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-neutral-500">₹</div>
                  <input 
                    type="number" 
                    placeholder="Leave empty for no minimum" 
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold transition-shadow" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-neutral-900 mb-2">Minimum Item Quantity</label>
                <input 
                  type="number" 
                  placeholder="e.g., 3 items" 
                  value={minQuantity}
                  onChange={(e) => setMinQuantity(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold transition-shadow" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Usage Limits */}
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50 flex items-center gap-3">
            <Settings2 size={20} className="text-neutral-600" />
            <h2 className="font-black text-lg text-neutral-900">Usage Limits & Restrictions</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <input 
                type="checkbox" 
                id="limitUsage"
                checked={limitUsage}
                onChange={(e) => setLimitUsage(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-neutral-300"
              />
              <label htmlFor="limitUsage" className="text-sm font-black text-neutral-900 cursor-pointer">Set Total Redemptions Limit</label>
            </div>

            {limitUsage && (
              <div className="mb-6 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
                <label className="block text-sm font-bold text-neutral-700 mb-2">Total number of redemptions</label>
                <input 
                  type="number" 
                  placeholder="e.g., 100" 
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  className="w-full max-w-sm border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none font-bold" 
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-neutral-100">
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Max uses per customer</label>
                <input 
                  type="number" 
                  value={maxUsesPerUser}
                  onChange={(e) => setMaxUsesPerUser(e.target.value)}
                  placeholder="e.g., 1" 
                  className="w-full border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none font-bold" 
                />
                <p className="text-xs font-medium text-neutral-500 mt-1">Requires customer to log in.</p>
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors bg-white w-full h-full">
                  <input 
                    type="checkbox" 
                    checked={firstOrderOnly}
                    onChange={(e) => setFirstOrderOnly(e.target.checked)}
                    className="w-5 h-5 rounded text-rose-600 focus:ring-rose-500 border-neutral-300"
                  />
                  <div>
                    <span className="font-bold block text-neutral-900">First Order Only</span>
                    <span className="text-xs font-medium text-neutral-500">Only applies to new customers.</span>
                  </div>
                </label>
              </div>
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
                <input 
                  type="datetime-local" 
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className="w-full border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none font-bold text-neutral-700 bg-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-black text-neutral-900 mb-2">End Date (Optional)</label>
                <input 
                  type="datetime-local" 
                  value={validTo}
                  onChange={(e) => setValidTo(e.target.value)}
                  className="w-full border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none font-bold text-neutral-700 bg-white" 
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
