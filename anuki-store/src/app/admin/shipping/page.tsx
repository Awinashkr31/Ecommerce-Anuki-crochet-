"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Truck, Search, MapPin, Package, Settings2, ExternalLink, CalendarClock, IndianRupee, Loader2, CheckCircle2, Save } from 'lucide-react';
import { apiGet, apiPut } from '../../../lib/api';
import { toast } from 'sonner';

interface ShipmentItem {
  id: string;
  orderId: string;
  awb: string | null;
  courier: string | null;
  trackingUrl: string | null;
  status: string;
  expectedDelivery: string | null;
  customer: string;
  destination: string;
  createdAt: string;
}

export default function AdminShippingPage() {
  const [activeTab, setActiveTab] = useState<'SHIPMENTS' | 'RATES' | 'PICKUPS'>('SHIPMENTS');
  const [search, setSearch] = useState('');
  const [courierFilter, setCourierFilter] = useState('All Couriers');

  // Real shipments from database
  const { data: shipments = [], isLoading: loadingShipments } = useSWR<ShipmentItem[]>('/shipping', apiGet);

  // Settings source of truth for shipping rates
  const { data: rawSettings, mutate: mutateSettings } = useSWR<Record<string, string>>('/settings', apiGet);
  const [ratesForm, setRatesForm] = useState({
    free_delivery_threshold: '799',
    delivery_charge: '50',
    min_order_value: '99',
    cod_extra_charge: '40'
  });
  const [isEditingRates, setIsEditingRates] = useState(false);
  const [savingRates, setSavingRates] = useState(false);

  useEffect(() => {
    if (rawSettings) {
      setRatesForm({
        free_delivery_threshold: rawSettings['free_delivery_threshold'] || '799',
        delivery_charge: rawSettings['delivery_charge'] || '50',
        min_order_value: rawSettings['min_order_value'] || '99',
        cod_extra_charge: rawSettings['cod_extra_charge'] || '40'
      });
    }
  }, [rawSettings]);

  const handleSaveRates = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingRates(true);
      await apiPut('/settings', {
        free_delivery_threshold: ratesForm.free_delivery_threshold,
        delivery_charge: ratesForm.delivery_charge,
        min_order_value: ratesForm.min_order_value,
        cod_extra_charge: ratesForm.cod_extra_charge
      });
      await mutateSettings();
      // Trigger storefront ISR revalidation
      fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: 'anuki_secret_revalidate_token',
          paths: ['/cart', '/checkout', '/'],
          tag: 'settings'
        })
      }).catch(console.error);

      toast.success('Shipping rates updated and synced with store settings!');
      setIsEditingRates(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save shipping rates');
    } finally {
      setSavingRates(false);
    }
  };

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = !search || 
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      (s.awb && s.awb.toLowerCase().includes(search.toLowerCase())) ||
      s.customer.toLowerCase().includes(search.toLowerCase());
    const matchesCourier = courierFilter === 'All Couriers' || s.courier === courierFilter;
    return matchesSearch && matchesCourier;
  });

  const storeAddress = rawSettings?.['store_address'] || 'Maurya Vihar Colony, Kumhrar, Patna, Bihar 800026';

  return (
    <>
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Shipping & Fulfillment</h1>
          <p className="text-neutral-500 mt-1">Track dispatched orders, configure rates, and manage fulfillment.</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 bg-white p-2 rounded-2xl border border-neutral-200 w-max max-w-full">
        <button 
          onClick={() => setActiveTab('SHIPMENTS')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'SHIPMENTS' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
        >
          <Truck size={16} /> Active Shipments ({shipments.length})
        </button>
        <button 
          onClick={() => setActiveTab('RATES')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'RATES' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
        >
          <Settings2 size={16} /> Shipping Rates
        </button>
        <button 
          onClick={() => setActiveTab('PICKUPS')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'PICKUPS' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
        >
          <CalendarClock size={16} /> Schedule Pickup
        </button>
      </div>

      {activeTab === 'SHIPMENTS' && (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-3xl border border-neutral-200 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by Order ID, AWB, or Customer..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-shadow text-sm font-medium"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <select 
                value={courierFilter}
                onChange={(e) => setCourierFilter(e.target.value)}
                className="px-4 py-3 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-600 outline-none bg-white"
              >
                <option>All Couriers</option>
                <option>Delhivery</option>
                <option>BlueDart</option>
                <option>DTDC</option>
                <option>India Post</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-x-auto">
            {loadingShipments ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-neutral-400" size={32} />
                <span className="ml-3 text-neutral-500 font-medium">Loading real shipments...</span>
              </div>
            ) : filteredShipments.length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                  <Truck size={32} />
                </div>
                <h3 className="text-lg font-bold text-neutral-800 mb-1">No Active Shipments Found</h3>
                <p className="text-sm text-neutral-500 max-w-md mx-auto">
                  Only real shipments created from customer orders are listed here. Orders assigned tracking numbers will appear automatically.
                </p>
                <div className="mt-6">
                  <Link href="/admin/orders" className="inline-block px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-bold hover:bg-neutral-800 transition-colors">
                    View Orders
                  </Link>
                </div>
              </div>
            ) : (
              <table className="w-full text-left min-w-[1000px]">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Order / Customer</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Logistics</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-center">Status</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Est. Delivery</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredShipments.map(shipment => (
                    <tr key={shipment.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="px-6 py-5">
                        <Link href={`/admin/orders/${shipment.orderId}`} className="font-black text-neutral-900 hover:text-rose-600 transition-colors">
                          {shipment.id}
                        </Link>
                        <div className="text-sm font-medium text-neutral-500 mt-1">{shipment.customer}</div>
                        <div className="text-xs font-bold text-neutral-400 mt-0.5 flex items-center gap-1"><MapPin size={12}/> {shipment.destination}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-bold text-neutral-900">{shipment.courier || 'Standard Courier'}</div>
                        {shipment.awb ? (
                          <div className="text-xs font-mono bg-neutral-100 inline-block px-1.5 py-0.5 rounded text-neutral-600 mt-1">AWB: {shipment.awb}</div>
                        ) : (
                          <div className="text-xs font-bold text-neutral-400 mt-1">Unassigned</div>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 tracking-wider">
                          {shipment.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-bold text-neutral-700 text-sm">
                        {shipment.expectedDelivery ? new Date(shipment.expectedDelivery).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-5 text-right space-x-3">
                        {shipment.trackingUrl ? (
                          <a href={shipment.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-500 font-bold hover:text-neutral-900 text-sm inline-flex items-center gap-1">
                            <ExternalLink size={14}/> Track
                          </a>
                        ) : (
                          <Link href={`/admin/orders/${shipment.orderId}`} className="text-rose-600 font-bold hover:underline text-sm">
                            Manage
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'RATES' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
                <div>
                  <h2 className="font-black text-lg text-neutral-900">Domestic Shipping Zones & Rates</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">Synced directly with store Settings (source of truth for checkout & cart)</p>
                </div>
                <button 
                  onClick={() => setIsEditingRates(!isEditingRates)}
                  className="px-4 py-2 border border-neutral-300 rounded-xl text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  {isEditingRates ? 'Cancel' : 'Edit Rates'}
                </button>
              </div>

              {isEditingRates ? (
                <form onSubmit={handleSaveRates} className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                        Free Delivery Threshold (₹)
                      </label>
                      <input 
                        type="number"
                        min="0"
                        value={ratesForm.free_delivery_threshold}
                        onChange={(e) => setRatesForm(prev => ({ ...prev, free_delivery_threshold: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-rose-500 outline-none"
                        required
                      />
                      <p className="text-xs text-neutral-400 mt-1">Orders at or above this amount receive free delivery.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                        Standard Delivery Charge (₹)
                      </label>
                      <input 
                        type="number"
                        min="0"
                        value={ratesForm.delivery_charge}
                        onChange={(e) => setRatesForm(prev => ({ ...prev, delivery_charge: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-rose-500 outline-none"
                        required
                      />
                      <p className="text-xs text-neutral-400 mt-1">Charged on orders below the free delivery threshold.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                        Minimum Order Value (₹)
                      </label>
                      <input 
                        type="number"
                        min="0"
                        value={ratesForm.min_order_value}
                        onChange={(e) => setRatesForm(prev => ({ ...prev, min_order_value: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-rose-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                        Cash on Delivery Extra Surcharge (₹)
                      </label>
                      <input 
                        type="number"
                        min="0"
                        value={ratesForm.cod_extra_charge}
                        onChange={(e) => setRatesForm(prev => ({ ...prev, cod_extra_charge: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-rose-500 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
                    <button 
                      type="button"
                      onClick={() => setIsEditingRates(false)}
                      className="px-4 py-2 text-sm font-bold text-neutral-500 hover:text-neutral-800"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={savingRates}
                      className="px-6 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-sm"
                    >
                      {savingRates ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      Save Shipping Rates
                    </button>
                  </div>
                </form>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {/* Zone 1: PAN India Standard */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-neutral-900 text-lg flex items-center gap-2">
                          <MapPin size={18} className="text-rose-500" /> PAN-India Standard Delivery
                        </h3>
                        <p className="text-sm font-medium text-neutral-500 mt-1">All states & union territories across India</p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">Active</span>
                    </div>
                    <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-1">Standard Delivery</p>
                        <p className="font-black text-lg">₹{ratesForm.delivery_charge}</p>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-1">Free Delivery On</p>
                        <p className="font-black text-lg text-emerald-600">₹{ratesForm.free_delivery_threshold}+</p>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-1">Min. Order Value</p>
                        <p className="font-black text-lg">₹{ratesForm.min_order_value}</p>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-1">COD Surcharge</p>
                        <p className="font-black text-lg">₹{ratesForm.cod_extra_charge}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-900 rounded-3xl shadow-sm border border-neutral-800 text-white p-6">
              <h2 className="font-black text-lg mb-4 flex items-center gap-2">
                <Package size={20} /> Active Shipping Logic
              </h2>
              <div className="space-y-4">
                <p className="text-sm text-neutral-400 font-medium leading-relaxed">
                  Store uses <strong className="text-white">Threshold-based delivery</strong> synced directly with Settings.
                </p>
                <div className="h-px bg-neutral-800"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">Free Shipping Threshold</p>
                    <p className="text-xs text-neutral-400 mt-0.5">Applied at checkout & cart</p>
                  </div>
                  <span className="font-black text-emerald-400 text-lg">₹{ratesForm.free_delivery_threshold}</span>
                </div>
                <div className="h-px bg-neutral-800"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">Standard Delivery Charge</p>
                    <p className="text-xs text-neutral-400 mt-0.5">Orders under ₹{ratesForm.free_delivery_threshold}</p>
                  </div>
                  <span className="font-black text-white text-lg">₹{ratesForm.delivery_charge}</span>
                </div>
              </div>
              <button 
                onClick={() => setIsEditingRates(true)}
                className="w-full mt-6 bg-white text-neutral-900 px-4 py-2.5 rounded-xl font-bold hover:bg-neutral-100 transition-colors shadow-sm"
              >
                Configure Rates
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'PICKUPS' && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
              <h2 className="font-black text-lg text-neutral-900">Schedule Courier Pickup</h2>
              <span className="bg-neutral-100 text-neutral-700 text-xs font-black px-2.5 py-1 rounded-md">0 Orders Pending Pickup</span>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Pickup Date</label>
                  <input type="date" className="w-full border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none font-bold text-neutral-700" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Time Slot</label>
                  <select className="w-full border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none font-bold text-neutral-700">
                    <option>10:00 AM - 1:00 PM</option>
                    <option>2:00 PM - 5:00 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Pickup Location (Store / Studio)</label>
                <div className="w-full border border-neutral-200 rounded-xl p-3.5 bg-neutral-50 text-sm font-bold text-neutral-700 flex items-start gap-2">
                  <MapPin size={18} className="text-rose-500 shrink-0 mt-0.5" />
                  <span>{storeAddress}</span>
                </div>
              </div>
              <button 
                onClick={() => toast.info('Pickup scheduling request received. Couriers will be assigned upon order fulfillment.')}
                className="w-full bg-neutral-900 text-white px-6 py-3.5 rounded-xl font-black hover:bg-neutral-800 transition-colors shadow-md"
              >
                Confirm & Request Pickup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
