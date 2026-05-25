import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPsnAccessToken } from "@/lib/psn";
import { prisma } from "@/lib/prisma";
import {
  getTitleTrophies,
  getUserTrophiesEarnedForTitle,
} from "psn-api";
import type { TrophyGrade } from "@prisma/client";

const GRADE_MAP: Record<string, string> = {
  platinum: "PLATINUM",
  gold: "GOLD",
  silver: "SILVER",
  bronze: "BRONZE",
};

// POST /api/psn/resync  { gameId }
// Re-syncs earned status using the already-saved psnGameId (no search needed)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { gameId } = await req.json();
  if (!gameId) return NextResponse.json({ error: "Missing gameId" }, { status: 400 });

  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) return NextResponse.json({ error: "Game not found" }, { status: 404 });
  if (!game.psnGameId) return NextResponse.json({ error: "No PSN ID linked to this game yet" }, { status: 400 });

  try {
    const accessToken = await getPsnAccessToken();
    const isPs5 = game.platform === "PS5";
    const npServiceName = isPs5 ? "trophy2" : "trophy";
    const psnTitleId = game.psnGameId;

    const { trophies: defs } = await getTitleTrophies(
      { accessToken },
      psnTitleId,
      "all",
      { npServiceName }
    );

    const { trophies: earnedList } = await getUserTrophiesEarnedForTitle(
      { accessToken },
      "me",
      psnTitleId,
      "all",
      { npServiceName }
    );

    const earnedMap = new Map(earnedList.map((e) => [e.trophyId, e]));

    let synced = 0;
    let newlyEarned = 0;

    for (const def of defs) {
      if (!def.trophyName || def.trophyType === undefined) continue;
      const earnedEntry = earnedMap.get(def.trophyId);
      const grade = (GRADE_MAP[def.trophyType ?? "bronze"] ?? "BRONZE") as TrophyGrade;
      const isEarned = earnedEntry?.earned ?? false;

      // Check previous earned state
      const existing = await prisma.trophy.findUnique({
        where: { gameId_psnTrophyId: { gameId, psnTrophyId: String(def.trophyId) } },
      });

      if (existing && !existing.earned && isEarned) newlyEarned++;

      await prisma.trophy.upsert({
        where: { gameId_psnTrophyId: { gameId, psnTrophyId: String(def.trophyId) } },
        create: {
          gameId,
          psnTrophyId: String(def.trophyId),
          name: def.trophyName,
          grade,
          imageUrl: def.trophyIconUrl ?? null,
          rarity: null,
          earned: isEarned,
          earnedAt: isEarned && earnedEntry?.earnedDateTime
            ? new Date(earnedEntry.earnedDateTime)
            : null,
        },
        update: {
          earned: isEarned,
          earnedAt: isEarned && earnedEntry?.earnedDateTime
            ? new Date(earnedEntry.earnedDateTime)
            : null,
        },
      });
      synced++;
    }

    return NextResponse.json({ ok: true, synced, newlyEarned });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
