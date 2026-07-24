"use client";

import { useState } from 'react';
import { Image as ImageIcon, Layout, Type, Globe, Plus, Edit2, GripVertical, CalendarClock, Save, Trash2, Link as LinkIcon } from 'lucide-react';

export default function AdminCMSPage() {
  const [activeTab, setActiveTab] = useState<'BANNERS' | 'PAGES' | 'INSTAGRAM'>('BANNERS');

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Content Management</h1>
          <p className="text-neutral-500 mt-1">Control your storefront's homepage, pages, and integrations.</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 bg-white p-2 rounded-2xl border border-neutral-200 w-max max-w-full shadow-sm">
        <button 
          onClick={() => setActiveTab('BANNERS')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'BANNERS' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
        >
          <Layout size={18} /> Homepage Banners
        </button>
        <button 
          onClick={() => setActiveTab('PAGES')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'PAGES' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
        >
          <Type size={18} /> Pages & Blog
        </button>
        <button 
          onClick={() => setActiveTab('INSTAGRAM')}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'INSTAGRAM' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'}`}
        >
          <Globe size={18} /> Social Feed
        </button>
      </div>

      {/* Banners Tab */}
      {activeTab === 'BANNERS' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2">
              <Plus size={18} /> Add New Banner
            </button>
          </div>

          <div className="space-y-4">
            
            {/* Banner Item 1 */}
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center group">
              <div className="cursor-grab text-neutral-300 hover:text-neutral-500 transition-colors hidden md:block">
                <GripVertical size={24} />
              </div>
              
              <div className="w-full md:w-64 h-32 bg-rose-50 border-2 border-dashed border-rose-200 rounded-2xl flex flex-col items-center justify-center text-rose-500 relative overflow-hidden flex-shrink-0">
                <ImageIcon size={24} className="mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider">Diwali Promo.jpg</span>
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <h3 className="font-black text-lg text-neutral-900 mb-1">Diwali Festive Sale Hero</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border border-emerald-100">Currently Live</span>
                    <span className="text-sm font-medium text-neutral-500 flex items-center gap-1.5"><LinkIcon size={14}/> /categories/diwali-special</span>
                  </div>
                </div>
                
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 flex items-start md:items-center gap-3">
                  <CalendarClock size={16} className="text-neutral-400 mt-0.5 md:mt-0 shrink-0" />
                  <div className="text-sm font-medium text-neutral-600">
                    Scheduled: <span className="font-bold text-neutral-900">Oct 10, 2026</span> to <span className="font-bold text-neutral-900">Nov 15, 2026</span>
                  </div>
                </div>
              </div>
              
              <div className="flex md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
                <button className="flex-1 md:flex-none px-4 py-2 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors flex justify-center items-center gap-2">
                  <Edit2 size={16} /> Edit
                </button>
                <button className="flex-1 md:flex-none px-4 py-2 border border-neutral-200 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-50 transition-colors flex justify-center items-center gap-2">
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>

            {/* Banner Item 2 */}
            <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center group">
              <div className="cursor-grab text-neutral-300 hover:text-neutral-500 transition-colors hidden md:block">
                <GripVertical size={24} />
              </div>
              
              <div className="w-full md:w-64 h-32 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center text-neutral-400 relative overflow-hidden flex-shrink-0">
                <ImageIcon size={24} className="mb-2" />
                <span className="text-xs font-bold uppercase tracking-wider">Winter Cozy.jpg</span>
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <h3 className="font-black text-lg text-neutral-900 mb-1">Winter Collection Launch</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border border-amber-100">Scheduled</span>
                    <span className="text-sm font-medium text-neutral-500 flex items-center gap-1.5"><LinkIcon size={14}/> /collections/winter</span>
                  </div>
                </div>
                
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 flex items-start md:items-center gap-3">
                  <CalendarClock size={16} className="text-neutral-400 mt-0.5 md:mt-0 shrink-0" />
                  <div className="text-sm font-medium text-neutral-600">
                    Scheduled: <span className="font-bold text-neutral-900">Dec 01, 2026</span> to <span className="font-bold text-neutral-900">Jan 31, 2027</span>
                  </div>
                </div>
              </div>
              
              <div className="flex md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
                <button className="flex-1 md:flex-none px-4 py-2 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors flex justify-center items-center gap-2">
                  <Edit2 size={16} /> Edit
                </button>
                <button className="flex-1 md:flex-none px-4 py-2 border border-neutral-200 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-50 transition-colors flex justify-center items-center gap-2">
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Pages Tab */}
      {activeTab === 'PAGES' && (
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
            <h2 className="font-black text-lg text-neutral-900">Static Pages & Content</h2>
            <button className="bg-neutral-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-neutral-800 transition-colors text-sm shadow-sm">
              + New Page
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-white border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Page Title</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Slug</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-center">Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {[
                { title: 'About Us', slug: '/about', status: 'Published' },
                { title: 'Shipping & Returns Policy', slug: '/policies', status: 'Published' },
                { title: 'Care Guide for Amigurumi', slug: '/blog/care-guide', status: 'Published' },
                { title: 'Holiday Gift Guide 2026', slug: '/blog/holiday-gifts', status: 'Draft' },
              ].map((page, i) => (
                <tr key={i} className="hover:bg-neutral-50/80 transition-colors group">
                  <td className="px-6 py-5 font-bold text-neutral-900">{page.title}</td>
                  <td className="px-6 py-5 font-mono text-sm text-neutral-500">{page.slug}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${page.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}>
                      {page.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-rose-600 font-bold hover:underline text-sm opacity-0 group-hover:opacity-100 transition-opacity">Edit Content</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Instagram Tab */}
      {activeTab === 'INSTAGRAM' && (
        <div className="max-w-2xl bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="p-8 text-center border-b border-neutral-100">
            <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-pink-100 shadow-sm">
              <Globe size={32} />
            </div>
            <h2 className="text-2xl font-black text-neutral-900 mb-2">Instagram Feed Sync</h2>
            <p className="text-sm font-medium text-neutral-500 max-w-md mx-auto">Connect your Instagram account to automatically display your latest posts or specific hashtags in the storefront footer.</p>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between p-5 border border-emerald-200 bg-emerald-50 rounded-2xl">
              <div>
                <p className="font-black text-emerald-900">Connected Account</p>
                <p className="text-sm font-medium text-emerald-700 mt-1">@crochet_magic_store</p>
              </div>
              <button className="px-4 py-2 bg-white text-emerald-700 rounded-lg font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors text-sm">
                Disconnect
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-3">Feed Source Configuration</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors shadow-sm bg-white">
                  <input type="radio" name="source" value="RECENT" defaultChecked className="text-rose-600 focus:ring-rose-500 w-4 h-4" />
                  <span className="font-bold">Show most recent posts</span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors shadow-sm bg-white">
                  <input type="radio" name="source" value="HASHTAG" className="text-rose-600 focus:ring-rose-500 w-4 h-4" />
                  <div className="flex-1">
                    <span className="font-bold block mb-2">Filter by specific hashtag</span>
                    <input type="text" placeholder="#crochetmagic" className="w-full border border-neutral-300 rounded-lg p-2 focus:ring-2 focus:ring-rose-500 outline-none font-medium text-sm" />
                  </div>
                </label>
              </div>
            </div>

            <button className="w-full bg-neutral-900 text-white px-6 py-3.5 rounded-xl font-black hover:bg-neutral-800 transition-colors shadow-md">
              Save Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
