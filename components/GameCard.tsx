"use client";

import Link from "next/link";
import Image from "next/image";
import StatusBadge from "./StatusBadge";
import { calcAvgScore } from "@/lib/utils";
import type { GameWithTrophies } from "@/lib/types";

export default function GameCard({ game }: { game: GameWithTrophies }) {
  const avg = calcAvgScore(game);
  const earned = game.trophies.filter((t) => t.earned).length;
  const total = game.trophies.length;

  return (
    <Link href={`/games/${game.id}`}>
      <div
        className="group rounded-xl overflow-hidden transition-all duration-200 cursor-pointer"
        style={{
          backgroundColor: "#0f0f1a",
          border: "1px solid #1e1e35",
          borderTop: "2px solid #7c6dff40",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderTopColor = "#7c6dff";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderTopColor = "#7c6dff40";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }}
      >
        {/* Cover Image */}
        <div className="relative w-full aspect-[16/9] overflow-hidden" style={{ backgroundColor: "#1e1e35" }}>
          {game.coverUrl ? (
            <Image
              src={game.coverUrl}
              alt={game.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span style={{ color: "#4a4a6a", fontSize: "2rem" }}>🎮</span>
            </div>
          )}
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
              {game.platform} {game.genre && `· ${game.genre}`}
            </span>
            {avg !== null && (
              <span className="text-sm font-bold" style={{ color: "#7c6dff" }}>
                {avg}
              </span>
            )}
          </div>

          {/* Progress bar */}
          {total > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "#1e1e35" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(earned / total) * 100}%`,
                    backgroundColor: game.status === "PLATINUM" ? "#7c6dff" : "#4fc3f7",
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
