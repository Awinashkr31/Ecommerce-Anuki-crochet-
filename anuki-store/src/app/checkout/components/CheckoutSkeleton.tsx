import { ShieldCheck } from "lucide-react";

export default function CheckoutSkeleton({
  showRetry = false,
  onRetry,
}: {
  showRetry?: boolean;
  onRetry?: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col relative pb-32">
      {/* Header */}
      <header className="bg-white border-b border-neutral-100 py-4 px-4 md:px-8 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-neutral-100 animate-pulse" />
            <div className="h-6 w-28 bg-neutral-200 rounded-md animate-pulse" />
          </div>
          <div className="text-right">
            <div className="h-3 w-16 bg-neutral-100 rounded mb-1 ml-auto animate-pulse" />
            <div className="h-4 w-28 bg-neutral-200 rounded ml-auto flex items-center gap-1">
              <span className="text-xs font-semibold text-[#059669] flex items-center gap-1 opacity-70">
                Secure Payment <ShieldCheck size={14} />
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Timeout Alert if loading exceeds bounded threshold */}
      {showRetry && (
        <div className="max-w-6xl mx-auto w-full px-4 md:px-8 pt-4">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <p className="font-semibold">Loading is taking longer than usual</p>
              <p className="text-xs text-amber-700">Please check your internet connection or retry loading your checkout.</p>
            </div>
            <div className="flex items-center gap-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Retry
                </button>
              )}
              <a
                href="/cart"
                className="px-3 py-1.5 border border-amber-300 text-amber-800 hover:bg-amber-100 text-xs font-medium rounded-lg transition-colors"
              >
                Back to Cart
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Skeleton */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          
          {/* Left Column Skeleton */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            {/* Delivery Address Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-neutral-100 animate-pulse" />
                <div className="h-4 w-40 bg-neutral-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-9 w-full bg-neutral-50 rounded-lg animate-pulse" />
                <div className="h-16 w-full bg-neutral-50 rounded-lg animate-pulse" />
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-9 bg-neutral-50 rounded-lg animate-pulse" />
                  <div className="h-9 bg-neutral-50 rounded-lg animate-pulse" />
                  <div className="h-9 bg-neutral-50 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>

            {/* Payment Method Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
              <div className="h-4 w-32 bg-neutral-200 rounded mb-4 animate-pulse" />
              <div className="space-y-2.5">
                <div className="h-20 w-full bg-neutral-50 border border-neutral-200 rounded-xl animate-pulse" />
                <div className="h-16 w-full bg-neutral-50 border border-neutral-100 rounded-xl animate-pulse" />
              </div>
            </div>

            {/* Offers Skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
              <div className="h-4 w-28 bg-neutral-200 rounded mb-3 animate-pulse" />
              <div className="h-10 w-full bg-neutral-50 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 space-y-4">
              <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg shrink-0 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 bg-neutral-100 rounded animate-pulse" />
                    <div className="h-2.5 w-1/4 bg-neutral-100 rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-10 bg-neutral-100 rounded animate-pulse" />
                </div>
              </div>

              <div className="space-y-2 border-t border-neutral-100 pt-4">
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-neutral-100 rounded animate-pulse" />
                  <div className="h-3 w-12 bg-neutral-100 rounded animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-neutral-100 rounded animate-pulse" />
                  <div className="h-3 w-10 bg-neutral-100 rounded animate-pulse" />
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-100">
                  <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Sticky Bottom Bar Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between pb-safe">
          <div className="space-y-1">
            <div className="h-6 w-20 bg-neutral-200 rounded animate-pulse" />
            <div className="h-2.5 w-24 bg-neutral-100 rounded animate-pulse" />
          </div>
          <div className="h-12 w-48 bg-neutral-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
