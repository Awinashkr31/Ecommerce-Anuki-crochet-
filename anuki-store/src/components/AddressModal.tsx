'use client';
import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Edit2, Loader2, MapPin, Trash2 } from 'lucide-react';
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
  hideDelete?: boolean;
  startInFormMode?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FloatingInput = ({ label, type = 'text', value, onChange, className = '', maxLength }: any) => (
  <div className={`relative ${className}`}>
    <input 
      type={type}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className="block px-4 pb-2 pt-6 w-full text-sm text-neutral-900 bg-white rounded-xl shadow-sm border-0 appearance-none focus:outline-none focus:ring-2 focus:ring-rose-500 peer"
      placeholder=" "
    />
    <label className="absolute text-xs text-neutral-500 duration-150 transform -translate-y-3 scale-90 top-3 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1.5 peer-placeholder-shown:text-sm peer-focus:scale-90 peer-focus:-translate-y-3 peer-focus:text-rose-500 pointer-events-none">
      {label}
    </label>
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FloatingTextarea = ({ label, value, onChange, rows = 3, className = '' }: any) => (
  <div className={`relative ${className}`}>
    <textarea 
      value={value}
      onChange={onChange}
      rows={rows}
      className="block px-4 pb-2 pt-6 w-full text-sm text-neutral-900 bg-white rounded-xl shadow-sm border-0 appearance-none focus:outline-none focus:ring-2 focus:ring-rose-500 peer resize-none"
      placeholder=" "
    />
    <label className="absolute text-xs text-neutral-500 duration-150 transform -translate-y-3 scale-90 top-3 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1.5 peer-placeholder-shown:text-sm peer-focus:scale-90 peer-focus:-translate-y-3 peer-focus:text-rose-500 pointer-events-none">
      {label}
    </label>
  </div>
);

export default function AddressModal({ isOpen, onClose, onSelect, selectedAddressId, hideDelete, startInFormMode }: AddressModalProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        // Automatically show the form if they have zero addresses
        if (data.length === 0) {
          setShowForm(true);
        } else if (!editingAddress) {
          // Only force close the form if we aren't currently editing
          setShowForm(false);
        }
      }
    } catch (err: unknown) {
      // Suppress 401 Unauthorized or missing session errors in console overlay
      const error = err as { message?: string };
      if (error.message && !error.message.includes('401') && !error.message.toLowerCase().includes('session')) {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFullName('');
    setPhone('');
    setPincode('');
    setCity('');
    setState('');
    setStreet('');
    setLandmark('');
    setEditingAddress(null);
    setAddressToDelete(null);
    setError('');
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isOpen) {
        resetForm();
        if (startInFormMode) {
          setShowForm(true);
          setLoading(false);
        } else {
          setShowForm(false);
          fetchAddresses();
        }
      }
    }, 0);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, startInFormMode]);

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

    if (phone.length !== 10) {
      setError('Mobile Number must be exactly 10 digits');
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
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to save address');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!addressToDelete) return;
    try {
      setIsDeleting(true);
      await api(`/addresses/${addressToDelete}`, { method: 'DELETE' });
      await fetchAddresses();
      if (selectedAddressId === addressToDelete) {
        onSelect({} as Address); 
      }
      setAddressToDelete(null);
    } catch (err) {
      console.error('Failed to delete address:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-end md:items-center justify-center md:p-4 transition-opacity">
      <div className="bg-[#f9f9f9] w-full md:max-w-md rounded-t-3xl md:rounded-2xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-150 md:fade-in md:zoom-in md:slide-in-from-bottom-0">
        
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
                          
                          <div className="flex flex-col items-end gap-2">
                            {isSelected && (
                              <CheckCircle2 className="text-rose-500 fill-rose-50 mb-1" size={22} />
                            )}
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(addr);
                                }}
                                className={`p-1.5 rounded-full hover:bg-neutral-100 transition-colors ${
                                  isSelected ? 'text-rose-500' : 'text-neutral-400'
                                }`}
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              {!hideDelete && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setAddressToDelete(addr.id);
                                  }}
                                  className="p-1.5 rounded-full hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-red-500"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
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
                <FloatingInput 
                  label="Full Name *" 
                  value={fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput 
                    type="tel" 
                    label="Mobile Number *" 
                    value={phone}
                    maxLength={10}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value.replace(/\D/g, ''))}
                  />
                  <FloatingInput 
                    label="Pincode *" 
                    value={pincode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPincode(e.target.value)}
                  />
                </div>

                <FloatingTextarea 
                  label="Address (House / Flat / Block, Area, Colony) *" 
                  value={street}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setStreet(e.target.value)}
                  rows={3}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput 
                    label="City *" 
                    value={city}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
                  />
                  <FloatingInput 
                    label="State *" 
                    value={state}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState(e.target.value)}
                  />
                </div>

                <FloatingInput 
                  label="Landmark (Optional)" 
                  value={landmark}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLandmark(e.target.value)}
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

      {/* Custom Delete Confirmation Modal */}
      {addressToDelete && (
        <div className="fixed inset-0 z-[110] bg-black/40 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in duration-150">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Delete Address</h3>
            <p className="text-neutral-500 text-sm mb-6">Are you sure you want to delete this address? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button 
                disabled={isDeleting}
                onClick={() => setAddressToDelete(null)}
                className="px-5 py-2.5 rounded-xl font-bold text-neutral-600 hover:bg-neutral-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting && <Loader2 className="animate-spin" size={16} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
