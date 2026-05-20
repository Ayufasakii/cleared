import { prisma } from "@/lib/prisma";
import { calcAvgScore, getPlatinumCount, getTotalTrophies } from "@/lib/utils";
import type { GameWithTrophies } from "@/lib/types";
import GameCard from "@/components/GameCard";
import type { GameStatus } from "@/lib/types";

async function getGames(): Promise<GameWithTrophies[]> {
  return prisma.game.findMany({
    include: { trophies: true },
    orderBy: { updatedAt: "desc" },
  });
}

const SECTIONS: { status: GameStatus; label: string; icon: string }[] = [
  { status: "PLAYING",  label: "Playing",  icon: "🎮" },
  { status: "PLATINUM", label: "Platinum", icon: "🏆" },
  { status: "DROPPED",  label: "Dropped",  icon: "💀" },
];

export default async function HomePage() {
  const games = await getGames();

  const platinumCount = getPlatinumCount(games);
  const totalTrophies = getTotalTrophies(games);
  const playingCount = games.filter((g) => g.status === "PLAYING").length;
  const droppedCount = games.filter((g) => g.status === "DROPPED").length;

  const allScores = games.map(calcAvgScore).filter((s): s is number => s !== null);
  const avgScore =
    allScores.length > 0
      ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10
      : null;

  const nowClearing = games.find((g) => g.status === "PLAYING");

  return (
    <div className="flex flex-col gap-10">
      {nowClearing && <NowClearing game={nowClearing} />}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Platinum" value={platinumCount.toString()} />
        <StatCard label="Avg Score" value={avgScore !== null ? avgScore.toString() : "—"} />
        <StatCard label="Trophies" value={totalTrophies.toString()} />
        <StatCard label="Played" value={(platinumCount + playingCount + droppedCount).toString()} />
      </div>

      {SECTIONS.map(({ status, label, icon }) => {
        const sectionGames = games.filter((g) => g.status === status);
        if (sectionGames.length === 0) return null;
        return (
          <section key={status}>
            <h2
              className="text-sm font-semibold tracking-widest uppercase mb-4 flex items-center gap-2"
              style={{ color: "#4a4a6a" }}
            >
              <span>{icon}</span>
              <span>{label}</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={{ backgroundColor: "#1e1e35", color: "#7c6dff" }}
              >
                {sectionGames.length}
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sectionGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>
        );
      })}

      {games.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <span style={{ fontSize: "3rem" }}>🎮</span>
          <p className="font-semibold" style={{ color: "#4a4a6a" }}>
            No games yet. Add your first game from the admin panel.
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-1"
      style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35" }}
    >
      <span className="text-2xl font-bold" style={{ color: "#e8e8f0" }}>
        {value}
      </span>
      <span className="text-xs font-medium tracking-wide" style={{ color: "#4a4a6a" }}>
        {label}
      </span>
    </div>
  );
}

function NowClearing({ game }: { game: GameWithTrophies }) {
  const earned = game.trophies.filter((t) => t.earned).length;
  const total = game.trophies.length;

  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-2"
      style={{
        backgroundColor: "#0f0f1a",
        border: "1px solid #1e1e35",
        borderLeft: "3px solid #7c6dff",
      }}
    >
      <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#7c6dff" }}>
        Now Clearing
      </p>
      <h2 className="text-xl font-bold" style={{ color: "#e8e8f0" }}>
        {game.title}
      </h2>
      <p className="text-xs" style={{ color: "#4a4a6a" }}>
        {game.platform}{game.genre && ` · ${game.genre}`}
      </p>
      {total > 0 && (
        <div className="flex items-center gap-2 mt-1">
          <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#1e1e35" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${(earned / total) * 100}%`, backgroundColor: "#4fc3f7" }}
            />
          </div>
          <span className="text-xs" style={{ color: "#4a4a6a" }}>
            {earned}/{total} 🏆
          </span>
        </div>
      )}
    </div>
  );
}
