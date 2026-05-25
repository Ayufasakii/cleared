"use client";

import Image from "next/image";
import Link from "next/link";
import type { GameWithTrophies } from "@/lib/types";

export default function NowClearingHero({ game }: { game: GameWithTrophies }) {
  const earned = game.trophies.filter((t) => t.earned).length;
  const total = game.trophies.length;
  const pct = total > 0 ? Math.round((earned / total) * 100) : 0;

  return (
    <Link href={`/games/${game.id}`} className="block group">
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        style={{
          minHeight: "200px",
          animation: "shimmerBorder 4s ease-in-out infinite",
          border: "1px solid #7c6dff50",
        }}
      >
        {/* Blurred cover art background */}
        {game.coverUrl && (
          <div
            style={{
              position: "absolute", inset: 0,
              backgroundImage: `url(${game.coverUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(28px)",
              transform: "scale(1.15)",
              opacity: 0.25,
            }}
          />
        )}

        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: game.coverUrl
            ? "linear-gradient(120deg, #08080fcc 40%, #0f0f1a88)"
            : "linear-gradient(120deg, #0f0f1a 0%, #08080f 100%)",
        }} />

        {/* Left accent bar */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: "3px",
          background: "linear-gradient(to bottom, #7c6dff, #4fc3f7)",
        }} />

        {/* Content */}
        <div className="relative flex items-center gap-6 p-6 sm:p-8">
          {/* Cover thumbnail */}
          {game.coverUrl && (
            <div className="relative shrink-0 w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden shadow-2xl"
              style={{ boxShadow: "0 8px 32px #7c6dff30" }}>
              <Image src={game.coverUrl} alt={game.title} fill unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          )}

          {/* Info */}
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <p className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "#7c6dff" }}>
              ▶ Now Clearing
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight truncate"
              style={{ color: "#e8e8f0" }}>
              {game.title}
            </h2>
            <p className="text-sm" style={{ color: "#4a4a6a" }}>
              {game.platform}{game.genre && ` · ${game.genre}`}
            </p>

            {total > 0 && (
              <div className="flex flex-col gap-1.5 mt-1">
                <div className="flex justify-between text-xs" style={{ color: "#4a4a6a" }}>
                  <span>Trophy Progress</span>
                  <span style={{ color: "#4fc3f7" }}>{earned} / {total} 🏆</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#1e1e35" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: "linear-gradient(to right, #7c6dff, #4fc3f7)",
                      animation: "progressFill 1.2s cubic-bezier(.22,1,.36,1) both",
                      animationDelay: "0.3s",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
