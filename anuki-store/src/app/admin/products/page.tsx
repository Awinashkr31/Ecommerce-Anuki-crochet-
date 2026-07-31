"use client";

import React, { useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { Search, MoreHorizontal, Edit2, Check, X, Trash2, Loader2, Copy, ListTree, ChevronDown, ChevronUp } from 'lucide-react';
import { apiGet, apiPut, apiDelete, apiPost } from '../../../lib/api';

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDesc: string | null;
  basePrice: number;
  salePrice: number | null;
  status: string;
  featured: boolean;
  trending: boolean;
  bestseller: boolean;
  limitedEdition: boolean;
  isMadeToOrder: boolean;
  category: { id: string; name: string } | null;
  stock: number;
  variants: { id: string; sku: string; stock: number; price: number; size: string | null; color: string | null }[];
  images: { id: string; url: string; altText: string | null }[];
}

import useSWR from 'swr';
const fetcher = (url: string) => apiGet<Product[]>(url);

export default function AdminProductsPage() {
  const { data: products = [], isLoading: loading, mutate } = useSWR('/products', fetcher, { revalidateOnFocus: true });
  const [search, setSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [quickEditPrice, setQuickEditPrice] = useState<number>(0);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [expandedProducts, setExpandedProducts] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedProducts(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if ((e.target as Element).closest('.dropdown-container')) return;
      setOpenMenuId(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedProducts(filtered.map(p => p.id));
    else setSelectedProducts([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleQuickEdit = (product: Product) => {
    setQuickEditId(product.id);
    setQuickEditPrice(product.basePrice);
  };

  const saveQuickEdit = async () => {
    if (!quickEditId) return;
    try {
      await apiPut(`/products/${quickEditId}`, { basePrice: quickEditPrice });
      mutate();
      setQuickEditId(null);
    } catch (err) {
      console.error('Failed to update price:', err);
    }
  };

    const handleDeleteVariant = async (productId: string, variantId: string) => {
    if (!confirm('Are you sure you want to delete this variant?')) return;
    try {
      await apiDelete(`/products/${productId}/variants/${variantId}`);
      mutate();
    } catch (err) {
      console.error('Failed to delete variant:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      setDeleting(id);
      await apiDelete(`/products/${id}`);
      mutate();
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handleCopyProduct = async (id: string) => {
    try {
      await apiPost(`/products/${id}/copy`, {});
      mutate();
      alert('Product copied successfully!');
    } catch (err) {
      console.error('Failed to copy product:', err);
      alert('Failed to copy product');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.variants.some(v => v.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const totalStock = (p: Product) => {
    if (p.isMadeToOrder) return 'Made to Order';
    if (!p.variants || p.variants.length === 0) return p.stock;
    const total = p.variants.reduce((sum, v) => sum + v.stock, 0) + p.stock;
    return total;
  };

  const getFlags = (p: Product) => {
    const flags: string[] = [];
    if (p.bestseller) flags.push('Bestseller');
    if (p.trending) flags.push('Trending');
    if (p.featured) flags.push('Featured');
    if (p.limitedEdition) flags.push('Limited');
    const stock = totalStock(p);
    if (typeof stock === 'number' && stock < 5 && stock > 0) flags.push('Low Stock');
    if (typeof stock === 'number' && stock === 0 && !p.isMadeToOrder) flags.push('Out of Stock');
    return flags;
  };

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Products</h1>
          <p className="text-neutral-500 mt-1">Manage your inventory, pricing, and listings. <span className="font-bold text-neutral-700">{products.length} products</span></p>
        </div>
        <Link href="/admin/products/new" className="bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-sm shadow-rose-200 whitespace-nowrap">
          + Add Product
        </Link>
      </header>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-t-2xl border-x border-t border-neutral-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex-1 flex gap-4 w-full">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-shadow"
            />
          </div>
        </div>
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-bold text-neutral-500 px-2">{selectedProducts.length} selected</span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-2xl shadow-sm border border-neutral-200 overflow-x-auto pb-48">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
            <span className="ml-3 text-neutral-500 font-medium">Loading products...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <p className="text-lg font-bold">No products found</p>
            <p className="text-sm mt-1">Try adjusting your search or <Link href="/admin/products/new" className="text-rose-600 hover:underline">add a new product</Link>.</p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    className="rounded border-neutral-300 text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                    checked={selectedProducts.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Product</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Category</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Price</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Inventory</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map(product => {
                const stock = totalStock(product);
                const flags = getFlags(product);
                const mainImage = product.images?.[0];
                return (
                  <Fragment key={product.id}>
                    <tr className="hover:bg-neutral-50/50 transition-colors group relative">

                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-neutral-300 text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-100 rounded-lg flex-shrink-0 overflow-hidden">
                          {mainImage && <img src={mainImage.url} alt={mainImage.altText || product.name} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <div className="font-bold flex items-center gap-2 flex-wrap">
                            {product.name}
                            {flags.map(f => (
                              <span key={f} className={`text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded ${
                                f === 'Out of Stock' ? 'bg-rose-100 text-rose-700' :
                                f === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                                'bg-rose-100 text-rose-700'
                              }`}>{f}</span>
                            ))}
                          </div>
                          <div className="text-xs text-neutral-500 mt-0.5 font-medium">{product.variants[0]?.sku || product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-sm text-neutral-600">{product.category?.name || '—'}</td>
                    <td className="px-6 py-4">
                      {quickEditId === product.id ? (
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold">₹</span>
                          <input
                            type="number"
                            value={quickEditPrice}
                            onChange={(e) => setQuickEditPrice(Number(e.target.value))}
                            className="w-20 border border-neutral-300 rounded p-1 text-sm font-bold outline-none focus:border-rose-500"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div>
                          <span className="font-bold text-sm">₹{product.basePrice.toLocaleString()}</span>
                          {product.salePrice && (
                            <span className="ml-2 text-xs text-emerald-600 font-bold">₹{product.salePrice.toLocaleString()}</span>
                          )}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        Number(stock) > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {stock} in stock
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        product.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 
                        product.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                        'bg-neutral-200 text-neutral-700'
                      }`}>
                        {product.status === 'PUBLISHED' ? 'Published' : 
                         product.status === 'SCHEDULED' ? 'Scheduled' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {product.variants && product.variants.length > 0 && (
                          <button 
                            onClick={() => toggleExpand(product.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors"
                          >
                            {product.variants.length + 1} Variants
                            {expandedProducts.includes(product.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        )}
                        <div className="relative inline-block text-left z-10 dropdown-container">
                          <button 
                            onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                            className="text-neutral-400 hover:text-neutral-900 transition-colors p-1"
                          >
                            <MoreHorizontal size={20} />
                          </button>
                          {openMenuId === product.id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                              <div className="py-1" role="menu">
                                <Link href={`/admin/products/edit/${product.id}`} className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 font-medium">
                                  <Edit2 size={16} className="mr-3 text-neutral-400" /> Edit Product
                                </Link>
                                <button onClick={() => handleCopyProduct(product.id)} className="w-full text-left flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 font-medium">
                                  <Copy size={16} className="mr-3 text-neutral-400" /> Copy Product
                                </button>
                                <Link href={`/admin/products/${product.id}/variants`} className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 font-medium border-b border-neutral-100">
                                  <ListTree size={16} className="mr-3 text-neutral-400" /> Manage Variants
                                </Link>
                                <button onClick={() => { handleDelete(product.id); setOpenMenuId(null); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium">
                                  <Trash2 size={16} className="mr-3 text-rose-400" /> Delete Product
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                    {expandedProducts.includes(product.id) && product.variants && product.variants.length > 0 && (
                      <tr className="bg-neutral-50/30 hover:bg-neutral-50 transition-colors border-t border-dashed border-neutral-100 group">
                        <td className="px-6 py-3"></td>
                        <td className="px-6 py-3 pl-12">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-neutral-100 rounded flex-shrink-0 overflow-hidden relative">
                              <div className="absolute -left-6 top-1/2 w-4 h-4 border-l-2 border-b-2 border-neutral-300 rounded-bl -translate-y-1/2"></div>
                              {mainImage ? (
                                <img src={mainImage.url} className="w-full h-full object-cover relative z-10 rounded" alt="" />
                              ) : (
                                <div className="w-full h-full bg-neutral-200 relative z-10 rounded"></div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-neutral-700">
                                Base Product
                              </div>
                              <div className="text-xs text-neutral-500 font-medium">{product.slug} • {product.stock} in stock</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-neutral-400">Main</td>
                        <td className="px-6 py-3">
                          <span className="font-bold text-sm text-neutral-700">₹{product.basePrice.toLocaleString()}</span>
                          {product.salePrice && <span className="ml-2 text-xs text-emerald-600 font-bold">₹{product.salePrice.toLocaleString()}</span>}
                        </td>
                        <td className="px-6 py-3 text-sm text-neutral-500">
                          {product.stock}
                        </td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/admin/products/edit/${product.id}`} className="p-1.5 text-neutral-400 hover:text-blue-600 transition-colors" title="Edit Main Product">
                              <Edit2 size={16} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )}
                    {expandedProducts.includes(product.id) && product.variants?.map((v: any) => (
                      <tr key={v.id} className="bg-neutral-50/30 hover:bg-neutral-50 transition-colors border-t border-dashed border-neutral-100 group">
                        <td className="px-6 py-3"></td>
                        <td className="px-6 py-3 pl-12">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-neutral-100 rounded flex-shrink-0 overflow-hidden relative">
                              <div className="absolute -left-6 top-1/2 w-4 h-4 border-l-2 border-b-2 border-neutral-300 rounded-bl -translate-y-1/2"></div>
                              {v.imageUrls && v.imageUrls.length > 0 ? (
                                <img src={v.imageUrls[0]} className="w-full h-full object-cover relative z-10 rounded" alt="" />
                              ) : v.imageUrl ? (
                                <img src={v.imageUrl} className="w-full h-full object-cover relative z-10 rounded" alt="" />
                              ) : (
                                <div className="w-full h-full bg-neutral-200 relative z-10 rounded"></div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-neutral-700">
                                {[v.color, v.size, v.material, v.style].filter(Boolean).join(' • ') || 'Standard Variant'}
                              </div>
                              <div className="text-xs text-neutral-500 font-medium">{v.sku || 'No SKU'} • {v.stock} in stock</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-sm text-neutral-400">Variant</td>
                        <td className="px-6 py-3">
                          <span className="font-bold text-sm text-neutral-700">₹{v.price.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-3 text-sm text-neutral-500">
                          {v.stock}
                        </td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${v.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            {v.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/admin/products/${product.id}/variants`} className="p-1.5 text-neutral-400 hover:text-blue-600 transition-colors" title="Edit Variant">
                              <Edit2 size={16} />
                            </Link>
                            <button onClick={() => handleDeleteVariant(product.id, v.id)} className="p-1.5 text-neutral-400 hover:text-rose-600 transition-colors" title="Delete Variant">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Count */}
      <div className="mt-4 flex items-center justify-between text-sm font-medium text-neutral-500">
        <p>Showing {filtered.length} of {products.length} products</p>
      </div>
    </>
  );
}
