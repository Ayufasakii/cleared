import { prisma } from "@/lib/prisma";
import AdminGameList from "./AdminGameList";
import AdminActionCards from "./AdminActionCards";

async function getStats() {
  const [games, trophies] = await Promise.all([
    prisma.game.count(),
    prisma.trophy.count(),
  ]);
  return { games, trophies };
}

export default async function AdminPage() {
  const stats = await getStats();
  const games = await prisma.game.findMany({ orderBy: { updatedAt: "desc" } });

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

      <AdminActionCards />
      <AdminGameList games={games} />
    </div>
  );
}
