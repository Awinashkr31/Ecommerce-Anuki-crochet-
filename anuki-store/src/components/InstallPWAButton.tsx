"use client";

import { usePWAInstall } from "../hooks/usePWAInstall";
import { Plus } from "lucide-react";

export function InstallPWAButton() {
  const { canInstall, installApp } = usePWAInstall();

  if (!canInstall) return null;

  return (
    <button
      onClick={installApp}
      aria-label="Install App"
      title="Install App"
      className="md:hidden p-1 mr-2 text-neutral-700 active:scale-95 transition-all flex items-center justify-center border border-neutral-300 rounded-[6px] hover:opacity-70 h-8 w-8 shrink-0"
    >
      <Plus size={20} strokeWidth={2} />
    </button>
  );
}
