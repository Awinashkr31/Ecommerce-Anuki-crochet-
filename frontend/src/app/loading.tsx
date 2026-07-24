import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      <p className="text-sm text-neutral-500 font-medium animate-pulse">Loading...</p>
    </div>
  );
}
