"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { Star, Search, CheckCircle, XCircle, MessageSquareReply, Flag, Loader2 } from 'lucide-react';
import { apiGet, apiPut, apiDelete } from '@/lib/api';
import { toast } from 'sonner';

export default function AdminReviewsPage() {
  const { data: reviews = [], mutate, isLoading } = useSWR('/api/reviews/admin', apiGet);
  const [replyModal, setReplyModal] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState("PENDING");

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    try {
      await apiPut(`/api/reviews/${id}/status`, { action });
      toast.success(`Review ${action.toLowerCase()}d successfully`);
      mutate();
    } catch (error) {
      toast.error('Failed to update review status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await apiDelete(`/api/reviews/${id}`);
      toast.success('Review deleted');
      mutate();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleReplySubmit = () => {
    toast.success('Reply submitted');
    setReplyModal(null);
    setReplyText("");
  };

  const filteredReviews = reviews.filter((r: any) => {
    if (filter === "PENDING") return r.approved === false;
    if (filter === "APPROVED") return r.approved === true;
    return true; // All
  });

  return (
    <>
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Reviews Moderation</h1>
          <p className="text-neutral-500 mt-1">Approve customer feedback and filter spam.</p>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-t-3xl border-x border-t border-neutral-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder="Search reviews or customer names..." 
            className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-shadow text-sm font-medium"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-600 outline-none bg-white"
          >
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved (Live)</option>
            <option value="ALL">All Reviews</option>
          </select>
        </div>
      </div>

      <div className="bg-neutral-50 border border-neutral-200 border-t-0 p-6 rounded-b-3xl">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-neutral-400" size={32} />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200 shadow-sm">
            <CheckCircle className="mx-auto text-emerald-400 mb-4" size={48} />
            <p className="font-bold text-neutral-900 text-lg">All caught up!</p>
            <p className="text-sm text-neutral-500 mt-1">There are no {filter.toLowerCase()} reviews to moderate.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredReviews.map((review: any) => (
              <div key={review.id} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row gap-6">
                
                {/* Review Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={i < review.rating ? "fill-amber-400 text-amber-400" : "fill-neutral-100 text-neutral-200"} />
                        ))}
                      </div>
                      <h3 className="font-bold text-neutral-900">{review.user?.fullName || 'Anonymous'}</h3>
                      <p className="text-xs text-neutral-500">on <span className="font-bold text-neutral-700">{review.product?.name || 'Unknown Product'}</span> &bull; {new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium text-neutral-700 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>

                {/* Actions */}
                <div className="md:w-48 flex flex-col gap-2 shrink-0 md:border-l md:border-neutral-100 md:pl-6">
                  {!review.approved && (
                    <button 
                      onClick={() => handleAction(review.id, 'APPROVE')}
                      className="w-full py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                  )}
                  {review.approved && (
                    <button 
                      onClick={() => handleAction(review.id, 'REJECT')}
                      className="w-full py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle size={16} /> Unapprove
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(review.id)}
                    className="w-full py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={16} /> Delete Spam
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
