"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { apiGet, apiPut } from '../../../../lib/api';

interface OrderDetail {
  id: string;
  status: string;
  totalAmount: number;
  internalNotes: string | null;
  createdAt: string;
  user?: { name: string; email: string } | null;
  items: { id: string; quantity: number; price: number; customization: string | null; variant: { sku: string; size: string | null; color: string | null; product: { name: string } } }[];
  payment?: { gateway: string; transactionId: string; status: string; amount: number } | null;
  shipment?: { awbNumber: string; courierName: string; status: string } | null;
  timeline?: { id: string; status: string; note: string | null; createdAt: string; user?: { name: string } | null }[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await apiGet<OrderDetail>(`/orders/${orderId}`);
      setOrder(data);
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!order) return;
    try {
      setUpdating(true);
      await apiPut(`/orders/${orderId}/status`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
    } catch (err) {
      console.error('Failed to update order:', err);
    } finally {
      setUpdating(false);
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-neutral-400" size={32} />
        <span className="ml-3 text-neutral-500 font-medium">Loading order...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-32">
        <p className="text-lg font-bold text-neutral-400">Order not found</p>
        <Link href="/admin/orders" className="text-rose-600 hover:underline text-sm mt-2 inline-block">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-24">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black tracking-tight">{order.id.slice(0, 8).toUpperCase()}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm font-medium text-neutral-500 flex items-center gap-2">
              <Clock size={14} /> {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value=""
            onChange={(e) => { if (e.target.value) updateStatus(e.target.value); }}
            disabled={updating}
            className="flex-1 md:flex-none px-4 py-2 bg-neutral-900 text-white border border-neutral-900 rounded-xl font-bold outline-none cursor-pointer disabled:opacity-50"
          >
            <option value="">Update Status</option>
            <option value="PROCESSING">Mark as Processing</option>
            <option value="SHIPPED">Mark as Shipped</option>
            <option value="DELIVERED">Mark as Delivered</option>
            <option value="CANCELLED">Cancel Order</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Items & Totals */}
        <div className="lg:col-span-2 space-y-8">

          {/* Line Items */}
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <h2 className="font-bold text-neutral-900">Order Items ({order.items.length})</h2>
            </div>
            <div className="divide-y divide-neutral-100">
              {order.items.map(item => (
                <div key={item.id} className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-bold text-neutral-900">{item.variant?.product?.name || 'Product'}</p>
                      <p className="text-sm text-neutral-500 mt-1">
                        {item.variant?.size && `Size: ${item.variant.size}`}
                        {item.variant?.color && ` / Color: ${item.variant.color}`}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">SKU: {item.variant?.sku}</p>
                      {item.customization && (
                        <div className="mt-3 bg-amber-50 border border-amber-200 p-3 rounded-xl text-sm text-amber-800">
                          <span className="font-black text-xs uppercase tracking-wider text-amber-700 block mb-1">Customization:</span>
                          {item.customization}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-black">₹{item.price.toLocaleString()}</p>
                      <p className="text-sm font-bold text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="bg-neutral-50 p-6 border-t border-neutral-100">
              <div className="space-y-3 max-w-sm ml-auto">
                <div className="pt-3 border-t border-neutral-200 flex justify-between text-lg font-black text-neutral-900">
                  <span>Total</span>
                  <span>₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <h2 className="font-bold text-neutral-900">Internal Notes</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-neutral-600">{order.internalNotes || 'No notes for this order.'}</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">

          {/* Customer Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <h2 className="font-bold text-neutral-900">Customer</h2>
            </div>
            <div className="p-6">
              <p className="font-black text-lg">{order.user?.name || 'Guest'}</p>
              {order.user?.email && <p className="text-sm text-neutral-500 mt-1">{order.user.email}</p>}
            </div>
          </div>

          {/* Payment */}
          {order.payment && (
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
                <h2 className="font-bold text-neutral-900">Payment</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-neutral-700">{order.payment.gateway}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${order.payment.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-600'}`}>
                    {order.payment.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-mono">{order.payment.transactionId}</p>
              </div>
            </div>
          )}

          {/* Shipment */}
          {order.shipment && (
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
                <h2 className="font-bold text-neutral-900">Shipment</h2>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-sm font-bold">{order.shipment.courierName}</p>
                <p className="text-xs text-neutral-500">AWB: {order.shipment.awbNumber}</p>
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-bold">{order.shipment.status}</span>
              </div>
            </div>
          )}

          {/* Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
                <h2 className="font-bold text-neutral-900">Timeline</h2>
              </div>
              <div className="p-6">
                <div className="relative pl-6 border-l-2 border-neutral-200 space-y-6">
                  {order.timeline.map((event, i) => (
                    <div key={event.id} className="relative">
                      <div className="absolute -left-[31px] top-1 bg-white p-1 rounded-full">
                        <div className={`w-3 h-3 rounded-full border-2 border-white box-content ${i === 0 ? 'bg-blue-500' : 'bg-neutral-300'}`}></div>
                      </div>
                      <p className="text-sm font-bold text-neutral-900">{event.status}</p>
                      <p className="text-xs font-medium text-neutral-500 mt-1">{new Date(event.createdAt).toLocaleString()}</p>
                      {event.note && <p className="text-xs text-neutral-400 mt-1">{event.note}</p>}
                      {event.user && <p className="text-xs text-neutral-400 mt-1">by {event.user.name}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
