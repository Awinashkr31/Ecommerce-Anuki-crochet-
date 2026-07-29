"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Download, MoreHorizontal, Loader2 } from 'lucide-react';
import { apiGet } from '../../../lib/api';

interface Order {
  id: string;
  userId: string | null;
  status: string;
  totalAmount: number;
  createdAt: string;
  user?: { name: string; email: string } | null;
  items?: { id: string; quantity: number; price: number; variant?: { sku: string } }[];
  payment?: { status: string; gateway: string } | null;
}

import useSWR from 'swr';
const fetcher = (url: string) => apiGet<Order[]>(url);

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading: loading } = useSWR('/orders', fetcher, { revalidateOnFocus: true });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedOrders(filtered.map(o => o.id));
    else setSelectedOrders([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedOrders(prev =>
      prev.includes(id) ? prev.filter(oId => oId !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CANCELLED': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const filtered = orders.filter(o => {
    const matchesSearch = !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Orders</h1>
          <p className="text-neutral-500 mt-1">Process shipments, generate labels, and view history. <span className="font-bold text-neutral-700">{orders.length} total</span></p>
        </div>
        <Link href="/admin/orders/new" className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-neutral-800 transition-colors shadow-sm whitespace-nowrap">
          + Create Manual Order
        </Link>
      </header>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-t-2xl border-x border-t border-neutral-200 flex flex-col lg:flex-row gap-4 justify-between items-center">
        <div className="flex-1 flex flex-wrap lg:flex-nowrap gap-4 w-full">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-shadow text-sm font-medium"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-600 outline-none bg-white min-w-[120px]"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-neutral-200 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
            <span className="ml-3 text-neutral-500 font-medium">Loading orders...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <p className="text-lg font-bold">No orders found</p>
            <p className="text-sm mt-1">Orders will appear here once customers start placing them.</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    className="rounded border-neutral-300 text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                    checked={selectedOrders.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Order ID</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Date</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Customer</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Payment</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Total</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-neutral-300 text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleSelect(order.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="font-black text-neutral-900 hover:text-rose-600 transition-colors">
                      {order.id.slice(0, 8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-neutral-500">
                    {new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                  <td className="px-6 py-4 font-bold text-sm text-neutral-700">
                    {order.user?.name || 'Guest'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                      order.payment?.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {order.payment?.status || 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-sm">
                    ₹{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 transition-opacity">
                      <Link href={`/admin/orders/${order.id}`} className="text-neutral-400 hover:text-rose-600 transition-colors" title="View Details"><MoreHorizontal size={18} /></Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm font-bold text-neutral-500">
        <p>Showing {filtered.length} of {orders.length} orders</p>
      </div>
    </>
  );
}
