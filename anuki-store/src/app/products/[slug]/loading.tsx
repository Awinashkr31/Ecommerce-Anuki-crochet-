export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Skeleton */}
      <div className="md:hidden">
        <div className="w-full aspect-square bg-neutral-200 animate-pulse"></div>
        <div className="p-4 space-y-4">
          <div className="h-4 bg-neutral-200 animate-pulse w-24 rounded-full"></div>
          <div className="h-8 bg-neutral-200 animate-pulse w-3/4 rounded-full"></div>
          <div className="h-6 bg-neutral-200 animate-pulse w-1/3 rounded-full"></div>
          
          <div className="flex gap-2 pt-4">
            <div className="h-10 bg-neutral-200 animate-pulse w-10 rounded-full"></div>
            <div className="h-10 bg-neutral-200 animate-pulse flex-1 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-12">
          {/* Gallery Skeleton */}
          <div className="w-1/2 flex gap-4">
            <div className="w-24 space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-24 h-24 bg-neutral-200 animate-pulse rounded-2xl"></div>
              ))}
            </div>
            <div className="flex-1 aspect-[4/5] bg-neutral-200 animate-pulse rounded-3xl"></div>
          </div>
          
          {/* Info Skeleton */}
          <div className="w-1/2 space-y-6 py-8">
            <div className="h-6 bg-neutral-200 animate-pulse w-32 rounded-full"></div>
            <div className="h-12 bg-neutral-200 animate-pulse w-3/4 rounded-full"></div>
            <div className="h-8 bg-neutral-200 animate-pulse w-1/3 rounded-full"></div>
            
            <div className="pt-8 space-y-4">
              <div className="h-4 bg-neutral-200 animate-pulse w-1/4 rounded-full"></div>
              <div className="flex gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-neutral-200 animate-pulse w-24 rounded-2xl"></div>
                ))}
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              <div className="h-14 bg-neutral-200 animate-pulse w-32 rounded-full"></div>
              <div className="h-14 bg-neutral-200 animate-pulse flex-1 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
