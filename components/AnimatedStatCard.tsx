"use client";

import { useEffect, useState } from "react";

function useCountUp(target: number, duration = 900, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      if (target === 0) return;
      const start = Date.now();
      const tick = () => {
        const p = Math.min((Date.now() - start) / duration, 1);
        setCount(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return count;
}

export function AnimatedStatCard({
  label, value, delay = 0, accent = "#7c6dff",
}: {
  label: string; value: number; delay?: number; accent?: string;
}) {
  const n = useCountUp(value, 900, delay);

  return (
    <div
      className="glass rounded-xl p-5 flex flex-col gap-1.5 relative overflow-hidden"
      style={{
        border: `1px solid rgba(255,255,255,0.06)`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`,
        animation: `fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) both`,
        animationDelay: `${delay}ms`,
        transition: "box-shadow 0.3s, border-color 0.3s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = `${accent}40`;
        el.style.boxShadow = `0 4px 32px rgba(0,0,0,0.5), 0 0 24px ${accent}20, inset 0 1px 0 rgba(255,255,255,0.07)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "rgba(255,255,255,0.06)";
        el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)";
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: "1px",
        background: `linear-gradient(to right, transparent, ${accent}60, transparent)`,
      }} />

      <span
        className="text-3xl font-bold"
        style={{
          background: `linear-gradient(135deg, #e8e8f0, ${accent})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {n}
      </span>
      <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#4a4a6a" }}>
        {label}
      </span>
    </div>
  );
}
