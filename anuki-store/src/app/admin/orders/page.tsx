"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Download, MoreHorizontal, Loader2, RefreshCw, Package, Clock, CheckCircle2, AlertCircle, IndianRupee, Filter, Trash2 } from 'lucide-react';
import { apiGet, apiDelete } from '../../../lib/api';
import useSWR from 'swr';
import { toast } from 'sonner';

interface Order {
  id: string;
  userId: string | null;
  status: string;
  totalAmount: number;
  createdAt: string;
  user?: { fullName: string; email: string } | null;
  items?: { id: string; quantity: number; price: number; variant?: { sku: string } }[];
  payment?: { status: string; gateway: string } | null;
}

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Fetch Analytics
  const { data: analytics, mutate: refreshAnalytics } = useSWR<any>('/orders/analytics', apiGet);

  // Fetch Orders
  const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
  if (search) queryParams.set('search', search);
  if (statusFilter) queryParams.set('status', statusFilter);
  if (paymentFilter) queryParams.set('paymentStatus', paymentFilter);

  const { data: ordersData, isLoading: loading, mutate: refreshOrders } = useSWR<{ orders: Order[], pagination: { total: number, totalPages: number } }>(`/orders?${queryParams.toString()}`, apiGet, { keepPreviousData: true });

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const orders: Order[] = ordersData?.orders || [];
  const pagination = ordersData?.pagination || { total: 0, totalPages: 1 };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedOrders(orders.map(o => o.id));
    else setSelectedOrders([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(oId => oId !== id) : [...prev, id]);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CANCELLED': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'RETURNED': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const refreshAll = () => {
    refreshAnalytics();
    refreshOrders();
    toast.success("Dashboard refreshed");
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;
    try {
      await apiDelete(`/orders/${id}`);
      toast.success("Order deleted successfully");
      refreshAll();
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Orders</h1>
          <p className="text-neutral-500">Manage all store orders, tracking, and fulfillment.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={refreshAll} className="p-2 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors">
            <RefreshCw size={20} className="text-neutral-600" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-bold hover:bg-neutral-50">
            <Download size={16} /> Export
          </button>
          <Link href="/admin/orders/new" className="bg-neutral-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-colors shadow-sm">
            + Create Order
          </Link>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
          <p className="text-sm font-medium text-neutral-500 flex items-center gap-2 mb-2"><Package size={16}/> Total Orders</p>
          <h3 className="text-2xl font-black text-neutral-900">{analytics?.totalOrders || 0}</h3>
          <p className="text-xs text-emerald-600 font-bold mt-1">+{analytics?.todayOrders || 0} today</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
          <p className="text-sm font-medium text-neutral-500 flex items-center gap-2 mb-2"><Clock size={16}/> Pending</p>
          <h3 className="text-2xl font-black text-amber-600">{analytics?.pendingOrders || 0}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
          <p className="text-sm font-medium text-neutral-500 flex items-center gap-2 mb-2"><CheckCircle2 size={16}/> Completed</p>
          <h3 className="text-2xl font-black text-emerald-600">{analytics?.deliveredOrders || 0}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
          <p className="text-sm font-medium text-neutral-500 flex items-center gap-2 mb-2"><IndianRupee size={16}/> Net Revenue</p>
          <h3 className="text-2xl font-black text-neutral-900">₹{analytics?.totalRevenue?.toLocaleString() || 0}</h3>
          <p className="text-xs text-neutral-500 mt-1">Avg: ₹{Math.round(analytics?.avgOrderValue || 0)}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm hidden lg:block">
          <p className="text-sm font-medium text-neutral-500 flex items-center gap-2 mb-2"><AlertCircle size={16}/> Action Needed</p>
          <h3 className="text-2xl font-black text-rose-600">{analytics?.failedOrders || 0}</h3>
          <p className="text-xs text-neutral-500 mt-1">Failed payments</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="flex-1 flex flex-wrap lg:flex-nowrap gap-4 w-full items-center">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              placeholder="Search order ID, customer name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-neutral-900 outline-none transition-all text-sm font-medium"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-neutral-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-700 outline-none hover:bg-white"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="RETURNED">Returned</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-700 outline-none hover:bg-white"
            >
              <option value="">All Payments</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>
        {selectedOrders.length > 0 && (
          <div className="flex items-center gap-3 border-l border-neutral-200 pl-4">
            <span className="text-sm font-bold text-neutral-600">{selectedOrders.length} selected</span>
            <button className="px-3 py-1.5 bg-neutral-900 text-white rounded-lg text-sm font-bold hover:bg-neutral-800">
              Bulk Actions
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24 text-neutral-400">
            <Package size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg font-bold text-neutral-900">No orders found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 w-4 h-4 cursor-pointer"
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Order</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Date</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Customer</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Payment</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Total</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 w-4 h-4 cursor-pointer"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleSelect(order.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="font-black text-neutral-900 hover:text-blue-600 transition-colors">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-neutral-500">
                    {new Date(order.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm text-neutral-900">{order.user?.fullName || 'Guest'}</p>
                    {order.user?.email && <p className="text-xs text-neutral-500">{order.user.email}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      order.payment?.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' : 
                      order.payment?.status === 'FAILED' ? 'bg-rose-50 text-rose-700' :
                      'bg-neutral-100 text-neutral-600'
                    }`}>
                      {order.payment?.status || 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-sm text-neutral-900">
                    ₹{order.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <Link href={`/admin/orders/${order.id}`} className="p-2 hover:bg-neutral-200 rounded-lg inline-flex text-neutral-400 hover:text-neutral-900 transition-colors" title="View Details">
                      <MoreHorizontal size={18} />
                    </Link>
                    <button onClick={() => handleDelete(order.id)} className="p-2 hover:bg-rose-100 rounded-lg inline-flex text-neutral-400 hover:text-rose-600 transition-colors" title="Delete Order">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
            <p className="text-sm text-neutral-500 font-medium">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} orders
            </p>
            <div className="flex items-center gap-2">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 border border-neutral-200 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-neutral-50"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: pagination.totalPages }).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-bold ${page === i + 1 ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100 text-neutral-600'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                disabled={page === pagination.totalPages} 
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 border border-neutral-200 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-neutral-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
