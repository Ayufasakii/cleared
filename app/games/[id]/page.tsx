import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calcAvgScore } from "@/lib/utils";
import StarRating from "@/components/StarRating";
import TrophyGrid from "@/components/TrophyGrid";
import GameRecap from "./GameRecap";

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

function SectionLabel({ children, color = "#7c6dff" }: { children: React.ReactNode; color?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color }}>{children}</p>
      <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${color}40, transparent)` }} />
    </div>
  );
}

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = await getGame(id);
  if (!game) notFound();

  const avg = calcAvgScore(game);
  const earned = game.trophies.filter((t) => t.earned).length;
  const total = game.trophies.length;

  const hasRatings = SCORE_LABELS.some(({ key }) => (game as Record<string, unknown>)[key] !== null);
  const hasContent = !!(game.review || game.highlight || game.quote);

  return (
    <div className="flex flex-col gap-10 max-w-4xl w-full min-w-0" style={{ animation: "fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) both" }}>

      {/* ── Recap Slideshow ── */}
      <GameRecap game={game} />

      {/* ── Ratings ── */}
      {hasRatings && (
        <section style={{ animation: "fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) both 120ms" }}>
          <SectionLabel>My Ratings</SectionLabel>
          <div className="glass rounded-2xl p-6 flex flex-col gap-5"
            style={{ border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {SCORE_LABELS.map(({ key, label, commentKey }) => {
                const score = (game as Record<string, unknown>)[key] as number | null;
                const comment = (game as Record<string, unknown>)[commentKey] as string | null;
                if (score === null) return null;
                return (
                  <div key={key} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold" style={{ color: "#c0c0d8" }}>{label}</span>
                      <span className="text-sm font-bold" style={{ color: "#e8e8f0" }}>{score}<span style={{ color: "#4a4a6a" }}>/5</span></span>
                    </div>
                    <StarRating value={score} />
                    {comment && (
                      <p className="text-sm leading-relaxed" style={{ color: "#6a6a8a" }}>{comment}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Overall avg */}
            {avg !== null && (
              <div className="mt-1 pt-4 flex items-center justify-between"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#4a4a6a" }}>Overall Average</span>
                <span className="text-2xl font-bold" style={{
                  background: "linear-gradient(135deg, #e8e8f0, #7c6dff)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>{avg} / 5</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Review & Highlights ── */}
      {hasContent && (
        <section style={{ animation: "fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) both 200ms" }}>
          <SectionLabel color="#4fc3f7">Review</SectionLabel>
          <div className="flex flex-col gap-4">
            {game.review && (
              <div className="glass rounded-2xl p-6"
                style={{ border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
                <p className="text-base leading-[1.85] whitespace-pre-wrap" style={{ color: "#d0d0e8" }}>
                  {game.review}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {game.highlight && (
                <div className="glass rounded-2xl p-6 flex gap-4"
                  style={{
                    border: "1px solid rgba(124,109,255,0.15)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(124,109,255,0.05)",
                  }}>
                  <div style={{ width: 3, borderRadius: 9999, background: "linear-gradient(to bottom, #7c6dff, #4fc3f7)", flexShrink: 0 }} />
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: "#7c6dff" }}>Best Part</p>
                    <p className="text-base leading-relaxed" style={{ color: "#d0d0e8" }}>{game.highlight}</p>
                  </div>
                </div>
              )}

              {game.quote && (
                <div className="glass rounded-2xl p-6 flex items-center"
                  style={{ border: "1px solid rgba(79,195,247,0.12)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
                  <p className="text-base italic leading-relaxed" style={{ color: "#4fc3f7" }}>
                    &ldquo;{game.quote}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Mood Tags ── */}
      {game.moodTags.length > 0 && (
        <section style={{ animation: "fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) both 260ms" }}>
          <SectionLabel color="#a78bfa">Vibes</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {game.moodTags.map((tag) => (
              <span key={tag}
                className="text-sm px-4 py-1.5 rounded-full font-medium"
                style={{
                  backgroundColor: "rgba(124,109,255,0.1)",
                  border: "1px solid rgba(124,109,255,0.25)",
                  color: "#a78bfa",
                }}>
                #{tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── Trophies ── */}
      {total > 0 && (
        <section style={{ animation: "fadeSlideUp 0.55s cubic-bezier(.22,1,.36,1) both 320ms" }}>
          <SectionLabel color="#f5c842">
            Trophies · {earned}/{total}
          </SectionLabel>
          <TrophyGrid trophies={game.trophies} />
        </section>
      )}
    </div>
  );
}
