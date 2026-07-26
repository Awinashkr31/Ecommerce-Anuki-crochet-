"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MoreHorizontal, Edit2, Check, X, Trash2, Loader2 } from 'lucide-react';
import { apiGet, apiPut, apiDelete } from '../../../lib/api';

interface Product {
  id: string;
  name: string;
  slug: string;
  shortDesc: string | null;
  basePrice: number;
  salePrice: number | null;
  published: boolean;
  featured: boolean;
  trending: boolean;
  bestseller: boolean;
  limitedEdition: boolean;
  isMadeToOrder: boolean;
  category: { id: string; name: string } | null;
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

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.variants.some(v => v.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const totalStock = (p: Product) => {
    if (p.isMadeToOrder) return 'Made to Order';
    const total = p.variants.reduce((sum, v) => sum + v.stock, 0);
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
      <div className="bg-white rounded-b-2xl shadow-sm border border-neutral-200 overflow-x-auto">
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
                  <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors group">
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
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        stock === 'Made to Order' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                        (typeof stock === 'number' && stock < 5) ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-neutral-100 text-neutral-700 border border-neutral-200'
                      }`}>
                        {typeof stock === 'number' ? `${stock} in stock` : stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        product.published ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
                      }`}>
                        {product.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {quickEditId === product.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={saveQuickEdit} className="p-1.5 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"><Check size={16} /></button>
                          <button onClick={() => setQuickEditId(null)} className="p-1.5 bg-neutral-100 text-neutral-700 rounded hover:bg-neutral-200"><X size={16} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleQuickEdit(product)} className="text-neutral-400 hover:text-neutral-900 transition-colors p-1" title="Quick Edit Price"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(product.id)} disabled={deleting === product.id} className="text-neutral-400 hover:text-rose-600 transition-colors p-1" title="Delete">
                            {deleting === product.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                          <Link href={`/admin/products/${product.id}`} className="text-neutral-400 hover:text-rose-600 transition-colors p-1" title="Full Edit"><MoreHorizontal size={18} /></Link>
                        </div>
                      )}
                    </td>
                  </tr>
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
