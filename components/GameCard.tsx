"use client";

import Link from "next/link";
import Image from "next/image";
import StatusBadge from "./StatusBadge";
import { calcAvgScore } from "@/lib/utils";
import type { GameWithTrophies } from "@/lib/types";

const STATUS_GLOW: Record<string, string> = {
  PLATINUM: "#7c6dff",
  PLAYING:  "#4fc3f7",
  DROPPED:  "#ff6b6b",
};

export default function GameCard({ game }: { game: GameWithTrophies }) {
  const avg    = calcAvgScore(game);
  const earned = game.trophies.filter((t) => t.earned).length;
  const total  = game.trophies.length;
  const glow   = STATUS_GLOW[game.status] ?? "#7c6dff";

  return (
    <Link href={`/games/${game.id}`} className="block h-full">
      <div
        className="group glass rounded-xl overflow-hidden h-full cursor-pointer"
        style={{
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
          transition: "transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s, border-color 0.35s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "translateY(-6px)";
          el.style.borderColor = `${glow}50`;
          el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${glow}25, inset 0 1px 0 rgba(255,255,255,0.08)`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "translateY(0)";
          el.style.borderColor = "rgba(255,255,255,0.07)";
          el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)";
        }}
      >
        {/* Cover */}
        <div className="relative w-full aspect-[16/9] overflow-hidden"
          style={{ backgroundColor: "#0a0a16" }}>
          {game.coverUrl ? (
            <Image
              src={game.coverUrl} alt={game.title} fill unoptimized
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center"
              style={{ background: `radial-gradient(circle, ${glow}15, transparent)` }}>
              <span style={{ fontSize: "2.5rem", opacity: 0.3 }}>🎮</span>
            </div>
          )}
          {/* Bottom gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to top, ${glow}30 0%, transparent 50%)`,
            opacity: 0,
            transition: "opacity 0.35s",
          }}
            className="group-hover:opacity-100"
          />
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2.5">
          {/* Top accent */}
          <div style={{
            height: "1px",
            background: `linear-gradient(to right, ${glow}60, transparent)`,
            marginTop: "-16px",
            marginLeft: "-16px",
            marginRight: "-16px",
            marginBottom: "8px",
          }} />

          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-tight" style={{ color: "#e8e8f0" }}>
              {game.title}
            </h3>
            <StatusBadge status={game.status} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "#4a4a6a" }}>
              {game.platform}{game.genre && ` · ${game.genre}`}
            </span>
            {avg !== null && (
              <span className="text-sm font-bold" style={{
                background: `linear-gradient(135deg, #e8e8f0, ${glow})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                {avg}
              </span>
            )}
          </div>

          {total > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-0.5 rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${(earned / total) * 100}%`, backgroundColor: glow,
                    boxShadow: `0 0 6px ${glow}` }} />
              </div>
              <span className="text-xs shrink-0" style={{ color: "#4a4a6a" }}>
                {earned}/{total}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
