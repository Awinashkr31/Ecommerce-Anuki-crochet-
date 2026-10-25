"use client";

import { useEffect, useState } from "react";
import { useAnimationState } from "@/hooks/useAnimationState";

interface PriceRollProps {
  value: number;
  prefix?: string;
  className?: string;
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function DigitRoll({
  targetDigit,
  delay = 0,
  canAnimate = true,
}: {
  targetDigit: number;
  delay?: number;
  canAnimate?: boolean;
}) {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    if (!canAnimate) {
      setCurrent(targetDigit);
      return;
    }
    const timer = setTimeout(() => {
      setCurrent(targetDigit);
    }, delay);
    return () => clearTimeout(timer);
  }, [targetDigit, delay, canAnimate]);

  return (
    <span
      className="inline-block relative overflow-hidden select-none align-middle"
      style={{
        height: "1.35em",
        width: "0.72em",
      }}
    >
      <span
        className={`flex flex-col ${canAnimate ? "transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]" : ""}`}
        style={{
          transform: `translateY(-${current * 10}%)`,
          willChange: canAnimate ? "transform" : "auto",
        }}
      >
        {DIGITS.map((d) => (
          <span
            key={d}
            className="flex items-center justify-center leading-none select-none"
            style={{ height: "1.35em" }}
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function PriceRoll({
  value,
  prefix = "₹",
  className = "",
}: PriceRollProps) {
  const canAnimate = useAnimationState();
  const formatted = Math.round(value).toString();

  return (
    <span className={`inline-flex items-center font-black tabular-nums leading-none ${className}`}>
      {prefix && <span className="mr-0.5 leading-none">{prefix}</span>}
      {formatted.split("").map((char, idx) => {
        const digit = parseInt(char, 10);
        if (isNaN(digit)) {
          return <span key={idx} className="leading-none">{char}</span>;
        }
        return (
          <DigitRoll
            key={`${idx}-${formatted.length}`}
            targetDigit={digit}
            delay={idx * 40}
            canAnimate={canAnimate}
          />
        );
      })}
    </span>
  );
}
