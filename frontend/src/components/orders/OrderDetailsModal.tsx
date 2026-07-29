"use client";

import { X, MapPin, Truck, CreditCard, ChevronRight, Download, CornerDownRight } from "lucide-react";
import Image from "next/image";

export default function OrderDetailsModal({ order, onClose, onCancel, onRequestReturn }: { order: any, onClose: () => void, onCancel: () => void, onRequestReturn: (id: string) => void }) {
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-800';
      case 'CANCELLED': 
      case 'RETURNED': return 'bg-rose-100 text-rose-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  const calculateSubtotal = () => order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const subtotal = calculateSubtotal();
  const couponDiscount = order.couponUsages?.reduce((acc: number, usage: any) => acc + usage.discountAmount, 0) || 0;
  
  // Fake tracking for now if none exists
  const timelineEvents = order.timeline || [
    { id: 1, status: 'PENDING', note: 'Order placed successfully', createdAt: order.createdAt }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-900/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-[#FDFDFD] h-full overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold">Order Details</h2>
            <p className="text-sm text-neutral-500">#{order.id.toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8 pb-32">
          
          {/* Header Status */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <p className="text-sm text-neutral-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-xl text-sm font-bold hover:bg-neutral-50 transition-colors"
              >
                <Download size={16} /> Invoice
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="font-bold text-lg mb-4">Tracking Progress</h3>
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm relative">
              <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-neutral-100 rounded-full" />
              <div className="space-y-6">
                {timelineEvents.map((event: any, index: number) => (
                  <div key={event.id || index} className="flex gap-4 relative z-10">
                    <div className={`w-4 h-4 rounded-full mt-1 border-2 border-white ring-4 ring-white ${index === 0 ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                    <div>
                      <p className={`font-bold text-sm ${index === 0 ? 'text-neutral-900' : 'text-neutral-500'}`}>{event.status}</p>
                      <p className="text-xs text-neutral-500">{new Date(event.createdAt).toLocaleString()} • {event.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="font-bold text-lg mb-4">Products</h3>
            <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
              {order.items.map((item: any, i: number) => (
                <div key={item.id} className={`p-4 flex gap-4 ${i !== 0 ? 'border-t border-neutral-100' : ''}`}>
                  <div className="w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden relative shrink-0">
                    {item.variant?.imageUrls?.[0] || item.variant?.product?.images?.[0]?.url ? (
                      <Image src={item.variant?.imageUrls?.[0] || item.variant?.product?.images?.[0]?.url} alt="product" fill className="object-cover" unoptimized />
                    ) : <div className="w-full h-full bg-neutral-200" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-sm text-neutral-900 line-clamp-2">{item.variant?.product?.name || 'Unknown Product'}</h4>
                      <p className="font-bold whitespace-nowrap">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Qty: {item.quantity} • ₹{item.price} each</p>
                    {item.customization && (
                      <p className="text-xs bg-rose-50 text-rose-700 px-2 py-1 rounded inline-block mt-2">
                        Custom: {item.customization}
                      </p>
                    )}
                    
                    <div className="mt-3">
                      {order.status === 'DELIVERED' && (
                        <button onClick={() => onRequestReturn(item.id)} className="text-xs text-rose-600 font-bold flex items-center gap-1 hover:underline">
                          <CornerDownRight size={14} /> Request Return
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Address Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Price Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm">
              <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2"><CreditCard size={18} /> Payment Details</h3>
              <div className="space-y-3 text-sm text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.totalAmount > subtotal - couponDiscount ? `₹${(order.totalAmount - (subtotal - couponDiscount)).toFixed(2)}` : 'FREE'}</span>
                </div>
                <div className="pt-3 border-t border-neutral-100 flex justify-between font-black text-neutral-900 text-lg">
                  <span>Total</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
                
                {order.payment && (
                  <div className="mt-4 pt-4 border-t border-neutral-100 bg-neutral-50 -mx-5 -mb-5 p-5 rounded-b-2xl text-xs">
                    <p className="font-bold text-neutral-900 mb-1">Transaction Info</p>
                    <p>Gateway: <span className="uppercase">{order.payment.gateway}</span></p>
                    <p>Status: <span className="font-bold text-emerald-600">{order.payment.status}</span></p>
                    <p className="text-neutral-400 break-all">{order.payment.transactionId}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm flex flex-col">
              <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2"><MapPin size={18} /> Delivery details</h3>
              <div className="flex-1 text-sm text-neutral-600 leading-relaxed space-y-1">
                {(() => {
                  const addressStr = order.internalNotes?.includes('Shipping Address:') 
                    ? order.internalNotes.split('Shipping Address:')[1].trim() 
                    : order.internalNotes;
                  
                  if (addressStr) {
                    const parts = addressStr.split(',').map((s: string) => s.trim());
                    const name = parts[0] || order.user?.fullName || 'Guest';
                    const street = parts[1] || '';
                    
                    const phonePart = parts.find((p: string) => p.startsWith('Phone:'));
                    let extractedPhone = order.user?.phone;
                    if (phonePart) {
                      extractedPhone = phonePart.replace('Phone:', '').trim();
                    }

                    const cityStateZip = parts.filter((p: string) => p !== parts[0] && p !== parts[1] && !p.startsWith('Phone:')).join(', ');
                    
                    return (
                      <>
                        <p className="font-bold text-neutral-900 mb-1 text-base">{name}</p>
                        <p>{street}</p>
                        <p>{cityStateZip}</p>
                        <p className="font-medium text-neutral-800 mt-2">
                          <span className="text-neutral-400">Country:</span> India
                        </p>
                        {extractedPhone && extractedPhone !== 'N/A' && (
                          <p className="font-medium text-neutral-800 mt-1 flex items-center gap-1.5">
                            <span className="text-neutral-400">Phone:</span> {extractedPhone}
                          </p>
                        )}
                      </>
                    );
                  } else {
                    return <p>Address information not recorded for this order.</p>;
                  }
                })()}
              </div>
              
              {order.shipment && (
                <div className="mt-4 pt-4 border-t border-neutral-100 bg-neutral-50 -mx-5 -mb-5 p-5 rounded-b-2xl text-xs">
                  <p className="font-bold text-neutral-900 mb-1 flex items-center gap-1"><Truck size={14} /> Shipping Info</p>
                  <p>Courier: {order.shipment.courierName}</p>
                  <p>Tracking: <span className="font-bold text-neutral-900">{order.shipment.awbNumber}</span></p>
                  {order.shipment.trackingUrl && (
                    <a href={order.shipment.trackingUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline mt-1 inline-block">Track Package ↗</a>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Action Bar (Sticky Bottom) */}
        {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
          <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-4 flex justify-end z-20">
            <button 
              onClick={onCancel}
              className="px-6 py-2.5 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-colors"
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
