"use client";

import { useState } from "react";
import useSWR from "swr";
import { apiGet, apiPost } from "@/lib/api";
import { Package, Search, Filter } from "lucide-react";
import OrderCard from "./OrderCard";
import OrderDetailsModal from "./OrderDetailsModal";
import { toast } from "sonner";

const fetcher = (url: string) => apiGet(url);

export default function CustomerOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [timeRange, setTimeRange] = useState("ALL");
  
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Debounce search could be added here, using direct for now
  const query = new URLSearchParams();
  if (statusFilter !== "ALL") query.append("status", statusFilter);
  if (timeRange !== "ALL") query.append("timeRange", timeRange);
  if (search) query.append("search", search);

  const { data: orders, error, mutate } = useSWR(`/orders/my-orders?${query.toString()}`, fetcher);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await apiPost(`/orders/${orderId}/cancel`, {});
      toast.success("Order cancelled successfully");
      mutate(); // refresh orders
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel order");
    }
  };

  const handleReturnRequest = async (orderItemId: string) => {
    const reason = window.prompt("Reason for return?");
    if (reason) {
      try {
        await apiPost('/returns', { orderItemId, reason, refundMethod: 'WALLET' });
        toast.success("Return requested successfully!");
        mutate();
      } catch (e: any) {
        toast.error(e.message || "Failed to request return");
      }
    }
  };

  const selectedOrder = orders?.find((o: any) => o.id === selectedOrderId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold font-serif text-neutral-900">Order History</h2>
        
        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-neutral-200 rounded-xl text-sm bg-white focus:outline-none focus:border-rose-500"
            >
              <option value="ALL">All Orders</option>
              <option value="ACTIVE">Active</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="RETURNED">Returned</option>
            </select>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-neutral-200 rounded-xl text-sm bg-white focus:outline-none focus:border-rose-500"
            >
              <option value="ALL">All Time</option>
              <option value="30DAYS">Last 30 Days</option>
              <option value="6MONTHS">Last 6 Months</option>
              <option value="1YEAR">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Order List */}
      {!orders && !error ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-500">Loading your orders...</p>
        </div>
      ) : orders?.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-rose-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No orders found</h3>
          <p className="text-neutral-500 mb-6">
            {search || statusFilter !== "ALL" || timeRange !== "ALL" 
              ? "We couldn't find any orders matching your filters." 
              : "You haven't placed any orders yet. Discover our handmade collections!"}
          </p>
          <a href="/products" className="inline-block px-6 py-2.5 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders?.map((order: any) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onViewDetails={() => setSelectedOrderId(order.id)} 
              onCancel={() => handleCancelOrder(order.id)}
            />
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrderId(null)} 
          onCancel={() => {
            handleCancelOrder(selectedOrder.id);
            setSelectedOrderId(null);
          }}
          onRequestReturn={handleReturnRequest}
        />
      )}
    </div>
  );
}
