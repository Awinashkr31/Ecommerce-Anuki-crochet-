"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, X, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem } = useCartStore();
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <>
      {/* Trigger */}
      <button 
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
      >
        <ShoppingCart size={24} />
        {itemCount > 0 && (
          <span className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {itemCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100">
          <h2 className="text-xl font-bold">Your Cart ({itemCount})</h2>
          <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-neutral-900">
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-4">
              <ShoppingCart size={48} className="opacity-20" />
              <p>Your cart is empty.</p>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-rose-600 font-bold hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-neutral-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm line-clamp-2">{item.name}</h3>
                    <p className="text-neutral-500 text-sm mt-1">Qty: {item.quantity}</p>
                    {item.customization && (
                      <p className="text-xs text-neutral-400 mt-1 italic">{item.customization}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <p className="font-bold text-rose-600">₹{item.price}</p>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-neutral-100 bg-neutral-50">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-neutral-600">Subtotal</span>
              <span className="text-xl font-bold">₹{totalAmount}</span>
            </div>
            <Link 
              href="/checkout" 
              onClick={() => setIsOpen(false)}
              className="block w-full bg-neutral-900 text-white text-center py-4 rounded-xl font-bold hover:bg-neutral-800 transition-colors"
            >
              Checkout Securely
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
