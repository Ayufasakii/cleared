import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json([]);

  const key = process.env.RAWG_API_KEY;
  if (!key) return NextResponse.json({ error: "RAWG_API_KEY not set" }, { status: 500 });

  const url = `https://api.rawg.io/api/games?key=${key}&search=${encodeURIComponent(q)}&page_size=6`;

  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch (e) {
    return NextResponse.json({ error: "fetch failed", detail: String(e) }, { status: 500 });
  }

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
