"use client";
import useSWR from 'swr';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, Edit2, Trash2 } from 'lucide-react';
import { apiGet, apiDelete } from '../../../lib/api';

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  author: { name: string };
}

export default function AdminBlogPage() {
  const fetcher = (url: string) => apiGet<Post[]>(url);
  const { data: posts = [], isLoading: loading, mutate } = useSWR('/posts', fetcher, { revalidateOnFocus: true });

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      await apiDelete(`/posts/${id}`);
      mutate();
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Blog</h1>
          <p className="text-neutral-500 mt-1">Manage your blog posts. <span className="font-bold text-neutral-700">{posts.length} posts</span></p>
        </div>
        <Link href="/admin/blog/new" className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-neutral-800 transition-colors shadow-sm whitespace-nowrap">
          + New Post
        </Link>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
            <span className="ml-3 text-neutral-500 font-medium">Loading posts...</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <p className="text-lg font-bold">No blog posts yet</p>
            <p className="text-sm mt-1"><Link href="/admin/blog/new" className="text-rose-600 hover:underline">Write your first post</Link></p>
          </div>
        ) : (
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Title</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Author</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Date</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500">Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-neutral-50/80 transition-colors group">
                  <td className="px-6 py-4 font-bold text-sm">{post.title}</td>
                  <td className="px-6 py-4 text-sm text-neutral-600">{post.author?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm text-neutral-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${post.published ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-700'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-neutral-400 hover:text-neutral-900 transition-colors p-1"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(post.id)} className="text-neutral-400 hover:text-rose-600 transition-colors p-1"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
