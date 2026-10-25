"use client";

import React, { useState, useCallback } from "react";
import { Check } from "lucide-react";
import { useAnimationState } from "@/hooks/useAnimationState";

interface ClickSuccessProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
  successDurationMs?: number;
  successText?: string;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
}

export default function ClickSuccess({
  children,
  onClick,
  className = "",
  disabled = false,
  successDurationMs = 1200,
  successText,
  type = "button",
  ariaLabel,
}: ClickSuccessProps) {
  const canAnimate = useAnimationState();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;

      if (canAnimate && !isSuccess) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
        }, successDurationMs);
      }

      onClick?.(e);
    },
    [disabled, canAnimate, isSuccess, successDurationMs, onClick]
  );

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`relative overflow-hidden select-none ${className}`}
    >
      {/* Subtle Micro-burst ripple ring */}
      {isSuccess && canAnimate && (
        <span
          className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/35 anim-click-burst pointer-events-none z-20"
          aria-hidden="true"
        />
      )}

      {/* Success Overlay Checkmark */}
      {isSuccess && canAnimate ? (
        <span className="flex items-center justify-center gap-1.5 anim-check-pop z-10 w-full h-full">
          <Check size={18} strokeWidth={3} className="text-white drop-shadow-xs" />
          {successText && <span className="font-bold text-white text-sm">{successText}</span>}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
