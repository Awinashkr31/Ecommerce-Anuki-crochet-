"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Tag, Loader2, Trash2 } from 'lucide-react';
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
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await apiGet<Coupon[]>('/coupons');
      setCoupons(data);
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await apiDelete(`/coupons/${id}`);
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete coupon:', err);
    }
  };

  const getStatus = (c: Coupon) => {
    if (!c.isActive) return 'INACTIVE';
    if (c.validTo && new Date(c.validTo) < new Date()) return 'EXPIRED';
    if (new Date(c.validFrom) > new Date()) return 'SCHEDULED';
    return 'ACTIVE';
  };

  const filtered = coupons.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Coupons & Discounts</h1>
          <p className="text-neutral-500 mt-1">Manage promotional campaigns. <span className="font-bold text-neutral-700">{coupons.length} coupons</span></p>
        </div>
        <Link href="/admin/coupons/new" className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-neutral-800 transition-colors shadow-sm whitespace-nowrap">
          + Create Campaign
        </Link>
      </header>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-t-3xl border-x border-t border-neutral-200 flex gap-4 items-center">
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-3xl shadow-sm border border-neutral-200 overflow-x-auto">
        {loading ? (
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
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Code</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Type</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-center">Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-right">Usage</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-right">Min Order</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map(coupon => {
                const status = getStatus(coupon);
                return (
                  <tr key={coupon.id} className="hover:bg-neutral-50/80 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-neutral-100 rounded-xl border border-neutral-200 text-neutral-700"><Tag size={18} /></div>
                        <div>
                          <div className="font-black text-neutral-900 font-mono tracking-wider">{coupon.code}</div>
                          <div className="text-xs font-bold text-neutral-500 mt-1">
                            {coupon.type === 'PERCENTAGE' && `${coupon.value}% OFF`}
                            {coupon.type === 'FLAT' && `₹${coupon.value} OFF`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-medium text-sm text-neutral-600">{coupon.type}</td>
                    <td className="px-6 py-5 text-center">
                      {status === 'ACTIVE' && <span className="text-emerald-600 font-black text-sm">Active</span>}
                      {status === 'SCHEDULED' && <span className="text-amber-600 font-black text-sm">Scheduled</span>}
                      {status === 'EXPIRED' && <span className="text-neutral-400 font-black text-sm">Expired</span>}
                      {status === 'INACTIVE' && <span className="text-rose-400 font-black text-sm">Inactive</span>}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="font-black text-lg text-neutral-900">{coupon.usedCount}</span>
                      {coupon.usageLimit && <span className="text-neutral-400 text-sm">/{coupon.usageLimit}</span>}
                    </td>
                    <td className="px-6 py-5 text-right font-medium text-sm">₹{coupon.minOrderValue.toLocaleString()}</td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={() => handleDelete(coupon.id)} className="text-neutral-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 p-1">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
