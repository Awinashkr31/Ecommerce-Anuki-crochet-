import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex-1 min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      <p className="text-sm text-neutral-500 font-medium animate-pulse">Loading admin data...</p>
    </div>
  );
}
