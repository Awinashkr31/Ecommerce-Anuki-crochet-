"use client";

import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { apiGet, apiPut } from '../../../lib/api';

interface InventoryItem {
  id: string;
  sku: string;
  color: string | null;
  size: string | null;
  price: number;
  stock: number;
  product: { id: string; name: string; isMadeToOrder: boolean };
}

export default function AdminInventoryPage() {
  import useSWR from 'swr';
  const fetcher = (url: string) => apiGet<InventoryItem[]>(url);
  const { data: items = [], isLoading: loading, mutate } = useSWR('/inventory', fetcher, { revalidateOnFocus: true });
  const [search, setSearch] = useState('');

  const adjustStock = async (variantId: string, change: number) => {
    try {
      await apiPut(`/inventory/${variantId}`, { change, reason: 'MANUAL' });
      mutate();
    } catch (err) {
      console.error('Failed to adjust stock:', err);
    }
  };

  const filtered = items.filter(i =>
    i.sku.toLowerCase().includes(search.toLowerCase()) ||
    i.product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Inventory</h1>
        <p className="text-neutral-500 mt-1">Track and adjust stock levels. <span className="font-bold text-neutral-700">{items.length} variants</span></p>
      </header>

      {/* Search */}
      <div className="bg-white p-4 rounded-t-2xl border-x border-t border-neutral-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-shadow"
          />
        </div>
      </div>

      <div className="bg-white rounded-b-2xl shadow-sm border border-neutral-200 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
            <span className="ml-3 text-neutral-500 font-medium">Loading inventory...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <p className="text-lg font-bold">No inventory items found</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Product</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">SKU</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Variant</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-center">Stock</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-center">Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-sm">{item.product.name}</td>
                  <td className="px-6 py-4 text-sm font-mono text-neutral-500">{item.sku}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{item.size || item.color || '—'}</td>
                  <td className="px-6 py-4 text-center">
                    {item.product.isMadeToOrder ? (
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold">Made to Order</span>
                    ) : (
                      <span className={`font-black text-lg ${item.stock < 5 ? 'text-amber-600' : item.stock === 0 ? 'text-rose-600' : 'text-neutral-900'}`}>{item.stock}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {!item.product.isMadeToOrder && (
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => adjustStock(item.id, -1)} disabled={item.stock <= 0} className="w-8 h-8 bg-neutral-100 rounded-lg text-neutral-700 font-bold hover:bg-neutral-200 disabled:opacity-30 transition-colors">−</button>
                        <span className="w-10 text-center font-bold">{item.stock}</span>
                        <button onClick={() => adjustStock(item.id, 1)} className="w-8 h-8 bg-neutral-100 rounded-lg text-neutral-700 font-bold hover:bg-neutral-200 transition-colors">+</button>
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
