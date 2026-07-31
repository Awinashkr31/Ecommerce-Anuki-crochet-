"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';
import { Image as ImageIcon, Layout, Type, Globe, Plus, Edit2, GripVertical, CalendarClock, Trash2, Link as LinkIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export default function AdminCMSPage() {
  const [activeTab, setActiveTab] = useState<'BANNERS' | 'PAGES' | 'INSTAGRAM'>('BANNERS');
  const { profile } = useAuthStore();

  const fetcher = (url: string) => apiGet(url);
  const { data: banners, mutate: mutateBanners } = useSWR<any[]>('/banners', fetcher);
  const { data: posts, mutate: mutatePosts } = useSWR<any[]>('/posts/admin/all', fetcher);
  const { data: settings, mutate: mutateSettings } = useSWR<Record<string, string>>('/settings', fetcher);

  // Modals state
  const [isBannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [bannerForm, setBannerForm] = useState({ title: '', imageUrl: '', link: '', status: 'DRAFT', startDate: '', endDate: '' });

  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [postForm, setPostForm] = useState({ title: '', slug: '', content: '', published: false });

  // Instagram state
  const [instaHandle, setInstaHandle] = useState(settings?.['instagram_handle'] || '@anuki_crochet');
  const [instaReel1, setInstaReel1] = useState(settings?.['instagram_reel_1'] || '');
  const [instaReel2, setInstaReel2] = useState(settings?.['instagram_reel_2'] || '');
  const [instaReel3, setInstaReel3] = useState(settings?.['instagram_reel_3'] || '');
  const [instaReel4, setInstaReel4] = useState(settings?.['instagram_reel_4'] || '');

  // --- Handlers ---
  const handleSaveBanner = async () => {
    try {
      if (editingBanner) {
        await apiPut(`/banners/${editingBanner.id}`, bannerForm);
        toast.success("Banner updated");
      } else {
        await apiPost('/banners', bannerForm);
        toast.success("Banner created");
      }
      setBannerModalOpen(false);
      mutateBanners();
    } catch (e) {
      toast.error("Failed to save banner");
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await apiDelete(`/banners/${id}`);
      toast.success("Banner deleted");
      mutateBanners();
    } catch (e) {
      toast.error("Failed to delete banner");
    }
  };

  const handleSavePost = async () => {
    try {
      const payload = { ...postForm, authorId: profile?.id };
      if (editingPost) {
        await apiPut(`/posts/${editingPost.id}`, payload);
        toast.success("Page updated");
      } else {
        await apiPost('/posts', payload);
        toast.success("Page created");
      }
      setPostModalOpen(false);
      mutatePosts();
    } catch (e) {
      toast.error("Failed to save page");
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await apiDelete(`/posts/${id}`);
      toast.success("Page deleted");
      mutatePosts();
    } catch (e) {
      toast.error("Failed to delete page");
    }
  };

  const handleSaveInstagram = async () => {
    try {
      await apiPut('/settings', {
        instagram_handle: instaHandle,
        instagram_reel_1: instaReel1,
        instagram_reel_2: instaReel2,
        instagram_reel_3: instaReel3,
        instagram_reel_4: instaReel4
      });
      toast.success("Instagram settings saved");
      mutateSettings();
    } catch (e) {
      toast.error("Failed to save Instagram settings");
    }
  };

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
            <button 
              onClick={() => { setEditingBanner(null); setBannerForm({ title: '', imageUrl: '', link: '', status: 'DRAFT', startDate: '', endDate: '' }); setBannerModalOpen(true); }}
              className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus size={18} /> Add New Banner
            </button>
          </div>

          <div className="space-y-4">
            {banners?.map((banner: any) => (
              <div key={banner.id} className="bg-white rounded-3xl shadow-sm border border-neutral-200 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center group">
                <div className="cursor-grab text-neutral-300 hover:text-neutral-500 transition-colors hidden md:block">
                  <GripVertical size={24} />
                </div>
                
                <div className="w-full md:w-64 h-32 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center text-neutral-400 relative overflow-hidden flex-shrink-0">
                  {banner.imageUrl ? (
                    <img src={banner.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon size={24} className="mb-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">No Image</span>
                    </>
                  )}
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <h3 className="font-black text-lg text-neutral-900 mb-1">{banner.title}</h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${banner.status === 'LIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                        {banner.status}
                      </span>
                      {banner.link && (
                        <span className="text-sm font-medium text-neutral-500 flex items-center gap-1.5"><LinkIcon size={14}/> {banner.link}</span>
                      )}
                    </div>
                  </div>
                  
                  {(banner.startDate || banner.endDate) && (
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 flex items-start md:items-center gap-3">
                      <CalendarClock size={16} className="text-neutral-400 mt-0.5 md:mt-0 shrink-0" />
                      <div className="text-sm font-medium text-neutral-600">
                        Scheduled: <span className="font-bold text-neutral-900">{banner.startDate ? new Date(banner.startDate).toLocaleDateString() : 'Now'}</span> to <span className="font-bold text-neutral-900">{banner.endDate ? new Date(banner.endDate).toLocaleDateString() : 'Forever'}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <button 
                    onClick={() => { 
                      setEditingBanner(banner); 
                      setBannerForm({ 
                        title: banner.title, 
                        imageUrl: banner.imageUrl, 
                        link: banner.link || '', 
                        status: banner.status, 
                        startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : '', 
                        endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : '' 
                      }); 
                      setBannerModalOpen(true); 
                    }}
                    className="flex-1 md:flex-none px-4 py-2 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors flex justify-center items-center gap-2"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="flex-1 md:flex-none px-4 py-2 border border-neutral-200 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-50 transition-colors flex justify-center items-center gap-2"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            ))}
            {banners?.length === 0 && <p className="text-neutral-500 text-center py-8">No banners found.</p>}
          </div>
        </div>
      )}

      {/* Pages Tab */}
      {activeTab === 'PAGES' && (
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
            <h2 className="font-black text-lg text-neutral-900">Static Pages & Content</h2>
            <button 
              onClick={() => { setEditingPost(null); setPostForm({ title: '', slug: '', content: '', published: false }); setPostModalOpen(true); }}
              className="bg-neutral-900 text-white px-4 py-2 rounded-xl font-bold hover:bg-neutral-800 transition-colors text-sm shadow-sm"
            >
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
              {posts?.map((post: any) => (
                <tr key={post.id} className="hover:bg-neutral-50/80 transition-colors group">
                  <td className="px-6 py-5 font-bold text-neutral-900">{post.title}</td>
                  <td className="px-6 py-5 font-mono text-sm text-neutral-500">{post.slug}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${post.published ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right space-x-4">
                    <button 
                      onClick={() => { setEditingPost(post); setPostForm({ title: post.title, slug: post.slug, content: post.content, published: post.published }); setPostModalOpen(true); }}
                      className="text-neutral-600 font-bold hover:underline text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="text-rose-600 font-bold hover:underline text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Delete
                    </button>
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
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Instagram Handle</label>
              <input 
                type="text" 
                value={instaHandle}
                onChange={(e) => setInstaHandle(e.target.value)}
                placeholder="@anuki_crochet" 
                className="w-full border border-neutral-300 rounded-lg p-3 focus:ring-2 focus:ring-rose-500 outline-none font-medium text-sm" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-3">Manual Reel Embeds (Optional)</label>
              <p className="text-xs text-neutral-500 mb-4">Paste the full URL of the Instagram Reels/Posts you want to display on the homepage.</p>
              <div className="space-y-3">
                {[
                  { label: 'Reel 1 URL', value: instaReel1, setter: setInstaReel1 },
                  { label: 'Reel 2 URL', value: instaReel2, setter: setInstaReel2 },
                  { label: 'Reel 3 URL', value: instaReel3, setter: setInstaReel3 },
                  { label: 'Reel 4 URL', value: instaReel4, setter: setInstaReel4 },
                ].map((reel, idx) => (
                  <input 
                    key={idx}
                    type="text" 
                    value={reel.value}
                    onChange={(e) => reel.setter(e.target.value)}
                    placeholder={`Reel ${idx + 1} URL (e.g., https://www.instagram.com/reel/...)`} 
                    className="w-full border border-neutral-300 rounded-lg p-3 focus:ring-2 focus:ring-rose-500 outline-none font-medium text-sm" 
                  />
                ))}
              </div>
            </div>

            <button onClick={handleSaveInstagram} className="w-full bg-neutral-900 text-white px-6 py-3.5 rounded-xl font-black hover:bg-neutral-800 transition-colors shadow-md">
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-black">{editingBanner ? 'Edit Banner' : 'New Banner'}</h2>
              <button onClick={() => setBannerModalOpen(false)} className="text-neutral-400 hover:text-neutral-900"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">Title</label>
                <input type="text" value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">Image URL</label>
                <input type="text" value={bannerForm.imageUrl} onChange={e => setBannerForm({...bannerForm, imageUrl: e.target.value})} className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">Link (Optional)</label>
                <input type="text" value={bannerForm.link} onChange={e => setBannerForm({...bannerForm, link: e.target.value})} className="w-full border rounded-lg p-3" />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">Status</label>
                <select value={bannerForm.status} onChange={e => setBannerForm({...bannerForm, status: e.target.value})} className="w-full border rounded-lg p-3">
                  <option value="DRAFT">Draft</option>
                  <option value="LIVE">Live</option>
                  <option value="SCHEDULED">Scheduled</option>
                </select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-neutral-700 mb-1">Start Date</label>
                  <input type="date" value={bannerForm.startDate} onChange={e => setBannerForm({...bannerForm, startDate: e.target.value})} className="w-full border rounded-lg p-3" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-neutral-700 mb-1">End Date</label>
                  <input type="date" value={bannerForm.endDate} onChange={e => setBannerForm({...bannerForm, endDate: e.target.value})} className="w-full border rounded-lg p-3" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50">
              <button onClick={() => setBannerModalOpen(false)} className="px-5 py-2.5 font-bold text-neutral-600 hover:text-neutral-900">Cancel</button>
              <button onClick={handleSaveBanner} className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-neutral-800">Save Banner</button>
            </div>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-xl font-black">{editingPost ? 'Edit Page' : 'New Page'}</h2>
              <button onClick={() => setPostModalOpen(false)} className="text-neutral-400 hover:text-neutral-900"><X size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-neutral-700 mb-1">Title</label>
                  <input type="text" value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} className="w-full border rounded-lg p-3" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-neutral-700 mb-1">Slug</label>
                  <input type="text" value={postForm.slug} onChange={e => setPostForm({...postForm, slug: e.target.value})} className="w-full border rounded-lg p-3" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-1">Content (Markdown)</label>
                <textarea rows={10} value={postForm.content} onChange={e => setPostForm({...postForm, content: e.target.value})} className="w-full border rounded-lg p-3 font-mono text-sm" />
              </div>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={postForm.published} onChange={e => setPostForm({...postForm, published: e.target.checked})} className="w-5 h-5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" />
                <span className="font-bold text-neutral-900">Publish this page immediately</span>
              </label>
            </div>
            <div className="p-6 border-t border-neutral-100 flex justify-end gap-3 bg-neutral-50">
              <button onClick={() => setPostModalOpen(false)} className="px-5 py-2.5 font-bold text-neutral-600 hover:text-neutral-900">Cancel</button>
              <button onClick={handleSavePost} className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-neutral-800">Save Page</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
