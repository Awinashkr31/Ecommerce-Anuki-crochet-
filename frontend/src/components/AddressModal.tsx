'use client';
import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Edit2, Loader2, MapPin } from 'lucide-react';
import { api, apiGet, apiPost } from '@/lib/api';

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  landmark: string | null;
  isDefault: boolean;
}

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: Address) => void;
  selectedAddressId?: string;
}

export default function AddressModal({ isOpen, onClose, onSelect, selectedAddressId }: AddressModalProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await apiGet<Address[]>('/addresses');
      if (data) {
        setAddresses(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
      setShowForm(false);
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFullName('');
    setPhone('');
    setPincode('');
    setCity('');
    setState('');
    setStreet('');
    setLandmark('');
    setEditingAddress(null);
    setError('');
  };

  useEffect(() => {
    const fetchPincodeDetails = async () => {
      if (pincode.length === 6 && /^\d+$/.test(pincode)) {
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
          const data = await res.json();
          if (data && data[0] && data[0].Status === 'Success') {
            const postOffice = data[0].PostOffice[0];
            setCity(postOffice.District || postOffice.Region);
            setState(postOffice.State);
          }
        } catch (error) {
          console.error("Failed to fetch pincode details:", error);
        }
      }
    };
    fetchPincodeDetails();
  }, [pincode]);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFullName(address.fullName);
    setPhone(address.phone);
    setPincode(address.zipCode);
    setCity(address.city);
    setState(address.state);
    setStreet(address.street);
    setLandmark(address.landmark || '');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!fullName || !phone || !pincode || !city || !state || !street) {
      setError('Please fill all required fields');
      return;
    }
    
    setIsSaving(true);
    setError('');

    const payload = {
      fullName, phone, pincode, city, state, address: street, landmark, isDefault: true
    };
    
    try {
      let updatedData;
      if (editingAddress) {
        updatedData = await api<Address>(`/addresses/${editingAddress.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        updatedData = await apiPost<Address>('/addresses', payload);
      }
      
      await fetchAddresses();
      setShowForm(false);
      resetForm();
      
      // Auto select the newly saved address
      if (updatedData && updatedData.id) {
        onSelect(updatedData);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-[#f9f9f9] w-full max-w-md rounded-2xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between bg-white border-b sticky top-0 z-10">
          <h2 className="text-lg font-serif font-semibold text-neutral-800">Delivery Address</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          {!showForm ? (
            <div className="space-y-6">
              <h3 className="text-[11px] font-bold text-neutral-400 tracking-widest uppercase">Saved Addresses</h3>
              
              {loading ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="animate-spin text-rose-500" size={24} />
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <MapPin className="mx-auto mb-3 opacity-20" size={48} />
                  <p>No saved addresses found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div 
                        key={addr.id}
                        onClick={() => onSelect(addr)}
                        className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer bg-white group ${
                          isSelected ? 'border-rose-500' : 'border-transparent hover:border-neutral-200 shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-neutral-900 mb-1">{addr.fullName}</h4>
                            <p className="text-sm text-neutral-600 leading-relaxed mb-2">
                              {addr.street}, {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city}, {addr.state} - {addr.zipCode}
                            </p>
                            <p className="text-sm text-neutral-600">
                              Mobile: <span className="font-medium text-neutral-800">{addr.phone}</span>
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-end gap-3">
                            {isSelected && (
                              <CheckCircle2 className="text-rose-500 fill-rose-50" size={22} />
                            )}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(addr);
                              }}
                              className={`p-1.5 rounded-full hover:bg-neutral-100 transition-colors ${
                                isSelected ? 'text-rose-500' : 'text-neutral-400'
                              }`}
                            >
                              <Edit2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="pt-4 border-t border-neutral-200 flex justify-center">
                <button 
                  onClick={() => setShowForm(true)}
                  className="px-6 py-2.5 rounded-full border border-neutral-300 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  + ADD NEW
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[13px] font-bold text-neutral-800">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                <button 
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-xs font-semibold text-neutral-500 hover:text-neutral-800"
                >
                  Cancel
                </button>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Full Name *" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-white border-0 px-4 py-3.5 rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="tel" 
                    placeholder="Mobile Number *" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-white border-0 px-4 py-3.5 rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Pincode *" 
                    value={pincode}
                    onChange={e => setPincode(e.target.value)}
                    className="w-full bg-white border-0 px-4 py-3.5 rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="City *" 
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-white border-0 px-4 py-3.5 rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="State *" 
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full bg-white border-0 px-4 py-3.5 rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <textarea 
                  placeholder="Address (House / Flat / Block, Area, Colony) *" 
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  rows={3}
                  className="w-full bg-white border-0 px-4 py-3.5 rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-rose-500 outline-none resize-none"
                />

                <input 
                  type="text" 
                  placeholder="Landmark (Optional)" 
                  value={landmark}
                  onChange={e => setLandmark(e.target.value)}
                  className="w-full bg-white border-0 px-4 py-3.5 rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-[#2a2626] text-white font-bold py-4 rounded-xl mt-6 hover:bg-black transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : null}
                Save Address
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
