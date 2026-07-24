"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Star, Image as ImageIcon, Search, CheckCircle, XCircle, MessageSquareReply, Flag } from 'lucide-react';

const mockReviews = [
  { 
    id: 'REV-991', 
    productName: 'Crochet Rose Bouquet', 
    customerName: 'Priya Sharma',
    rating: 5,
    text: "Absolutely gorgeous! The craftsmanship is incredible and the colors are exactly as pictured. It made the perfect anniversary gift.",
    hasPhotos: true,
    status: 'PENDING',
    date: '2026-10-07T10:30:00Z',
    isSuspicious: false
  },
  { 
    id: 'REV-992', 
    productName: 'Amigurumi Bunny', 
    customerName: 'Rahul K.',
    rating: 1,
    text: "Did not arrive on time. Very disappointed.",
    hasPhotos: false,
    status: 'PENDING',
    date: '2026-10-06T15:45:00Z',
    isSuspicious: false
  },
  { 
    id: 'REV-993', 
    productName: 'Custom Name Keychain', 
    customerName: 'Unknown User',
    rating: 5,
    text: "buy cheap followers at instagram-bots.com !!! best price !!!",
    hasPhotos: false,
    status: 'PENDING',
    date: '2026-10-06T09:12:00Z',
    isSuspicious: true
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews);
  const [replyModal, setReplyModal] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleAction = (id: string, action: 'APPROVE' | 'REJECT') => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : r));
  };

  const handleReplySubmit = () => {
    // In a real app, this would send the reply to the backend
    setReplyModal(null);
    setReplyText("");
  };

  const pendingReviews = reviews.filter(r => r.status === 'PENDING');

  return (
    <>
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Reviews Moderation</h1>
          <p className="text-neutral-500 mt-1">Approve customer photos, filter spam, and reply publicly.</p>
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
          <select className="px-4 py-3 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-600 outline-none bg-white">
            <option>Pending Approval</option>
            <option>Approved (Live)</option>
            <option>Rejected / Spam</option>
          </select>
        </div>
      </div>

      <div className="bg-neutral-50 border border-neutral-200 border-t-0 p-6 rounded-b-3xl">
        {pendingReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200 shadow-sm">
            <CheckCircle className="mx-auto text-emerald-400 mb-4" size={48} />
            <p className="font-bold text-neutral-900 text-lg">All caught up!</p>
            <p className="text-sm text-neutral-500 mt-1">There are no pending reviews to moderate.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingReviews.map(review => (
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
                      <h3 className="font-bold text-neutral-900">{review.customerName}</h3>
                      <p className="text-xs text-neutral-500">on <span className="font-bold text-neutral-700">{review.productName}</span> &bull; {new Date(review.date).toLocaleDateString()}</p>
                    </div>
                    {review.isSuspicious && (
                      <span className="flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-bold border border-rose-100 uppercase tracking-wider">
                        <Flag size={14} /> Suspicious
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm font-medium text-neutral-700 leading-relaxed italic">
                    "{review.text}"
                  </p>
                  
                  {review.hasPhotos && (
                    <div className="flex gap-3">
                      <div className="w-20 h-20 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-400 relative overflow-hidden group cursor-pointer">
                        <ImageIcon size={24} className="group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="w-20 h-20 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-center text-neutral-400 relative overflow-hidden group cursor-pointer">
                        <ImageIcon size={24} className="group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="md:w-48 flex flex-col gap-2 shrink-0 md:border-l md:border-neutral-100 md:pl-6">
                  <button 
                    onClick={() => handleAction(review.id, 'APPROVE')}
                    className="w-full py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button 
                    onClick={() => handleAction(review.id, 'REJECT')}
                    className="w-full py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={16} /> Reject / Spam
                  </button>
                  <div className="h-px bg-neutral-100 my-1"></div>
                  <button 
                    onClick={() => setReplyModal(review.id)}
                    className="w-full py-2.5 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border border-neutral-200 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquareReply size={16} /> Public Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-neutral-200">
            <div className="p-6 border-b border-neutral-100">
              <h2 className="text-xl font-black">Respond Publicly</h2>
              <p className="text-neutral-500 text-sm mt-1">Your reply will be visible to everyone on the product page.</p>
            </div>
            
            <div className="p-6">
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 mb-6 text-sm font-medium text-neutral-600 italic">
                "{reviews.find(r => r.id === replyModal)?.text}"
              </div>
              
              <label className="block text-sm font-bold text-neutral-700 mb-2">Your Response (as Store Owner)</label>
              <textarea 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full border border-neutral-200 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 outline-none resize-none font-medium transition-shadow"
                placeholder="Thank you for your review! We're so glad you liked it..."
                rows={4}
                autoFocus
              ></textarea>
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-3 rounded-b-3xl">
              <button 
                onClick={() => setReplyModal(null)}
                className="px-6 py-2.5 font-bold text-neutral-600 hover:text-neutral-900 transition-colors rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleReplySubmit}
                disabled={!replyText.trim()}
                className="bg-neutral-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                Post Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
