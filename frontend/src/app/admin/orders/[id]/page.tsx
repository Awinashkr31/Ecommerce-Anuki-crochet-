"use client";

import useSWR from 'swr';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Loader2, Printer, Download, MapPin, Mail, MessageCircle, Send, Plus, Search, ShieldAlert, Package, CreditCard, RefreshCw, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { apiGet, apiPut, apiPost, apiDelete } from '../../../../lib/api';
import { toast } from 'sonner';

interface OrderDetail {
  id: string;
  status: string;
  totalAmount: number;
  internalNotes: string | null;
  createdAt: string;
  user?: { name: string; email: string; phone: string } | null;
  items: { id: string; quantity: number; price: number; customization: string | null; variant: { sku: string; size: string | null; color: string | null; product: { name: string; images: {url: string}[] } } }[];
  payment?: { gateway: string; transactionId: string; status: string; amount: number; createdAt: string } | null;
  shipment?: { awbNumber: string; courierName: string; status: string } | null;
  timeline?: { id: string; status: string; note: string | null; createdAt: string; isInternal: boolean; type: string; user?: { name: string; role: string } | null }[];
  customerStats?: { totalLifetimeSpend: number; totalOrdersCount: number };
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const { data: order, isLoading: loading, mutate } = useSWR<OrderDetail>(`/orders/${orderId}`, apiGet);
  
