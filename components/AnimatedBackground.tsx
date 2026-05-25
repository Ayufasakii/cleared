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
        width: "700px", height: "700px",
        borderRadius: "50%",
        background: "radial-gradient(circle, #7c6dff18 0%, transparent 68%)",
        top: "-260px", left: "-220px",
        animation: "floatOrb 18s ease-in-out infinite",
      }} />
      {/* Blue orb — bottom-right */}
      <div style={{
        position: "absolute",
        width: "580px", height: "580px",
        borderRadius: "50%",
        background: "radial-gradient(circle, #4fc3f712 0%, transparent 68%)",
        bottom: "-180px", right: "-180px",
        animation: "floatOrb 24s ease-in-out infinite reverse",
      }} />
      {/* Small violet orb — center */}
      <div style={{
        position: "absolute",
        width: "320px", height: "320px",
        borderRadius: "50%",
        background: "radial-gradient(circle, #7c6dff0a 0%, transparent 70%)",
        top: "45%", left: "38%",
        animation: "floatOrb 30s ease-in-out infinite 8s",
      }} />
    </div>
  );
}
