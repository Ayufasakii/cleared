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
  const avg = calcAvgScore(game);
  const earned = game.trophies.filter((t) => t.earned).length;
  const total = game.trophies.length;
  const glow = STATUS_GLOW[game.status] ?? "#7c6dff";

  return (
    <Link href={`/games/${game.id}`} className="block h-full">
      <div
        className="group rounded-xl overflow-hidden h-full transition-all duration-300 cursor-pointer"
        style={{
          backgroundColor: "#0f0f1a",
          border: "1px solid #1e1e35",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.border = `1px solid ${glow}60`;
          el.style.transform = "translateY(-3px)";
          el.style.boxShadow = `0 8px 32px ${glow}20`;
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.border = "1px solid #1e1e35";
          el.style.transform = "translateY(0)";
          el.style.boxShadow = "none";
        }}
      >
        {/* Cover Image */}
        <div className="relative w-full aspect-[16/9] overflow-hidden"
          style={{ backgroundColor: "#1e1e35" }}>
          {game.coverUrl ? (
            <Image
              src={game.coverUrl}
              alt={game.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span style={{ color: "#1e1e35", fontSize: "2.5rem" }}>🎮</span>
            </div>
          )}
          {/* Status tint overlay on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: `linear-gradient(to top, ${glow}30, transparent 60%)` }}
          />
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2">
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
              <span className="text-sm font-bold" style={{ color: glow }}>
                {avg}
              </span>
            )}
          </div>

          {total > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: "#1e1e35" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(earned / total) * 100}%`,
                    backgroundColor: glow,
                  }}
                />
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
