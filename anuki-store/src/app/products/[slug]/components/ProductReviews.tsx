import { useState } from 'react';
import useSWR from 'swr';
import { Star, MessageSquare, Camera, X } from 'lucide-react';
import { apiGet, apiPost } from '@/lib/api';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export default function ProductReviews({ productId }: { productId: string }) {
  const { profile } = useAuthStore();
  const { data: reviews = [], mutate, isLoading } = useSWR(`/api/reviews/product/${productId}`, apiGet);
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (photos.length + newFiles.length > 2) {
        toast.error('You can only upload up to 2 photos per review.');
        return;
      }
      setPhotos([...photos, ...newFiles].slice(0, 2));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      toast.error('Please log in to submit a review');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrls: string[] = [];
      
      if (photos.length > 0) {
        const formData = new FormData();
        photos.forEach(photo => formData.append('images', photo));
        
        const uploadRes = await axios.post('/api/upload/customer', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true // to send session cookie
        });
        imageUrls = uploadRes.data.urls;
      }

      await apiPost('/api/reviews', { productId, rating, comment, imageUrls });
      toast.success('Review submitted! It will appear after approval.');
      setRating(5);
      setComment('');
      setPhotos([]);
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white border-t border-neutral-100 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8 border-b border-neutral-100 pb-4">
          <div>
            <h2 className="text-2xl font-serif text-neutral-900">Customer Reviews</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={20} className={star <= (reviews.length > 0 ? reviews.reduce((a: any, c: any) => a + c.rating, 0) / reviews.length : 5) ? 'fill-amber-400' : 'text-neutral-200 fill-neutral-100'} />
                ))}
              </div>
              <span className="text-sm text-neutral-500 font-medium">
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="text-sm font-bold text-rose-600 hover:text-rose-700 transition-colors bg-rose-50 px-4 py-2 rounded-lg"
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-10 bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
            <h3 className="font-bold text-neutral-900 mb-4">Leave your feedback</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      size={28} 
                      className={star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-neutral-200 text-neutral-200'} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">Review Comment (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-rose-500 outline-none text-sm mb-4"
                placeholder="What did you love about this product?"
              />
              
              <div className="flex items-center gap-4">
                <label className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 text-sm font-bold cursor-pointer hover:bg-white transition-colors ${photos.length >= 2 ? 'opacity-50 cursor-not-allowed' : 'text-neutral-700'}`}>
                  <Camera size={18} />
                  Add Photos (Max 2)
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png, image/webp" 
                    multiple 
                    className="hidden" 
                    onChange={handlePhotoChange}
                    disabled={photos.length >= 2}
                  />
                </label>
                <span className="text-xs text-neutral-500">{photos.length}/2 uploaded</span>
              </div>
              
              {photos.length > 0 && (
                <div className="flex gap-4 mt-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-200">
                      <img src={URL.createObjectURL(photo)} alt="upload preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {isLoading ? (
          <div className="animate-pulse space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-neutral-200 rounded-full shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-1/4 h-4 bg-neutral-200 rounded"></div>
                  <div className="w-full h-16 bg-neutral-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto text-neutral-300 mb-4" size={48} />
            <p className="text-neutral-500 font-medium">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {reviews.map((review: any) => (
              <div key={review.id} className="flex gap-4 border-b border-neutral-100 pb-8 last:border-0">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold shrink-0 text-lg uppercase">
                  {review.user?.fullName?.[0] || 'A'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-neutral-900">{review.user?.fullName || 'Anonymous User'}</h4>
                    <span className="text-neutral-400 text-xs">&bull; {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex text-amber-400 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={14} className={star <= review.rating ? 'fill-amber-400' : 'fill-neutral-100 text-neutral-200'} />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-neutral-600 leading-relaxed text-sm mb-3">{review.comment}</p>
                  )}
                  {review.imageUrls && review.imageUrls.length > 0 && (
                    <div className="flex gap-3 mt-3">
                      {review.imageUrls.map((url: string, idx: number) => (
                        <div key={idx} className="w-20 h-20 rounded-xl overflow-hidden border border-neutral-200">
                          <img src={url} alt="Review photo" className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
