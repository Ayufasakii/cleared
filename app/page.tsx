export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { calcAvgScore, getPlatinumCount, getTotalTrophies } from "@/lib/utils";
import type { GameWithTrophies, GameStatus } from "@/lib/types";
import NowClearingHero from "@/components/NowClearingHero";
import { AnimatedStatCard } from "@/components/AnimatedStatCard";
import GameSection from "@/components/GameSection";

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
  const playingCount  = games.filter((g) => g.status === "PLAYING").length;
  const droppedCount  = games.filter((g) => g.status === "DROPPED").length;
  const allScores     = games.map(calcAvgScore).filter((s): s is number => s !== null);
  const avgScore      = allScores.length > 0
    ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10
    : 0;

  const nowClearing = games.find((g) => g.status === "PLAYING");

  return (
    <div className="relative flex flex-col gap-10" style={{ zIndex: 1 }}>
      {nowClearing && <NowClearingHero game={nowClearing} />}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <AnimatedStatCard label="Platinum"  value={platinumCount}  delay={0}   accent="#7c6dff" />
        <AnimatedStatCard label="Avg Score" value={avgScore}        delay={80}  accent="#4fc3f7" />
        <AnimatedStatCard label="Trophies"  value={totalTrophies}   delay={160} accent="#f5c842" />
        <AnimatedStatCard label="Played"    value={platinumCount + playingCount + droppedCount} delay={240} accent="#a0a0b8" />
      </div>

      {SECTIONS.map(({ status, label, icon }, sectionIdx) => {
        const sectionGames = games.filter((g) => g.status === status);
        if (sectionGames.length === 0) return null;
        return (
          <GameSection
            key={status}
            label={label}
            icon={icon}
            games={sectionGames}
            baseDelay={320 + sectionIdx * 100}
          />
        );
      })}

      {games.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4"
          style={{ animation: "fadeSlideUp 0.5s ease both" }}>
          <span style={{ fontSize: "3rem" }}>🎮</span>
          <p className="font-semibold" style={{ color: "#4a4a6a" }}>
            No games yet. Add your first game from the admin panel.
          </p>
        </div>
      )}
    </div>
  );
}
