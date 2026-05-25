"use client";

import { useEffect, useState } from "react";

function useCountUp(target: number, duration = 1000, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (target === 0) return;
      const startTime = Date.now();
      const tick = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timer);
  }, [target, duration, delay]);
  return count;
}

export function AnimatedStatCard({
  label, value, suffix = "", delay = 0, accent = "#7c6dff",
}: {
  label: string;
  value: number;
  suffix?: string;
  delay?: number;
  accent?: string;
}) {
  const displayed = useCountUp(value, 900, delay);

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-1 relative overflow-hidden"
      style={{
        backgroundColor: "#0f0f1a",
        border: "1px solid #1e1e35",
        animation: `fadeSlideUp 0.5s cubic-bezier(.22,1,.36,1) both`,
        animationDelay: `${delay}ms`,
      }}
    >
      {/* Accent glow dot */}
      <div style={{
        position: "absolute", top: 12, right: 12,
        width: 6, height: 6, borderRadius: "50%",
        backgroundColor: accent, opacity: 0.7,
        boxShadow: `0 0 8px ${accent}`,
      }} />

      <span className="text-2xl font-bold" style={{ color: "#e8e8f0", fontVariantNumeric: "tabular-nums" }}>
        {displayed}{suffix}
      </span>
      <span className="text-xs font-medium tracking-wide" style={{ color: "#4a4a6a" }}>
        {label}
      </span>
    </div>
  );
}
