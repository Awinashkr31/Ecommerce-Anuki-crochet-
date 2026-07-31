"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Truck, Search, MapPin, Package, Settings2, ExternalLink, CalendarClock, IndianRupee } from 'lucide-react';

const mockShipments = [
  { id: 'ORD-84390', awb: '10982374921', courier: 'Delhivery', status: 'IN_TRANSIT', expectedDelivery: '2026-10-10', customer: 'Priya Patel', destination: 'Mumbai, MH' },
  { id: 'ORD-84389', awb: '10982374920', courier: 'BlueDart', status: 'OUT_FOR_DELIVERY', expectedDelivery: '2026-10-08', customer: 'Amit Kumar', destination: 'Delhi, DL' },
  { id: 'ORD-84388', awb: 'Pending', courier: 'Auto (Shiprocket)', status: 'READY_TO_SHIP', expectedDelivery: null, customer: 'Neha Singh', destination: 'Bangalore, KA' },
];

export default function AdminShippingPage() {
  const [activeTab, setActiveTab] = useState<'SHIPMENTS' | 'RATES' | 'PICKUPS'>('SHIPMENTS');

  return (
    <>
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Shipping & Fulfillment</h1>
          <p className="text-neutral-500 mt-1">Track dispatched orders, configure rates, and schedule pickups.</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 bg-white p-2 rounded-2xl border border-neutral-200 w-max max-w-full">
        <button 
          onClick={() => setActiveTab('SHIPMENTS')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'SHIPMENTS' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
        >
          <Truck size={16} /> Active Shipments
        </button>
        <button 
          onClick={() => setActiveTab('PICKUPS')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'PICKUPS' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
        >
          <CalendarClock size={16} /> Schedule Pickup
        </button>
        <button 
          onClick={() => setActiveTab('RATES')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'RATES' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
        >
          <Settings2 size={16} /> Shipping Rates
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
                placeholder="Search by Order ID or AWB..." 
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-shadow text-sm font-medium"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <select className="px-4 py-3 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-600 outline-none bg-white">
                <option>All Couriers</option>
                <option>Delhivery</option>
                <option>BlueDart</option>
                <option>Ecom Express</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-x-auto">
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
                {mockShipments.map(shipment => (
                  <tr key={shipment.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-6 py-5">
                      <Link href={`/admin/orders/${shipment.id}`} className="font-black text-neutral-900 hover:text-rose-600 transition-colors">
                        {shipment.id}
                      </Link>
                      <div className="text-sm font-medium text-neutral-500 mt-1">{shipment.customer}</div>
                      <div className="text-xs font-bold text-neutral-400 mt-0.5 flex items-center gap-1"><MapPin size={12}/> {shipment.destination}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-neutral-900">{shipment.courier}</div>
                      {shipment.awb !== 'Pending' ? (
                        <div className="text-xs font-mono bg-neutral-100 inline-block px-1.5 py-0.5 rounded text-neutral-600 mt-1">AWB: {shipment.awb}</div>
                      ) : (
                        <div className="text-xs font-bold text-neutral-400 mt-1">Unassigned</div>
                      )}
                    </td>
                    <td className="px-6 py-5 text-center">
                      {shipment.status === 'IN_TRANSIT' && <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 tracking-wider">In Transit</span>}
                      {shipment.status === 'OUT_FOR_DELIVERY' && <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-100 tracking-wider">Out for Delivery</span>}
                      {shipment.status === 'READY_TO_SHIP' && <span className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-xs font-bold border border-neutral-200 tracking-wider">Ready to Ship</span>}
                    </td>
                    <td className="px-6 py-5 font-bold text-neutral-700 text-sm">
                      {shipment.expectedDelivery ? new Date(shipment.expectedDelivery).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-5 text-right space-x-3">
                      {shipment.status === 'READY_TO_SHIP' ? (
                        <button className="text-rose-600 font-bold hover:underline text-sm">Override Courier</button>
                      ) : (
                        <button className="text-neutral-500 font-bold hover:text-neutral-900 text-sm flex items-center justify-end gap-1 w-full"><ExternalLink size={14}/> Track</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'RATES' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50">
                <h2 className="font-black text-lg text-neutral-900">Domestic Shipping Zones</h2>
              </div>
              <div className="divide-y divide-neutral-100">
                {/* Zone 1 */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-lg">Zone 1: Local / State</h3>
                      <p className="text-sm font-medium text-neutral-500 mt-1">Delhi NCR & Haryana</p>
                    </div>
                    <button className="text-neutral-400 hover:text-rose-600 transition-colors">Edit</button>
                  </div>
                  <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-1">Base Rate (0 - 500g)</p>
                      <p className="font-black text-lg">₹60</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-1">Additional 500g</p>
                      <p className="font-black text-lg">₹40</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-1">COD Surcharge</p>
                      <p className="font-black text-lg">₹50</p>
                    </div>
                  </div>
                </div>

                {/* Zone 2 */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-lg">Zone 2: National (Metro)</h3>
                      <p className="text-sm font-medium text-neutral-500 mt-1">Mumbai, Bangalore, Chennai, Kolkata</p>
                    </div>
                    <button className="text-neutral-400 hover:text-rose-600 transition-colors">Edit</button>
                  </div>
                  <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-1">Base Rate (0 - 500g)</p>
                      <p className="font-black text-lg">₹100</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-1">Additional 500g</p>
                      <p className="font-black text-lg">₹80</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-1">COD Surcharge</p>
                      <p className="font-black text-lg">₹60</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-900 rounded-3xl shadow-sm border border-neutral-800 text-white p-6">
              <h2 className="font-black text-lg mb-4 flex items-center gap-2">
                <Package size={20} /> Shipping Logic
              </h2>
              <div className="space-y-4">
                <p className="text-sm text-neutral-400 font-medium leading-relaxed">
                  Store uses <strong className="text-white">Weight-based calculation</strong> by default.
                </p>
                <div className="h-px bg-neutral-800"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">Free Shipping Threshold</p>
                    <p className="text-xs text-neutral-400 mt-1">Active</p>
                  </div>
                  <span className="font-black text-emerald-400 text-lg">₹999</span>
                </div>
              </div>
              <button className="w-full mt-6 bg-white text-neutral-900 px-4 py-2.5 rounded-xl font-bold hover:bg-neutral-100 transition-colors">
                Configure Logic
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
              <span className="bg-amber-100 text-amber-800 text-xs font-black px-2 py-1 rounded-md">8 Orders Pending</span>
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
                <label className="block text-sm font-bold text-neutral-700 mb-2">Pickup Location (Warehouse)</label>
                <select className="w-full border border-neutral-200 rounded-xl p-3 focus:ring-2 focus:ring-rose-500 outline-none font-bold text-neutral-700">
                  <option>Primary Studio (Delhi, 110016)</option>
                </select>
              </div>
              <button className="w-full bg-neutral-900 text-white px-6 py-3.5 rounded-xl font-black hover:bg-neutral-800 transition-colors shadow-md">
                Confirm & Request Pickup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
