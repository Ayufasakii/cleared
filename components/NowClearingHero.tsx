"use client";

import Image from "next/image";
import Link from "next/link";
import type { GameWithTrophies } from "@/lib/types";

export default function NowClearingHero({ game }: { game: GameWithTrophies }) {
  const earned = game.trophies.filter((t) => t.earned).length;
  const total  = game.trophies.length;
  const pct    = total > 0 ? (earned / total) * 100 : 0;

  return (
    <Link href={`/games/${game.id}`} className="block group">
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500"
        style={{
          minHeight: "220px",
          border: "1px solid rgba(124,109,255,0.35)",
          boxShadow: "0 0 0 1px rgba(124,109,255,0.1), 0 8px 48px rgba(124,109,255,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 0 0 1px rgba(124,109,255,0.4), 0 16px 64px rgba(124,109,255,0.3), 0 0 100px rgba(79,195,247,0.1), inset 0 1px 0 rgba(255,255,255,0.08)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(124,109,255,0.6)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 0 0 1px rgba(124,109,255,0.1), 0 8px 48px rgba(124,109,255,0.15), inset 0 1px 0 rgba(255,255,255,0.05)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(124,109,255,0.35)";
        }}
      >
        {/* Blurred cover bg */}
        {game.coverUrl && (
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${game.coverUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(32px) saturate(1.4)",
            transform: "scale(1.2)",
            opacity: 0.18,
            transition: "opacity 0.5s",
          }} />
        )}

        {/* Dark glass overlay */}
        <div className="glass" style={{ position: "absolute", inset: 0 }} />

        {/* Gradient top-left glow */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 0% 0%, rgba(124,109,255,0.12) 0%, transparent 60%)",
        }} />

        {/* Content */}
        <div className="relative flex items-center gap-6 sm:gap-8 p-6 sm:p-10">
          {/* Cover */}
          {game.coverUrl && (
            <div className="relative shrink-0 rounded-xl overflow-hidden"
              style={{
                width: "100px", height: "130px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,109,255,0.2)",
                transition: "transform 0.4s ease, box-shadow 0.4s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05) rotate(-1deg)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,109,255,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,109,255,0.2)";
              }}
            >
              <Image src={game.coverUrl} alt={game.title} fill unoptimized className="object-cover" />
            </div>
          )}

          {/* Text */}
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            {/* Label */}
            <div className="flex items-center gap-2">
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                backgroundColor: "#7c6dff",
                boxShadow: "0 0 8px #7c6dff, 0 0 16px #7c6dff80",
                animation: "shimmerBorder 2s ease-in-out infinite",
                display: "inline-block",
              }} />
              <span className="text-xs font-bold tracking-[0.25em] uppercase"
                style={{ color: "#7c6dff" }}>
                Now Clearing
              </span>
            </div>

            {/* Title — gradient */}
            <h2 className="gradient-text font-bold leading-tight"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}>
              {game.title}
            </h2>

            <p className="text-sm" style={{ color: "#4a4a6a" }}>
              {game.platform}{game.genre && ` · ${game.genre}`}
            </p>

            {total > 0 && (
              <div className="flex flex-col gap-1.5 max-w-xs mt-1">
                <div className="flex justify-between text-xs" style={{ color: "#4a4a6a" }}>
                  <span>Trophies</span>
                  <span style={{ color: "#4fc3f7", fontWeight: 600 }}>{earned} / {total}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                  <div style={{
                    height: "100%",
                    width: `${pct}%`,
                    background: "linear-gradient(to right, #7c6dff, #4fc3f7)",
                    borderRadius: "9999px",
                    animation: "progressFill 1.4s cubic-bezier(.22,1,.36,1) both 0.4s",
                    boxShadow: "0 0 8px rgba(124,109,255,0.6)",
                  }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
