"use client";

import Link from 'next/link';
import { ArrowLeft, Search, Plus, Trash2, IndianRupee, MapPin, User, Mail, Phone } from 'lucide-react';

export default function NewOrderPage() {
  return (
    <div className="max-w-5xl mx-auto pb-24 relative">
      
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-50 bg-neutral-50/80 backdrop-blur-md pb-4 pt-2 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Create Manual Order</h1>
            <p className="text-sm font-medium text-neutral-500">Log an order from Instagram, Phone, etc.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-5 py-2 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors shadow-md shadow-neutral-200">
            Create Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Item Selection Mock */}
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
              <h2 className="font-bold text-neutral-900">Order Items</h2>
            </div>
            
            <div className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search products by name or SKU to add..." 
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-shadow text-sm font-medium"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-neutral-100 text-neutral-600 p-1.5 rounded-lg hover:bg-neutral-200 transition-colors">
                  <Plus size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Selected Item Mock */}
                <div className="flex items-center justify-between border border-neutral-200 p-4 rounded-2xl bg-neutral-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-neutral-200 rounded-lg flex-shrink-0"></div>
                    <div>
                      <p className="font-bold text-sm">Amigurumi Bunny</p>
                      <p className="text-xs text-neutral-500 mt-0.5">₹850</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-neutral-200 rounded-lg bg-white overflow-hidden">
                      <button className="px-3 py-1 text-neutral-500 hover:bg-neutral-50 font-bold">-</button>
                      <span className="px-3 py-1 font-bold text-sm border-x border-neutral-200">1</span>
                      <button className="px-3 py-1 text-neutral-500 hover:bg-neutral-50 font-bold">+</button>
                    </div>
                    <button className="text-neutral-400 hover:text-rose-600 p-2"><Trash2 size={18}/></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <h2 className="font-bold text-neutral-900">Customer Details</h2>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search existing customer by email or phone..." 
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-shadow text-sm font-medium"
                />
              </div>

              <div className="flex items-center gap-4 my-2">
                <div className="h-px bg-neutral-200 flex-1"></div>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Or enter manually</span>
                <div className="h-px bg-neutral-200 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">First Name</label>
                  <input type="text" className="w-full border border-neutral-200 rounded-xl p-3 focus:border-rose-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Last Name</label>
                  <input type="text" className="w-full border border-neutral-200 rounded-xl p-3 focus:border-rose-500 outline-none transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Email</label>
                  <input type="email" className="w-full border border-neutral-200 rounded-xl p-3 focus:border-rose-500 outline-none transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Phone</label>
                  <input type="tel" className="w-full border border-neutral-200 rounded-xl p-3 focus:border-rose-500 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Shipping Address</label>
                <textarea rows={3} className="w-full border border-neutral-200 rounded-xl p-3 focus:border-rose-500 outline-none transition-all resize-none"></textarea>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-neutral-700 mb-2">City</label>
                  <input type="text" className="w-full border border-neutral-200 rounded-xl p-3 focus:border-rose-500 outline-none transition-all" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-bold text-neutral-700 mb-2">State</label>
                  <input type="text" className="w-full border border-neutral-200 rounded-xl p-3 focus:border-rose-500 outline-none transition-all" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-bold text-neutral-700 mb-2">Pincode</label>
                  <input type="text" className="w-full border border-neutral-200 rounded-xl p-3 focus:border-rose-500 outline-none transition-all" />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Order Source */}
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <h2 className="font-bold text-neutral-900">Order Source</h2>
            </div>
            <div className="p-6 space-y-4">
              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input type="radio" name="source" className="text-rose-600 focus:ring-rose-500" defaultChecked />
                <span className="flex items-center gap-2 font-bold text-neutral-700"><Mail size={18} className="text-pink-600"/> Instagram DM</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input type="radio" name="source" className="text-rose-600 focus:ring-rose-500" />
                <div className="flex items-center gap-2 font-bold text-neutral-700"><Phone size={18} className="text-blue-600"/> Phone Call</div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input type="radio" name="source" className="text-rose-600 focus:ring-rose-500" />
                <div className="flex items-center gap-2 font-bold text-neutral-700"><User size={18} className="text-emerald-600"/> In Person / Fair</div>
              </label>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <h2 className="font-bold text-neutral-900">Payment Collection</h2>
            </div>
            <div className="p-6 space-y-4">
              <select className="w-full border border-neutral-200 rounded-xl p-3 outline-none focus:border-rose-500 bg-white font-bold text-neutral-700">
                <option>Select Payment Method</option>
                <option>UPI Link Sent</option>
                <option>Bank Transfer</option>
                <option>Cash (In Person)</option>
                <option>Cash on Delivery</option>
              </select>
              
              <div className="pt-4 border-t border-neutral-100">
                <label className="flex items-center gap-2 text-sm font-bold text-neutral-700">
                  <input type="checkbox" className="rounded border-neutral-300 text-rose-600 focus:ring-rose-500" />
                  Mark as Paid
                </label>
                <p className="text-xs text-neutral-500 mt-1 ml-6">Only check this if you have already received the funds.</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-neutral-50 rounded-3xl shadow-sm border border-neutral-200 p-6">
            <h2 className="font-bold text-neutral-900 mb-4">Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-bold text-neutral-600">
                <span>Subtotal (1 item)</span>
                <span>₹850</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-600">
                <span>Shipping</span>
                <span>₹0</span>
              </div>
              <div className="pt-3 border-t border-neutral-200 flex justify-between text-lg font-black text-neutral-900">
                <span>Total</span>
                <span>₹850</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
