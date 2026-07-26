"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Save, Eye, EyeOff, Edit2, Trash2, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import { apiGet, apiPost, apiPut, apiDelete } from '../../../lib/api';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  parentId: string | null;
  children?: Category[];
}

export default function AdminCategoriesPage() {
  import useSWR from 'swr';
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
      
      const payload = {
        name: formName,
        slug: formSlug,
        description: formDesc || undefined,
        parentId: formParent || undefined,
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const cancelEdit = () => {
    setEditId(null);
    setFormName('');
    setFormSlug('');
    setFormParent('');
    setFormDesc('');
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
