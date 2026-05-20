import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { npsso } = await req.json();
  if (!npsso?.trim()) return NextResponse.json({ error: "NPSSO required" }, { status: 400 });

  await prisma.setting.upsert({
    where: { key: "npsso" },
    create: { key: "npsso", value: npsso.trim() },
    update: { value: npsso.trim() },
  });

  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const setting = await prisma.setting.findUnique({ where: { key: "npsso" } });
  return NextResponse.json({ hasToken: !!setting?.value, updatedAt: setting?.updatedAt ?? null });
}
