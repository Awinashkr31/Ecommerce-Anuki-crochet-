"use client";
import useSWR from 'swr';

import { useState } from 'react';
import { Search, Loader2, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { apiGet, apiPut } from '../../../lib/api';
import { toast } from 'sonner';

interface InventoryItem {
  id: string;
  sku: string;
  color: string | null;
  size: string | null;
  price: number;
  stock: number;
  lowStockThreshold?: number;
  product: { id: string; name: string; isMadeToOrder: boolean };
}

export default function AdminInventoryPage() {
  const fetcher = (url: string) => apiGet<InventoryItem[]>(url);
  const { data: items = [], isLoading: loading, mutate } = useSWR('/inventory', fetcher, { revalidateOnFocus: true });
  const [search, setSearch] = useState('');
  const [adjustingId, setAdjustingId] = useState<string | null>(null);

  const adjustStock = async (itemId: string, change: number) => {
    try {
      setAdjustingId(itemId);
      await apiPut(`/inventory/${itemId}`, { change, reason: 'MANUAL' });
      toast.success('Stock updated');
      mutate();
    } catch (err) {
      console.error('Failed to adjust stock:', err);
      toast.error('Failed to adjust stock');
    } finally {
      setAdjustingId(null);
    }
  };

  const filtered = items.filter(i =>
    i.sku.toLowerCase().includes(search.toLowerCase()) ||
    i.product.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = items.filter(i => !i.product.isMadeToOrder && i.stock <= (i.lowStockThreshold || 5)).length;

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Inventory</h1>
        <p className="text-neutral-500 mt-1">
          Track and adjust real product & variant stock levels.{' '}
          <span className="font-bold text-neutral-800">{items.length} items</span>
          {lowStockCount > 0 && (
            <span className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle size={12} /> {lowStockCount} Low Stock
            </span>
          )}
        </p>
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
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-shadow text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-b-2xl shadow-sm border border-neutral-200 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
            <span className="ml-3 text-neutral-500 font-medium">Loading real inventory...</span>
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
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Variant / Option</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-center">Stock & Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-center">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map(item => {
                const threshold = item.lowStockThreshold || 5;
                const isOutOfStock = item.stock === 0;
                const isLowStock = !item.product.isMadeToOrder && item.stock <= threshold;

                return (
                  <tr key={item.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-sm text-neutral-900">{item.product.name}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-neutral-500">{item.sku}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{item.size || item.color || 'Standard'}</td>
                    <td className="px-6 py-4 text-center">
                      {item.product.isMadeToOrder ? (
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
                          Made to Order
                        </span>
                      ) : isOutOfStock ? (
                        <span className="px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold border border-rose-200">
                          Out of Stock (0)
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
                          Low Stock ({item.stock})
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                          {item.stock} in stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {!item.product.isMadeToOrder && (
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => adjustStock(item.id, -1)} 
                            disabled={item.stock <= 0 || adjustingId === item.id} 
                            className="w-8 h-8 bg-neutral-100 rounded-lg text-neutral-700 font-bold hover:bg-neutral-200 disabled:opacity-30 transition-colors flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="w-10 text-center font-black text-sm">{item.stock}</span>
                          <button 
                            onClick={() => adjustStock(item.id, 1)} 
                            disabled={adjustingId === item.id}
                            className="w-8 h-8 bg-neutral-100 rounded-lg text-neutral-700 font-bold hover:bg-neutral-200 disabled:opacity-30 transition-colors flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      )}
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
