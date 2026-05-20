import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date, diary, mood, gameId } = await req.json();

  const entry = await prisma.journalEntry.create({
    data: {
      date:   new Date(date),
      diary,
      mood:   mood || null,
      gameId: gameId || null,
    },
  });

  return NextResponse.json(entry);
}
