"use client";

import { useState, use } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2, Copy, Loader2, Image as ImageIcon, Check, ListTree } from 'lucide-react';
import { compressImageToWebP } from '@/lib/imageCompression';
import { apiGet, apiPost, apiPut, apiDelete, apiUpload } from '../../../../../lib/api';
import { toast } from "sonner";

export default function VariantManagementPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { id } = params;
  const { data: product, mutate, isLoading } = useSWR(`/products/${id}`, (url: string) => apiGet<any>(url));
  
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState('Variant Basics');
  const TABS = ['Variant Basics', 'Product Details', 'Shipping & Attributes'];
  
  const handleOpenAdd = () => {
    setEditingVariant({
      id: null,
      color: '',
      size: '',
      material: product?.material || '',
      style: '',
      sku: '',
      price: '',
      stock: 0,
      imageUrls: [],
      name: product?.name || '',
      shortDesc: product?.shortDesc || '',
      fullDesc: product?.fullDesc || '',
      salePrice: product?.salePrice || '',
      costPrice: product?.costPrice || '',
      weight: product?.weight || '',
      length: product?.length || '',
      width: product?.width || '',
      height: product?.height || '',
      isHandmade: product?.isHandmade ?? true,
      careInstructions: product?.careInstructions || '',
      countryOfOrigin: product?.countryOfOrigin || '',
      taxSettings: product?.taxSettings || '',
      stockStatus: product?.stockStatus || 'IN_STOCK',
      lowStockThreshold: product?.lowStockThreshold || 5,
      shippingCharges: product?.shippingCharges || '',
      freeShipping: product?.freeShipping ?? false
    });
    setActiveTab('Variant Basics');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: any) => {
    setEditingVariant({
      ...v,
      salePrice: v.salePrice || '',
      costPrice: v.costPrice || '',
      weight: v.weight || '',
      length: v.length || '',
      width: v.width || '',
      height: v.height || '',
      shippingCharges: v.shippingCharges || ''
    });
    setActiveTab('Variant Basics');
    setIsModalOpen(true);
  };

  const handleCopyVariant = async (variantId: string) => {
    try {
      await apiPost(`/products/${id}/variants/${variantId}/copy`, {});
      mutate();
      toast.success('Variant duplicated successfully');
    } catch (err) {
      toast.error('Failed to copy variant');
    }
  };

  const handleDelete = async (variantId: string) => {
    if (!confirm('Are you sure you want to delete this variant?')) return;
    try {
      await apiDelete(`/products/${id}/variants/${variantId}`);
      mutate();
      toast.success('Variant deleted');
    } catch (err) {
      toast.error('Failed to delete variant');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = { ...editingVariant };
      if (payload.price === '' || payload.price === null || payload.price === undefined) {
        payload.price = product.basePrice;
      }

      if (editingVariant.id) {
        await apiPut(`/products/${id}/variants/${editingVariant.id}`, payload);
      } else {
        await apiPost(`/products/${id}/variants`, payload);
      }
      mutate();
      setIsModalOpen(false);
      toast.success(editingVariant.id ? 'Variant updated' : 'Variant added');
    } catch (err) {
      toast.error('Failed to save variant');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    try {
      const file = e.target.files[0];
      const compressedFile = await compressImageToWebP(file, 200, 1000);
      const formData = new FormData();
      formData.append('image', compressedFile);
      formData.append('folder', 'products');
      const data = await apiUpload('/upload', formData);
      setEditingVariant((prev: any) => ({ 
        ...prev, 
        imageUrls: [...(prev.imageUrls || []), data.url] 
      }));
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Failed to upload image. Please try again or check the file format.');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setEditingVariant((prev: any) => ({
      ...prev,
      imageUrls: (prev.imageUrls || []).filter((_: any, i: number) => i !== index)
    }));
  };

  if (isLoading) return <div className="p-8 flex items-center justify-center"><Loader2 className="animate-spin text-rose-500" size={32} /></div>;
  if (!product) return <div className="p-8 text-center">Product not found</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto pb-32">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2 font-medium">
            <Link href="/admin/products" className="hover:text-rose-600 transition-colors">Products</Link>
            <span>/</span>
            <Link href={`/admin/products/edit/${id}`} className="hover:text-rose-600 transition-colors">{product.name}</Link>
            <span>/</span>
            <span className="text-neutral-900">Variants</span>
          </div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Manage Variants</h1>
        </div>
        <button onClick={handleOpenAdd} className="bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-rose-700 flex items-center gap-2 shadow-sm">
          <Plus size={18} /> Add Variant
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        {product.variants?.length === 0 ? (
          <div className="p-16 text-center text-neutral-500">
            <ListTree className="mx-auto mb-4 text-neutral-300" size={48} />
            <h3 className="text-xl font-bold text-neutral-900 mb-2">No variants yet</h3>
            <p className="mb-6">Add variants like different colors, sizes, or styles.</p>
            <button onClick={handleOpenAdd} className="bg-neutral-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-black transition-colors">
              Create First Variant
            </button>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Image</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Variant Name</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">SKU</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Price</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Stock</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {product.variants?.map((v: any) => (
                <tr key={v.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden flex items-center justify-center border border-neutral-200">
                      {(v.imageUrls && v.imageUrls.length > 0) ? <img src={v.imageUrls[0]} alt="Variant" className="w-full h-full object-cover" /> : (v.imageUrl ? <img src={v.imageUrl} alt="Variant" className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-neutral-400" />)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-neutral-900">
                      {[v.color, v.size, v.material, v.style].filter(Boolean).join(' • ') || 'Standard'}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-sm text-neutral-600">{v.sku || '—'}</td>
                  <td className="px-6 py-4 font-bold text-sm">₹{v.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${v.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {v.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenEdit(v)} className="p-1.5 text-neutral-400 hover:text-blue-600 transition-colors" title="Edit"><Edit2 size={18} /></button>
                      <button onClick={() => handleCopyVariant(v.id)} className="p-1.5 text-neutral-400 hover:text-emerald-600 transition-colors" title="Duplicate"><Copy size={18} /></button>
                      <button onClick={() => handleDelete(v.id)} className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors" title="Delete"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && editingVariant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-neutral-50">
              <h2 className="text-xl font-bold">{editingVariant.id ? 'Edit Variant' : 'Add Variant'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-neutral-900"><ArrowLeft size={20} className="rotate-180" /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="variant-form" onSubmit={handleSave} className="space-y-6">
                {/* Tabs */}
                <div className="flex gap-6 border-b border-neutral-200 mb-6">
                  {TABS.map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 font-bold text-sm transition-colors border-b-2 ${activeTab === tab ? 'border-rose-600 text-rose-600' : 'border-transparent text-neutral-500 hover:text-neutral-900'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeTab === 'Variant Basics' && (
                  <>
                    <div className="space-y-6">
                      <div className="w-full">
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Images</label>
                        <div className="flex flex-wrap gap-4">
                          {(editingVariant.imageUrls || []).map((url: string, index: number) => (
                            <div key={index} className="w-24 h-24 rounded-xl border border-neutral-200 overflow-hidden relative group flex-shrink-0">
                              <img src={url} alt="" className="w-full h-full object-cover" />
                              <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-white/90 text-rose-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 hover:text-rose-700 shadow-sm border border-neutral-200">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                          <label className="w-24 h-24 flex-shrink-0 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center text-neutral-500 cursor-pointer hover:bg-neutral-50 hover:border-neutral-400 transition-colors relative overflow-hidden">
                            {uploadingImage ? <Loader2 size={24} className="animate-spin" /> : <Plus size={24} />}
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                          </label>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1">Color</label>
                          <input type="text" value={editingVariant.color || ''} onChange={e => setEditingVariant({...editingVariant, color: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" placeholder="e.g. Yellow" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1">Size</label>
                          <input type="text" value={editingVariant.size || ''} onChange={e => setEditingVariant({...editingVariant, size: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" placeholder="e.g. Large" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1">Material</label>
                          <input type="text" value={editingVariant.material || ''} onChange={e => setEditingVariant({...editingVariant, material: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" placeholder="e.g. Cotton" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1">Style</label>
                          <input type="text" value={editingVariant.style || ''} onChange={e => setEditingVariant({...editingVariant, style: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" placeholder="e.g. Heart" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 pt-4 border-t border-neutral-100">
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">SKU</label>
                        <input type="text" value={editingVariant.sku || ''} onChange={e => setEditingVariant({...editingVariant, sku: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Price (₹) - Optional</label>
                        <input type="number" value={editingVariant.price === '' ? '' : editingVariant.price} onChange={e => setEditingVariant({...editingVariant, price: e.target.value === '' ? '' : Number(e.target.value)})} placeholder={`Base price: ₹${product?.basePrice}`} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Sale Price (₹)</label>
                        <input type="number" value={editingVariant.salePrice === '' ? '' : editingVariant.salePrice} onChange={e => setEditingVariant({...editingVariant, salePrice: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Stock Quantity</label>
                        <input type="number" required value={editingVariant.stock || 0} onChange={e => setEditingVariant({...editingVariant, stock: Number(e.target.value)})} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Low Stock Threshold</label>
                        <input type="number" value={editingVariant.lowStockThreshold || 5} onChange={e => setEditingVariant({...editingVariant, lowStockThreshold: Number(e.target.value)})} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Stock Status</label>
                        <select value={editingVariant.stockStatus || 'IN_STOCK'} onChange={e => setEditingVariant({...editingVariant, stockStatus: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500">
                          <option value="IN_STOCK">In Stock</option>
                          <option value="OUT_OF_STOCK">Out of Stock</option>
                          <option value="PRE_ORDER">Pre-Order</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'Product Details' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 mb-2">Variant Name Override</label>
                      <input type="text" value={editingVariant.name || ''} onChange={e => setEditingVariant({...editingVariant, name: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" placeholder="Defaults to main product name if empty" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 mb-2">Short Description</label>
                      <textarea value={editingVariant.shortDesc || ''} onChange={e => setEditingVariant({...editingVariant, shortDesc: e.target.value})} rows={2} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" placeholder="Brief summary..." />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-neutral-700 mb-2">Full Description</label>
                      <textarea value={editingVariant.fullDesc || ''} onChange={e => setEditingVariant({...editingVariant, fullDesc: e.target.value})} rows={4} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" placeholder="Detailed description..." />
                    </div>
                  </div>
                )}

                {activeTab === 'Shipping & Attributes' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Weight (kg)</label>
                        <input type="number" step="0.01" value={editingVariant.weight === '' ? '' : editingVariant.weight} onChange={e => setEditingVariant({...editingVariant, weight: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Length (cm)</label>
                        <input type="number" step="0.1" value={editingVariant.length === '' ? '' : editingVariant.length} onChange={e => setEditingVariant({...editingVariant, length: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Width (cm)</label>
                        <input type="number" step="0.1" value={editingVariant.width === '' ? '' : editingVariant.width} onChange={e => setEditingVariant({...editingVariant, width: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Height (cm)</label>
                        <input type="number" step="0.1" value={editingVariant.height === '' ? '' : editingVariant.height} onChange={e => setEditingVariant({...editingVariant, height: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Shipping Charges (₹)</label>
                        <input type="number" value={editingVariant.shippingCharges === '' ? '' : editingVariant.shippingCharges} onChange={e => setEditingVariant({...editingVariant, shippingCharges: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" />
                      </div>
                      <div className="flex items-center gap-3 pt-6">
                        <input type="checkbox" id="freeShipping" checked={editingVariant.freeShipping || false} onChange={e => setEditingVariant({...editingVariant, freeShipping: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                        <label htmlFor="freeShipping" className="font-bold text-neutral-700">Free Shipping</label>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <input type="checkbox" id="isHandmade" checked={editingVariant.isHandmade ?? true} onChange={e => setEditingVariant({...editingVariant, isHandmade: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500" />
                      <label htmlFor="isHandmade" className="font-bold text-neutral-700">This variant is handmade</label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Care Instructions</label>
                        <input type="text" value={editingVariant.careInstructions || ''} onChange={e => setEditingVariant({...editingVariant, careInstructions: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Country of Origin</label>
                        <input type="text" value={editingVariant.countryOfOrigin || ''} onChange={e => setEditingVariant({...editingVariant, countryOfOrigin: e.target.value})} className="w-full border p-2.5 rounded-lg outline-none focus:border-rose-500" />
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
            <div className="px-6 py-4 border-t bg-neutral-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-neutral-700 hover:bg-neutral-200 transition-colors">Cancel</button>
              <button type="submit" form="variant-form" disabled={saving} className="px-5 py-2.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 flex items-center gap-2 transition-colors">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Variant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
