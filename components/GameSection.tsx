"use client";

import GameCard from "./GameCard";
import type { GameWithTrophies } from "@/lib/types";

export default function GameSection({
  label, icon, games, baseDelay = 0,
}: {
  label: string; icon: string; games: GameWithTrophies[]; baseDelay?: number;
}) {
  return (
    <section style={{ animation: `fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) both ${baseDelay}ms` }}>
      <div className="flex items-center gap-3 mb-5">
        <span style={{ fontSize: "1.1rem" }}>{icon}</span>
        <h2 className="text-sm font-bold tracking-widest uppercase"
          style={{
            background: "linear-gradient(135deg, #e8e8f0, #7c6dff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
          {label}
        </h2>
        <div className="flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold"
          style={{
            background: "rgba(124,109,255,0.12)",
            border: "1px solid rgba(124,109,255,0.25)",
            color: "#7c6dff",
          }}>
          {games.length}
        </div>
        {/* Line */}
        <div className="flex-1 h-px" style={{
          background: "linear-gradient(to right, rgba(124,109,255,0.3), transparent)",
        }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game, i) => (
          <div key={game.id} style={{
            animation: `fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) both ${baseDelay + i * 70}ms`,
          }}>
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </section>
  );
}
