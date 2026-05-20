import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, platform, genre, status, startDate, coverUrl } = body;

  const game = await prisma.game.create({
    data: {
      title,
      platform,
      genre: genre || null,
      status: status || "PLAYING",
      startDate: startDate ? new Date(startDate) : null,
      coverUrl: coverUrl || null,
    },
  });

  return NextResponse.json(game);
}
