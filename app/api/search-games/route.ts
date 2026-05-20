import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json([]);

  const key = process.env.RAWG_API_KEY;
  if (!key) return NextResponse.json({ error: "RAWG_API_KEY not configured" }, { status: 500 });

  const url = `https://api.rawg.io/api/games?key=${key}&search=${encodeURIComponent(q)}&page_size=6&ordering=-rating`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return NextResponse.json([]);

  const data = await res.json();
  const results = (data.results ?? []).map((g: {
    name: string;
    background_image: string | null;
    genres: { name: string }[];
  }) => ({
    name: g.name,
    cover: g.background_image ?? null,
    genre: g.genres.map((x) => x.name).slice(0, 2).join(", ") || null,
  }));

  return NextResponse.json(results);
}
