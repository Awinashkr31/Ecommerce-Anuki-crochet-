"use client";

import { useState, useEffect } from 'react';
import { Loader2, Check, X } from 'lucide-react';
import { apiGet, apiPut } from '../../../lib/api';

interface ReturnRequest {
  id: string;
  reason: string;
  status: string;
  refundMethod: string;
  restocked: boolean;
  adminComments: string | null;
  createdAt: string;
  orderItem: {
    id: string;
    quantity: number;
    price: number;
    variant: { sku: string; product: { name: string } };
    order: { id: string };
  };
}

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const data = await apiGet<ReturnRequest[]>('/returns');
      setReturns(data);
    } catch (err) {
      console.error('Failed to fetch returns:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await apiPut(`/returns/${id}`, { status });
      setReturns(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (err) {
      console.error('Failed to update return:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800';
      case 'APPROVED': return 'bg-emerald-100 text-emerald-800';
      case 'REJECTED': return 'bg-rose-100 text-rose-800';
      case 'REFUNDED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Returns</h1>
        <p className="text-neutral-500 mt-1">Manage return requests and refunds. <span className="font-bold text-neutral-700">{returns.length} requests</span></p>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
            <span className="ml-3 text-neutral-500 font-medium">Loading returns...</span>
          </div>
        ) : returns.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <p className="text-lg font-bold">No return requests</p>
            <p className="text-sm mt-1">Return requests will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Product</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Reason</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Refund</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Date</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {returns.map(r => (
                <tr key={r.id} className="hover:bg-neutral-50/80 transition-colors group">
                  <td className="px-6 py-4 font-bold text-sm">{r.orderItem?.variant?.product?.name || r.orderItem?.variant?.sku || 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600 max-w-xs truncate">{r.reason}</td>
                  <td className="px-6 py-4 text-sm font-medium text-neutral-600">{r.refundMethod}</td>
                  <td className="px-6 py-4 text-sm text-neutral-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${getStatusColor(r.status)}`}>{r.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {r.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => updateStatus(r.id, 'APPROVED')} className="p-1.5 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200" title="Approve"><Check size={16} /></button>
                        <button onClick={() => updateStatus(r.id, 'REJECTED')} className="p-1.5 bg-rose-100 text-rose-700 rounded hover:bg-rose-200" title="Reject"><X size={16} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
