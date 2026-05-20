import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { gameId, name, grade, note } = await req.json();

  const trophy = await prisma.trophy.create({
    data: { gameId, name, grade, note: note || null },
  });

  return NextResponse.json(trophy);
}