  const [updating, setUpdating] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isInternal, setIsInternal] = useState(true);

  const deleteOrder = async () => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;
    try {
      setUpdating(true);
      await apiDelete(`/orders/${orderId}`);
      toast.success("Order deleted successfully");
      router.push('/admin/orders');
    } catch (err) {
      toast.error("Failed to delete order");
      setUpdating(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!order) return;
    try {
      setUpdating(true);
      await apiPut(`/orders/${orderId}/status`, { status: newStatus });
      toast.success("Order status updated");
      mutate();
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    try {
      setUpdating(true);
      await apiPost(`/orders/${orderId}/notes`, { note: newNote, isInternal });
      setNewNote('');
      toast.success("Note added");
      mutate();
    } catch (err) {
      toast.error("Failed to add note");
    } finally {
      setUpdating(false);
    }
  };

  const sendCommunication = async (channel: string) => {
    try {
      setUpdating(true);
      await apiPost(`/orders/${orderId}/communication`, { channel, message: 'Your order update is here!', title: 'Order Update' });
      toast.success("Notification sent");
      mutate();
    } catch (err) {
      toast.error("Failed to send notification");
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

  // Extract address data globally so it can be used for fallback in the Customer block
  const addressStr = order.internalNotes?.includes('Shipping Address:') 
    ? order.internalNotes.split('Shipping Address:')[1].trim() 
    : null;

  let extractedName = order.user?.name;
  let extractedPhone = order.user?.phone;
  let extractedStreet = '';
  let extractedCityStateZip = '';

  if (addressStr) {
    const parts = addressStr.split(',').map(s => s.trim());
    if (!extractedName) extractedName = parts[0] || 'Guest';
    extractedStreet = parts[1] || '';
    
    const phonePart = parts.find(p => p.startsWith('Phone:'));
    if (phonePart && !extractedPhone) {
      extractedPhone = phonePart.replace('Phone:', '').trim();
    }
    extractedCityStateZip = parts.filter(p => p !== parts[0] && p !== parts[1] && !p.startsWith('Phone:')).join(', ');
  }

  const customerName = extractedName || 'Guest User';
  const customerInitials = customerName !== 'Guest User' ? customerName.charAt(0).toUpperCase() : 'G';

  return (
    <div className="max-w-7xl mx-auto pb-24 space-y-6">
      {/* Sticky Header Action Bar */}
      <div className="sticky top-0 z-20 bg-neutral-50/80 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-4">
            <Link href="/admin/orders" className="p-2 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black tracking-tight">#{order.id.slice(0, 8).toUpperCase()}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                {order.payment?.status === 'PAID' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border bg-emerald-100 text-emerald-800 border-emerald-200">
                    PAID
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-neutral-500 flex items-center gap-2">
                <Clock size={14} /> {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors border border-neutral-200" title="Print Invoice"><Printer size={20}/></button>
            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors border border-neutral-200" title="Download PDF"><Download size={20}/></button>
            <button onClick={deleteOrder} disabled={updating} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200" title="Delete Order"><Trash2 size={20}/></button>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Ordered Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
              <h2 className="font-bold text-neutral-900 flex items-center gap-2"><Package size={18}/> Ordered Products ({order.items.length})</h2>
            </div>
            <div className="divide-y divide-neutral-100">
              {order.items.map(item => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row justify-between items-start gap-4 hover:bg-neutral-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-neutral-100 rounded-xl overflow-hidden shrink-0 border border-neutral-200">
                      {item.variant?.product?.images?.[0]?.url ? (
                        <img src={item.variant.product.images[0].url} alt={item.variant.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300"><Package size={24}/></div>
                      )}
                    </div>
                    <div>
                      <Link href={`/admin/products`} className="font-bold text-neutral-900 hover:text-blue-600 transition-colors">
                        {item.variant?.product?.name || 'Unknown Product'}
                      </Link>
                      <p className="text-sm text-neutral-500 mt-1">
                        {item.variant?.size && <span className="mr-3">Size: {item.variant.size}</span>}
                        {item.variant?.color && <span>Color: {item.variant.color}</span>}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1 font-mono">SKU: {item.variant?.sku || 'N/A'}</p>
                      {item.customization && (
                        <div className="mt-3 bg-amber-50 border border-amber-200 p-2 rounded-lg text-sm text-amber-800">
                          <span className="font-bold text-xs uppercase tracking-wider text-amber-700 block mb-1">Customization:</span>
                          {item.customization}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right w-full sm:w-auto flex sm:flex-col justify-between sm:justify-start mt-4 sm:mt-0 items-center sm:items-end">
                    <p className="text-sm font-medium text-neutral-500">₹{item.price.toLocaleString()} x {item.quantity}</p>
                    <p className="font-black text-lg mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Price Breakdown */}
            <div className="bg-neutral-50 p-6 border-t border-neutral-100">
              <div className="space-y-3 max-w-sm ml-auto">
                <div className="flex justify-between text-sm text-neutral-500 font-medium">
                  <span>Subtotal</span>
                  <span>₹{order.items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span>-₹0</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-500 font-medium">
                  <span>Shipping</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between text-sm text-neutral-500 font-medium">
                  <span>Tax (GST)</span>
                  <span>Included</span>
                </div>
                <div className="pt-3 border-t border-neutral-200 flex justify-between text-lg font-black text-neutral-900">
                  <span>Net Revenue</span>
                  <span>₹{order.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400 mt-1">
                  <span>Payment Gateway</span>
                  <span className="uppercase">{order.payment?.gateway || 'COD'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline and Notes */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <h2 className="font-bold text-neutral-900">Order Timeline & Notes</h2>
            </div>
            
            <div className="p-6 bg-neutral-50/50 border-b border-neutral-100">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Leave a note or log an action..." 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-900 outline-none text-sm font-medium"
                />
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-sm font-bold text-neutral-600 cursor-pointer">
                    <input type="checkbox" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} className="rounded text-neutral-900 focus:ring-neutral-900"/>
                    Internal Note
                  </label>
                  <button onClick={addNote} disabled={updating || !newNote.trim()} className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-neutral-800 whitespace-nowrap">
                    Add Note
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 max-h-[400px] overflow-y-auto">
              {order.timeline && order.timeline.length > 0 ? (
                <div className="relative pl-6 border-l-2 border-neutral-200 space-y-6">
                  {order.timeline.map((event: any, i: number) => (
                    <div key={event.id} className="relative">
                      <div className="absolute -left-[31px] top-1 bg-white p-1 rounded-full">
                        <div className={`w-3 h-3 rounded-full border-2 border-white box-content ${i === 0 ? 'bg-blue-500' : 'bg-neutral-300'}`}></div>
                      </div>
                      <div className={`p-4 rounded-xl border ${event.isInternal ? 'bg-amber-50/50 border-amber-100' : 'bg-white border-neutral-100'}`}>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-bold text-neutral-900">{event.type === 'NOTE' ? 'Note Added' : event.type === 'COMMUNICATION' ? 'Communication Sent' : event.status}</p>
                              {event.isInternal && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">Internal</span>}
                            </div>
                            {event.note && <p className="text-sm text-neutral-600 mt-1 whitespace-pre-wrap">{event.note}</p>}
                          </div>
                          <p className="text-xs font-medium text-neutral-400 whitespace-nowrap">{new Date(event.createdAt).toLocaleString([], {dateStyle:'short', timeStyle:'short'})}</p>
                        </div>
                        {event.user && <p className="text-xs text-neutral-400 mt-2 font-medium">Logged by {event.user.name}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-neutral-400 text-sm">No timeline events recorded.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Customer Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
              <h2 className="font-bold text-neutral-900">Customer</h2>
              <Link href="#" className="text-blue-600 hover:underline text-xs font-bold">View Profile</Link>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-lg">
                  {customerInitials}
                </div>
                <div>
                  <p className="font-black text-lg text-neutral-900">{customerName}</p>
                  <p className="text-sm text-neutral-500 font-medium">Customer</p>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                {order.user?.email && (
                  <a href={`mailto:${order.user.email}`} className="flex items-center gap-3 text-sm text-blue-600 hover:underline font-medium">
                    <Mail size={16}/> {order.user.email}
                  </a>
                )}
                {extractedPhone && extractedPhone !== 'N/A' && (
                  <a href={`tel:${extractedPhone}`} className="flex items-center gap-3 text-sm text-neutral-600 hover:text-neutral-900 transition-colors font-medium">
                    <MessageCircle size={16}/> {extractedPhone}
                  </a>
                )}
              </div>

              {order.customerStats && (
                <div className="mt-6 pt-4 border-t border-neutral-100 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">Total Orders</p>
                    <p className="font-black text-neutral-900">{order.customerStats.totalOrdersCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider mb-1">Lifetime Spend</p>
                    <p className="font-black text-neutral-900">₹{order.customerStats.totalLifetimeSpend.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
              <h2 className="font-bold text-neutral-900 flex items-center gap-2"><MapPin size={16}/> Shipping Address</h2>
            </div>
            <div className="p-6">
              {(() => {
                if (addressStr) {
                  return (
                    <>
                      <p className="font-bold text-neutral-900 mb-1 text-base">{extractedName}</p>
                      <div className="text-sm text-neutral-600 leading-relaxed space-y-0.5">
                        <p>{extractedStreet}</p>
                        <p>{extractedCityStateZip}</p>
                        <p className="font-medium text-neutral-800 mt-2">
                          <span className="text-neutral-400">Country:</span> India
                        </p>
                        {extractedPhone && extractedPhone !== 'N/A' && (
                          <p className="font-medium text-neutral-800 mt-1 flex items-center gap-1.5">
                            <span className="text-neutral-400"><MessageCircle size={14}/> Phone:</span> {extractedPhone}
                          </p>
                        )}
                      </div>
                      <a href={`https://maps.google.com/?q=${encodeURIComponent(addressStr)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-bold inline-flex items-center gap-1 mt-4">
                        View on Google Maps <ArrowLeft size={12} className="rotate-135"/>
                      </a>
                    </>
                  );
                } else {
                  return (
                    <div className="text-sm text-neutral-500 italic">
                      Address not captured properly. Check user profile.
                    </div>
                  );
                }
              })()}
            </div>
          </div>

          {/* Communication Center */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <h2 className="font-bold text-neutral-900 flex items-center gap-2"><Send size={16}/> Contact Customer</h2>
            </div>
            <div className="p-4 space-y-2">
              <button onClick={() => sendCommunication('email')} disabled={updating} className="w-full flex items-center justify-between p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors group">
                <span className="flex items-center gap-3 text-sm font-bold text-neutral-700"><Mail size={18} className="text-blue-500"/> Send Email</span>
                <ArrowLeft size={16} className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400"/>
              </button>
              <button onClick={() => sendCommunication('sms')} disabled={updating} className="w-full flex items-center justify-between p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors group">
                <span className="flex items-center gap-3 text-sm font-bold text-neutral-700"><MessageCircle size={18} className="text-emerald-500"/> Send SMS</span>
                <ArrowLeft size={16} className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400"/>
              </button>
            </div>
          </div>

          {/* Fraud Analysis Stub */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <h2 className="font-bold text-neutral-900 flex items-center gap-2"><ShieldAlert size={16}/> Fraud Analysis</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <p className="text-sm font-bold text-emerald-700">Low Risk</p>
              </div>
              <ul className="text-xs text-neutral-500 space-y-2 list-disc list-inside">
                <li>Billing address matches shipping address</li>
                <li>No previous chargebacks recorded</li>
                <li>IP address matches shipping country</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
