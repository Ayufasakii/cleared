"use client";

import Link from "next/link";
import type { Game } from "@prisma/client";

export default function AdminGameList({ games }: { games: Game[] }) {
  if (games.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a4a6a" }}>
        All Games
      </h2>
      {games.map((game) => (
        <Link key={game.id} href={`/admin/games/${game.id}`}>
          <div
            className="rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all"
            style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "#7c6dff")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "#1e1e35")}
          >
            <div>
              <p className="font-medium text-sm" style={{ color: "#e8e8f0" }}>{game.title}</p>
              <p className="text-xs" style={{ color: "#4a4a6a" }}>{game.platform} · {game.status}</p>
            </div>
            <span style={{ color: "#4a4a6a" }}>→</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
