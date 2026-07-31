"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function OrderCard({ order, onViewDetails, onCancel }: { order: any, onViewDetails: () => void, onCancel: () => void }) {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-800';
      case 'CANCELLED': 
      case 'RETURNED': return 'bg-rose-100 text-rose-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  const getPaymentStatusText = () => {
    if (order.paymentMethod === 'COD' || order.paymentMethod === 'cod') return 'COD';
    if (!order.payment) return 'Payment Pending';
    const pStatus = order.payment.status;
    if (pStatus === 'AWAITING_PAYMENT' || pStatus === 'PENDING' || pStatus === 'FAILED') return 'Payment Pending';
    if (pStatus === 'SUCCESS' || pStatus === 'PAID') return 'Paid';
    return pStatus;
  };


  const images = order.items.map((item: any) => item.variant?.imageUrls?.[0] || item.variant?.product?.images?.[0]?.url || '').filter(Boolean);

  return (
    <div className="bg-white border border-neutral-200 rounded-3xl p-5 hover:border-neutral-300 transition-colors shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-black text-lg">Order #{order.id.slice(0, 8).toUpperCase()}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
              {order.status === 'AWAITING_PAYMENT' || order.status === 'PENDING' ? (order.paymentMethod === 'cod' || order.paymentMethod === 'COD' ? 'COD' : 'PAYMENT PENDING') : order.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} Item(s) • <span className="font-bold text-neutral-900">₹{order.totalAmount.toFixed(2)}</span> • <span className="font-semibold text-neutral-700">{getPaymentStatusText()}</span>
          </p>
        </div>
        
        <div className="flex gap-2">
          {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
            <button 
              onClick={(e) => { e.stopPropagation(); onCancel(); }}
              className="px-4 py-2 border border-rose-200 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button 
            onClick={onViewDetails}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl text-sm font-bold hover:bg-neutral-800 transition-colors"
          >
            View Details <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 items-center">
        {images.slice(0, 4).map((img: string, i: number) => (
          <div key={i} className="w-16 h-16 rounded-xl bg-neutral-100 overflow-hidden relative border border-neutral-200 shadow-sm shrink-0">
            <Image src={img} alt="Product" fill className="object-cover" unoptimized />
          </div>
        ))}
        {images.length > 4 && (
          <div className="w-16 h-16 rounded-xl bg-neutral-100 flex items-center justify-center border border-neutral-200 shrink-0">
            <span className="text-sm font-bold text-neutral-500">+{images.length - 4}</span>
          </div>
        )}
        
        {order.status === 'SHIPPED' && order.shipment?.awbNumber && (
          <div className="ml-auto text-right hidden sm:block">
            <p className="text-xs text-neutral-500 font-bold uppercase">Tracking No.</p>
            <p className="text-sm font-mono text-neutral-900">{order.shipment.awbNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
}
