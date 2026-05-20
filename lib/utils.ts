import type { GameWithTrophies } from "./types";

export function calcAvgScore(game: GameWithTrophies): number | null {
  const scores = [
    game.scoreStory,
    game.scoreCharacter,
    game.scoreArt,
    game.scoreSound,
    game.scoreGameplay,
    game.scoreDifficulty,
  ].filter((s): s is number => s !== null);
  if (scores.length === 0) return null;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
}

export function calcOverallScore(games: GameWithTrophies[]): number | null {
  const scores = games.map(calcAvgScore).filter((s): s is number => s !== null);
  if (scores.length === 0) return null;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getPlatinumCount(games: GameWithTrophies[]): number {
  return games.filter((g) => g.status === "PLATINUM").length;
}

export function getTotalTrophies(games: GameWithTrophies[]): number {
  return games.reduce((acc, g) => acc + g.trophies.filter((t) => t.earned).length, 0);
}
