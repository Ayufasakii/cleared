"use client";

export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none select-none"
      style={{ zIndex: 0 }}
      aria-hidden
    >
      {/* Purple orb — top-left */}
      <div style={{
        position: "absolute",
        width: "900px", height: "900px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,109,255,0.18) 0%, transparent 65%)",
        top: "-350px", left: "-280px",
        animation: "floatOrb 20s ease-in-out infinite",
        filter: "blur(2px)",
      }} />
      {/* Cyan orb — bottom-right */}
      <div style={{
        position: "absolute",
        width: "750px", height: "750px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(79,195,247,0.12) 0%, transparent 65%)",
        bottom: "-250px", right: "-200px",
        animation: "floatOrb 26s ease-in-out infinite reverse",
        filter: "blur(2px)",
      }} />
      {/* Small violet — mid */}
      <div style={{
        position: "absolute",
        width: "400px", height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(160,100,255,0.10) 0%, transparent 70%)",
        top: "42%", left: "42%",
        animation: "floatOrb 34s ease-in-out infinite 10s",
        filter: "blur(1px)",
      }} />
    </div>
  );
}
