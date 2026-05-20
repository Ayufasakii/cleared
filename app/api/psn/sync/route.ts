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

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { gameId, psnTitleId, platform } = await req.json();
  if (!gameId || !psnTitleId) return NextResponse.json({ error: "Missing gameId or psnTitleId" }, { status: 400 });

  try {
    const accessToken = await getPsnAccessToken();
    const isPs5 = platform === "PS5";
    const npServiceName = isPs5 ? "trophy2" : "trophy";

    // Get trophy definitions
    const { trophies: defs } = await getTitleTrophies(
      { accessToken },
      psnTitleId,
      "all",
      { npServiceName }
    );

    // Get user's earned status
    const { trophies: earned } = await getUserTrophiesEarnedForTitle(
      { accessToken },
      "me",
      psnTitleId,
      "all",
      { npServiceName }
    );

    // Build earned map by trophyId
    const earnedMap = new Map(earned.map((e) => [e.trophyId, e]));

    // Upsert trophies
    let synced = 0;
    for (const def of defs) {
      if (!def.trophyName || def.trophyType === undefined) continue;
      const earnedEntry = earnedMap.get(def.trophyId);
      const grade = (GRADE_MAP[def.trophyType ?? "bronze"] ?? "BRONZE") as TrophyGrade;
      const isEarned = earnedEntry?.earned ?? false;

      await prisma.trophy.upsert({
        where: {
          gameId_psnTrophyId: {
            gameId,
            psnTrophyId: String(def.trophyId),
          },
        },
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
          name: def.trophyName,
          grade,
          imageUrl: def.trophyIconUrl ?? null,
          rarity: null,
          earned: isEarned,
          earnedAt: isEarned && earnedEntry?.earnedDateTime
            ? new Date(earnedEntry.earnedDateTime)
            : null,
        },
      });
      synced++;
    }

    // Save psnGameId on the game
    await prisma.game.update({
      where: { id: gameId },
      data: { psnGameId: psnTitleId },
    });

    return NextResponse.json({ ok: true, synced });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
