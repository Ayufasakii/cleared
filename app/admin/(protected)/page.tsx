import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getStats() {
  const [games, trophies] = await Promise.all([
    prisma.game.count(),
    prisma.trophy.count(),
  ]);
  return { games, trophies };
}

export default async function AdminPage() {
  const stats = await getStats();

  const actions = [
    { href: "/admin/games/new", label: "Add Game", icon: "➕", desc: "Add a new game manually or sync from PSN" },
    { href: "/admin/journal", label: "Journal",   icon: "📓", desc: "Write a new journal entry" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35" }}>
          <p className="text-2xl font-bold" style={{ color: "#e8e8f0" }}>{stats.games}</p>
          <p className="text-xs" style={{ color: "#4a4a6a" }}>Total Games</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35" }}>
          <p className="text-2xl font-bold" style={{ color: "#e8e8f0" }}>{stats.trophies}</p>
          <p className="text-xs" style={{ color: "#4a4a6a" }}>Total Trophies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((a) => (
          <Link key={a.href} href={a.href}>
            <div
              className="rounded-xl p-5 flex flex-col gap-2 cursor-pointer transition-all"
              style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "#7c6dff")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "#1e1e35")}
            >
              <span style={{ fontSize: "1.5rem" }}>{a.icon}</span>
              <p className="font-semibold" style={{ color: "#e8e8f0" }}>{a.label}</p>
              <p className="text-xs" style={{ color: "#4a4a6a" }}>{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Game list with edit links */}
      <GameList />
    </div>
  );
}

async function GameList() {
  const games = await prisma.game.findMany({
    orderBy: { updatedAt: "desc" },
    include: { trophies: true },
  });

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
