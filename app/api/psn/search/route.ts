import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getPsnAccessToken } from "@/lib/psn";
import { getUserTitles } from "psn-api";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase().trim() ?? "";

  try {
    const accessToken = await getPsnAccessToken();

    // Fetch up to 800 titles from PSN library
    const results: { npCommunicationId: string; trophyTitleName: string; trophyTitleIconUrl: string; trophyTitlePlatform: string }[] = [];
    let offset = 0;
    const limit = 200;

    while (results.length < 800) {
      const { trophyTitles, totalItemCount } = await getUserTitles(
        { accessToken },
        "me",
        { limit, offset }
      );
      results.push(...(trophyTitles ?? []));
      offset += limit;
      if (offset >= totalItemCount) break;
    }

    const filtered = q
      ? results.filter((t) => t.trophyTitleName?.toLowerCase().includes(q))
      : results.slice(0, 20);

    return NextResponse.json(
      filtered.slice(0, 20).map((t) => ({
        id: t.npCommunicationId,
        name: t.trophyTitleName,
        icon: t.trophyTitleIconUrl,
        platform: t.trophyTitlePlatform,
      }))
    );
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
