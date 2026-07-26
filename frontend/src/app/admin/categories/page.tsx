"use client";
import useSWR from 'swr';

import React, { useState, useEffect, useMemo } from 'react';
import { Save, Eye, EyeOff, Edit2, Trash2, ChevronRight, ChevronDown, Loader2, UploadCloud, X } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '../../../lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  parentId: string | null;
  bannerUrl: string | null;
  children?: Category[];
}

export default function AdminCategoriesPage() {
  const fetcher = (url: string) => apiGet<Category[]>(url);
  const { data: rawCategories = [], isLoading: loading, mutate } = useSWR('/categories', fetcher, { revalidateOnFocus: true });

  const categories = React.useMemo(() => {
    const topLevel = rawCategories.filter(c => !c.parentId);
    const childrenMap = new Map<string, Category[]>();
    rawCategories.filter(c => c.parentId).forEach(c => {
      const siblings = childrenMap.get(c.parentId!) || [];
      siblings.push(c);
      childrenMap.set(c.parentId!, siblings);
    });
    return topLevel.map(c => ({ ...c, children: childrenMap.get(c.id) || [] }));
  }, [rawCategories]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editId, setEditId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formParent, setFormParent] = useState('');
  const [formDesc, setFormDesc] = useState('');

  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await apiDelete(`/categories/${id}`);
      mutate();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const compressImageToWebP = (file: File, maxSizeKB: number = 40): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 800;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('No canvas context');
          ctx.drawImage(img, 0, 0, width, height);

          let quality = 0.9;
          const tryCompress = (q: number) => {
            canvas.toBlob((blob) => {
              if (!blob) return reject('Blob failed');
              if (blob.size / 1024 < maxSizeKB || q <= 0.1) {
                resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + '.webp', {
                  type: 'image/webp'
                }));
              } else {
                tryCompress(q - 0.1);
              }
            }, 'image/webp', q);
          };
          tryCompress(quality);
        };
        img.onerror = (e) => reject(e);
      };
      reader.onerror = (e) => reject(e);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingImage(true);
      const compressedFile = await compressImageToWebP(file, 40);
      setImageFile(compressedFile);
      setImagePreview(URL.createObjectURL(compressedFile));
    } catch (err) {
      console.error(err);
      setError('Failed to compress image');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSlug) {
      setError('Name and slug are required.');
      return;
    }
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      let bannerUrl = imagePreview && !imageFile ? imagePreview : undefined;

      // Upload image to backend if a new file is selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('folder', 'categories');
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/upload`, {
          method: 'POST',
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: formData,
        });
        if (!res.ok) throw new Error('Failed to upload image');
        const data = await res.json();
        // The backend returns multiple sizes, but since we already compressed it,
        // we can just use any of them, but let's use 'card' or 'detail' size.
        bannerUrl = data.sizes?.card || data.url;
      }
      
      const payload = {
        name: formName,
        slug: formSlug,
        description: formDesc || undefined,
        parentId: formParent || undefined,
        bannerUrl,
      };

      if (editId) {
        await apiPut(`/categories/${editId}`, payload);
        setSuccess('Category updated!');
      } else {
        await apiPost('/categories', payload);
        setSuccess('Category created!');
      }

      setFormName('');
      setFormSlug('');
      setFormParent('');
      setFormDesc('');
      setEditId(null);
      setImageFile(null);
      setImagePreview('');
      mutate();
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditId(category.id);
    setFormName(category.name);
    setFormSlug(category.slug);
    setFormParent(category.parentId || '');
    setFormDesc(category.description || '');
    setImagePreview(category.bannerUrl || '');
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const cancelEdit = () => {
    setEditId(null);
    setFormName('');
    setFormSlug('');
    setFormParent('');
    setFormDesc('');
    setImagePreview('');
    setImageFile(null);
  };

  // Auto-generate slug
  useEffect(() => {
    if (formName) {
      setFormSlug(formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }, [formName]);

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight">Categories</h1>
        <p className="text-neutral-500 mt-1">Organize your store hierarchy and SEO landing pages.</p>
      </header>

      {error && <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl font-medium text-sm">{error}</div>}
      {success && <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl font-medium text-sm">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Category Tree */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
              <h2 className="font-bold text-neutral-700">Category Hierarchy</h2>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{categories.length} categories</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="animate-spin text-neutral-400" size={28} />
                <span className="ml-3 text-neutral-500 font-medium">Loading categories...</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-16 text-neutral-400">
                <p className="text-lg font-bold">No categories yet</p>
                <p className="text-sm mt-1">Create your first category using the form.</p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    {/* Parent Row */}
                    <div className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${category.isActive ? 'bg-white border-neutral-200' : 'bg-neutral-50 border-neutral-200 opacity-75'}`}>
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleExpand(category.id)} className="w-6 h-6 flex items-center justify-center bg-neutral-100 rounded-md hover:bg-neutral-200 transition-colors text-neutral-600">
                          {(category.children?.length || 0) > 0 ? (expanded.has(category.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>}
                        </button>
                        <div className="font-bold text-neutral-900">{category.name}</div>
                        <span className="text-xs text-neutral-400 font-medium">/{category.slug}</span>
                        {category.bannerUrl && <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">Has Image</span>}
                        {!category.isActive && <span className="bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">Hidden</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(category)} className="p-2 text-neutral-400 hover:text-neutral-900 bg-white hover:bg-neutral-100 rounded-lg transition-colors border border-transparent hover:border-neutral-200"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(category.id)} className="p-2 text-neutral-400 hover:text-rose-600 bg-white hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>

                    {/* Children */}
                    {expanded.has(category.id) && (category.children?.length || 0) > 0 && (
                      <div className="pl-12 space-y-2">
                        {category.children!.map(child => (
                          <div key={child.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${child.isActive ? 'bg-white border-neutral-200' : 'bg-neutral-50 border-neutral-200 opacity-75'}`}>
                            <div className="flex items-center gap-3">
                              <div className="font-medium text-sm text-neutral-700">{child.name}</div>
                              <span className="text-xs text-neutral-400 font-medium">/{child.slug}</span>
                              {child.bannerUrl && <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">Has Image</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleEdit(child)} className="p-1.5 text-neutral-400 hover:text-neutral-900 bg-white hover:bg-neutral-100 rounded-lg transition-colors"><Edit2 size={14} /></button>
                              <button onClick={() => handleDelete(child.id)} className="p-1.5 text-neutral-400 hover:text-rose-600 bg-white hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Category Form */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-200 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">{editId ? 'Edit Category' : 'Add New Category'}</h2>
              {editId && <button onClick={cancelEdit} className="text-sm font-bold text-neutral-500 hover:text-neutral-900">Cancel</button>}
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Category Name <span className="text-rose-500">*</span></label>
                <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Blankets" className="w-full border border-neutral-200 rounded-xl p-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all" required />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">URL Slug <span className="text-rose-500">*</span></label>
                <input value={formSlug} onChange={(e) => setFormSlug(e.target.value)} placeholder="e.g. blankets" className="w-full border border-neutral-200 rounded-xl p-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all" required />
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Parent Category</label>
                <select value={formParent} onChange={(e) => setFormParent(e.target.value)} className="w-full border border-neutral-200 rounded-xl p-3 focus:border-rose-500 outline-none bg-white">
                  <option value="">None (Top Level)</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Description</label>
                <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={3} placeholder="Describe this category..." className="w-full border border-neutral-200 rounded-xl p-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all resize-none"></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Category Image</label>
                {imagePreview ? (
                  <div className="relative inline-block border border-neutral-200 rounded-xl p-2 bg-neutral-50 group">
                    <img src={imagePreview} alt="Category" className="w-24 h-24 object-cover rounded-lg" />
                    <button 
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                    >
                      <X size={14} />
                    </button>
                    {imageFile && <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{(imageFile.size / 1024).toFixed(1)} KB</div>}
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-neutral-200 rounded-xl p-6 flex flex-col items-center justify-center text-neutral-500 cursor-pointer hover:border-rose-300 hover:bg-rose-50 transition-colors">
                    {uploadingImage ? <Loader2 className="animate-spin mb-2" size={24} /> : <UploadCloud className="mb-2" size={24} />}
                    <span className="text-sm font-medium">{uploadingImage ? 'Compressing...' : 'Upload Image'}</span>
                    <span className="text-xs text-neutral-400 mt-1">WebP, &lt; 40KB output</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={uploadingImage} />
                  </label>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-neutral-900 text-white px-4 py-3.5 rounded-xl font-bold hover:bg-neutral-800 flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {saving ? (editId ? 'Updating...' : 'Creating...') : (editId ? 'Update Category' : 'Create Category')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
