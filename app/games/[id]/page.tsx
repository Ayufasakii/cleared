import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { calcAvgScore, formatDate } from "@/lib/utils";
import StatusBadge from "@/components/StatusBadge";
import StarRating from "@/components/StarRating";
import TrophyGrid from "@/components/TrophyGrid";

async function getGame(id: string) {
  const game = await prisma.game.findUnique({
    where: { id },
    include: { trophies: { orderBy: [{ grade: "asc" }, { earned: "desc" }] } },
  });
  return game;
}

const SCORE_LABELS = [
  { key: "scoreStory",      label: "Story",      commentKey: "commentStory" },
  { key: "scoreCharacter",  label: "Characters", commentKey: "commentCharacter" },
  { key: "scoreGraphics",   label: "Graphics",   commentKey: "commentGraphics" },
  { key: "scoreSound",      label: "Sound",      commentKey: "commentSound" },
  { key: "scoreGameplay",   label: "Gameplay",   commentKey: "commentGameplay" },
  { key: "scoreDifficulty", label: "Difficulty", commentKey: "commentDifficulty" },
] as const;

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = await getGame(id);
  if (!game) notFound();

  const avg = calcAvgScore(game);
  const earned = game.trophies.filter((t) => t.earned).length;
  const total = game.trophies.length;

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Header */}
      <div className="flex gap-6 items-start">
        {game.coverUrl && (
          <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: "#1e1e35" }}>
            <Image src={game.coverUrl} alt={game.title} fill className="object-cover" sizes="128px" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold" style={{ color: "#e8e8f0" }}>{game.title}</h1>
            <StatusBadge status={game.status} />
          </div>
          <p className="text-sm" style={{ color: "#4a4a6a" }}>
            {game.platform}{game.genre && ` · ${game.genre}`}
          </p>
          {game.startDate && (
            <p className="text-xs" style={{ color: "#4a4a6a" }}>
              {formatDate(game.startDate)}
              {game.platinumDate && ` → ${formatDate(game.platinumDate)}`}
            </p>
          )}
          {total > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#1e1e35" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(earned / total) * 100}%`,
                    backgroundColor: game.status === "PLATINUM" ? "#7c6dff" : "#4fc3f7",
                  }}
                />
              </div>
              <span className="text-xs" style={{ color: "#4a4a6a" }}>{earned}/{total} 🏆</span>
            </div>
          )}
        </div>
        {avg !== null && (
          <div className="ml-auto text-right shrink-0">
            <p className="text-4xl font-bold" style={{ color: "#7c6dff" }}>{avg}</p>
            <p className="text-xs" style={{ color: "#4a4a6a" }}>overall</p>
          </div>
        )}
      </div>

      {/* Ratings */}
      {SCORE_LABELS.some(({ key }) => (game as Record<string, unknown>)[key] !== null) && (
        <div
          className="rounded-xl p-5 grid grid-cols-2 sm:grid-cols-3 gap-4"
          style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35" }}
        >
          {SCORE_LABELS.map(({ key, label, commentKey }) => {
            const score = (game as Record<string, unknown>)[key] as number | null;
            const comment = (game as Record<string, unknown>)[commentKey] as string | null;
            if (score === null) return null;
            return (
              <div key={key} className="flex flex-col gap-1">
                <p className="text-xs" style={{ color: "#4a4a6a" }}>{label}</p>
                <StarRating value={score} />
                {comment && (
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#4a4a6a" }}>{comment}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Review */}
      {(game.review || game.highlight || game.quote) && (
        <div className="flex flex-col gap-4">
          {game.review && (
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35" }}
            >
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#4a4a6a" }}>Review</p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#e8e8f0" }}>{game.review}</p>
            </div>
          )}
          {game.highlight && (
            <div className="rounded-xl p-5" style={{ backgroundColor: "#0f0f1a", borderLeft: "3px solid #7c6dff", border: "1px solid #1e1e35" }}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#7c6dff" }}>Best Part</p>
              <p className="text-sm" style={{ color: "#e8e8f0" }}>{game.highlight}</p>
            </div>
          )}
          {game.quote && (
            <div className="rounded-xl p-5" style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35" }}>
              <p className="text-sm italic" style={{ color: "#4fc3f7" }}>"{game.quote}"</p>
            </div>
          )}
        </div>
      )}

      {/* Mood tags */}
      {game.moodTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {game.moodTags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full"
              style={{ backgroundColor: "#1e1e35", color: "#7c6dff", border: "1px solid #7c6dff40" }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Trophies */}
      {total > 0 && <TrophyGrid trophies={game.trophies} />}
    </div>
  );
}
