"use client";
import useSWR from 'swr';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Tag, Loader2, Trash2, Edit3, TrendingUp, IndianRupee, Users, Percent } from 'lucide-react';
import { apiGet, apiDelete } from '../../../lib/api';

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrderValue: number;
  usageLimit: number | null;
  usedCount: number;
  validFrom: string;
  validTo: string | null;
  isActive: boolean;
  status: string;
  maxDiscount?: number;
}

export default function AdminCouponsPage() {
  const fetcher = (url: string) => apiGet(url);
  
  const { data: coupons = [], isLoading: loadingCoupons, mutate: mutateCoupons } = useSWR('/coupons', fetcher, { revalidateOnFocus: true });
  const { data: analytics, isLoading: loadingAnalytics } = useSWR('/coupons/analytics', fetcher, { revalidateOnFocus: true });
  
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await apiDelete(`/coupons/${id}`);
      mutateCoupons();
    } catch (err) {
      console.error('Failed to delete coupon:', err);
    }
  };

  const getStatus = (c: Coupon) => {
    if (c.status !== 'ACTIVE' && !c.isActive) return 'INACTIVE';
    if (c.validTo && new Date(c.validTo) < new Date()) return 'EXPIRED';
    if (new Date(c.validFrom) > new Date()) return 'SCHEDULED';
    return c.status || 'ACTIVE';
  };

  const filtered = Array.isArray(coupons) ? coupons.filter((c: any) => {
    const matchesSearch = c.code.toLowerCase().includes(search.toLowerCase());
    const status = getStatus(c);
    const matchesFilter = filter === 'ALL' || status === filter;
    return matchesSearch && matchesFilter;
  }) : [];

  return (
    <div className="pb-24">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Coupons & Discounts</h1>
          <p className="text-neutral-500 mt-1">Manage promotional campaigns and track ROI.</p>
        </div>
        <Link href="/admin/coupons/new" className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-neutral-800 transition-colors shadow-sm whitespace-nowrap">
          + Create Campaign
        </Link>
      </header>

      {/* Analytics KPI Cards */}
      {loadingAnalytics ? (
        <div className="flex items-center justify-center h-32 mb-8"><Loader2 className="animate-spin text-neutral-400" /></div>
      ) : analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-neutral-500 font-medium text-sm">
              <IndianRupee size={16} /> Revenue Generated
            </div>
            <div className="text-2xl font-black text-neutral-900">₹{(analytics.revenueGenerated || 0).toLocaleString()}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-neutral-500 font-medium text-sm">
              <TrendingUp size={16} /> Total Discount Given
            </div>
            <div className="text-2xl font-black text-rose-600">₹{(analytics.totalDiscountGiven || 0).toLocaleString()}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-neutral-500 font-medium text-sm">
              <Users size={16} /> Usages This Month
            </div>
            <div className="text-2xl font-black text-neutral-900">{analytics.usageThisMonth || 0}</div>
            <div className="text-xs text-neutral-400 font-medium">{analytics.usageToday || 0} today</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2 text-neutral-500 font-medium text-sm">
              <Percent size={16} /> Conversion Rate
            </div>
            <div className="text-2xl font-black text-neutral-900">{analytics.conversionRate || 0}%</div>
            <div className="text-xs text-neutral-400 font-medium">Avg Order: ₹{(analytics.avgOrderValue || 0).toFixed(0)}</div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-t-3xl border-x border-t border-neutral-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search by coupon code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-shadow text-sm font-medium"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {['ALL', 'ACTIVE', 'SCHEDULED', 'EXPIRED', 'INACTIVE'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filter === f ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
            >
              {f === 'ALL' ? 'All Coupons' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-3xl shadow-sm border border-neutral-200 overflow-x-auto">
        {loadingCoupons ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
            <span className="ml-3 text-neutral-500 font-medium">Loading coupons...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <p className="text-lg font-bold">No coupons found</p>
            <p className="text-sm mt-1"><Link href="/admin/coupons/new" className="text-rose-600 hover:underline">Create a new coupon</Link></p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Campaign</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Discount</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-center">Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-right">Performance</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((coupon: any) => {
                const status = getStatus(coupon);
                return (
                  <tr key={coupon.id} className="hover:bg-neutral-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-neutral-100 rounded-xl border border-neutral-200 text-neutral-700"><Tag size={18} /></div>
                        <div>
                          <div className="font-black text-neutral-900 tracking-wider flex items-center gap-2">
                            {coupon.code}
                            {coupon.autoApply && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Auto</span>}
                          </div>
                          <div className="text-xs font-bold text-neutral-500 mt-1 truncate max-w-[200px]">
                            {coupon.name || coupon.description || 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-neutral-900 text-sm">
                        {coupon.type === 'PERCENTAGE' && `${coupon.value}% OFF`}
                        {coupon.type === 'FLAT' && `₹${coupon.value} OFF`}
                        {coupon.type === 'FREE_SHIPPING' && `Free Shipping`}
                        {coupon.type === 'BOGO' && `Buy ${coupon.buyQuantity} Get ${coupon.getQuantity}`}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        {coupon.maxDiscount ? `Up to ₹${coupon.maxDiscount}` : (coupon.minOrderValue > 0 ? `Min ₹${coupon.minOrderValue}` : 'No minimum')}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {status === 'ACTIVE' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Active</span>}
                      {status === 'SCHEDULED' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Scheduled</span>}
                      {status === 'EXPIRED' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-600 font-bold text-xs border border-neutral-200">Expired</span>}
                      {status === 'INACTIVE' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-bold text-xs border border-rose-200">Paused</span>}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="font-black text-lg text-neutral-900">{coupon._count?.usages || coupon.usedCount} <span className="text-sm text-neutral-500 font-medium">uses</span></div>
                      {coupon.usageLimit && <span className="text-neutral-400 text-xs">Limit: {coupon.usageLimit}</span>}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/coupons/edit/${coupon.id}`} className="text-neutral-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100 p-2 bg-neutral-50 rounded-lg border border-transparent hover:border-blue-200 hover:bg-blue-50">
                          <Edit3 size={16} />
                        </Link>
                        <button onClick={() => handleDelete(coupon.id)} className="text-neutral-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 p-2 bg-neutral-50 rounded-lg border border-transparent hover:border-rose-200 hover:bg-rose-50">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
