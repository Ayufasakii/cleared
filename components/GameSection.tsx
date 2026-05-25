"use client";

import GameCard from "./GameCard";
import type { GameWithTrophies } from "@/lib/types";

export default function GameSection({
  label, icon, games, baseDelay = 0,
}: {
  label: string;
  icon: string;
  games: GameWithTrophies[];
  baseDelay?: number;
}) {
  return (
    <section style={{ animation: "fadeSlideUp 0.5s cubic-bezier(.22,1,.36,1) both", animationDelay: `${baseDelay}ms` }}>
      {/* Section header */}
      <h2 className="text-sm font-semibold tracking-widest uppercase mb-4 flex items-center gap-2"
        style={{ color: "#4a4a6a" }}>
        <span>{icon}</span>
        <span>{label}</span>
        <span
          className="text-xs px-1.5 py-0.5 rounded-full font-bold"
          style={{ backgroundColor: "#1e1e35", color: "#7c6dff" }}
        >
          {games.length}
        </span>
      </h2>

      {/* Cards grid with stagger */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game, i) => (
          <div
            key={game.id}
            style={{
              animation: "fadeSlideUp 0.5s cubic-bezier(.22,1,.36,1) both",
              animationDelay: `${baseDelay + i * 80}ms`,
            }}
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </section>
  );
}
