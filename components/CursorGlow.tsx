"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!ref.current) return;
      ref.current.style.left = `${e.clientX}px`;
      ref.current.style.top  = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 0,
        width: "700px",
        height: "700px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,109,255,0.07) 0%, rgba(79,195,247,0.03) 40%, transparent 65%)",
        transform: "translate(-50%, -50%)",
        transition: "left 0.15s ease-out, top 0.15s ease-out",
        willChange: "left, top",
      }}
    />
  );
}
