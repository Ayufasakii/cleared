"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { Game, Trophy, TrophyGrade } from "@prisma/client";

type GameFull = Game & { trophies: Trophy[] };

const SCORE_KEYS = [
  { key: "scoreStory",      label: "Story" },
  { key: "scoreCharacter",  label: "Characters" },
  { key: "scoreGraphics",   label: "Graphics" },
  { key: "scoreSound",      label: "Sound" },
  { key: "scoreGameplay",   label: "Gameplay" },
] as const;

const GRADE_COLOR: Record<TrophyGrade, string> = {
  PLATINUM: "#7c6dff",
  GOLD:     "#f5c842",
  SILVER:   "#a0a0b8",
  BRONZE:   "#c87941",
};
const GRADE_ICON: Record<TrophyGrade, string> = {
  PLATINUM: "🏆", GOLD: "🥇", SILVER: "🥈", BRONZE: "🥉",
};

function calcAvg(game: GameFull) {
  const scores = SCORE_KEYS
    .map(({ key }) => (game as Record<string, unknown>)[key] as number | null)
    .filter((s): s is number => s !== null);
  if (!scores.length) return null;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
}

/* ── Card 1: Hero ── */
function HeroCard({ game, avg }: { game: GameFull; avg: number | null }) {
  const earned = game.trophies.filter((t) => t.earned).length;
  const total  = game.trophies.length;
  const pct    = total > 0 ? (earned / total) * 100 : 0;
  const statusColor = game.status === "PLATINUM" ? "#7c6dff"
    : game.status === "PLAYING" ? "#4fc3f7" : "#ff6b6b";
  const statusLabel = game.status === "PLATINUM" ? "🏆 Platinum Cleared"
    : game.status === "PLAYING" ? "▶ Now Clearing" : "💀 Dropped";

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ minHeight: 280 }}>
      {/* Blurred cover BG */}
      {game.coverUrl && (
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${game.coverUrl})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "blur(24px) saturate(1.3)", transform: "scale(1.15)", opacity: 0.22,
        }} />
      )}
      <div className="glass" style={{ position: "absolute", inset: 0 }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(124,109,255,0.08), transparent 60%)",
      }} />

      {/* Content */}
      <div className="relative flex flex-col gap-4 p-5 sm:p-7 h-full">
        {/* Top row: status + score ring */}
        <div className="flex items-start justify-between gap-3">
          <span className="text-xs font-bold tracking-[0.18em] uppercase pt-0.5" style={{ color: statusColor }}>
            {statusLabel}
          </span>
          {avg !== null && (
            <div style={{
              width: 60, height: 60, flexShrink: 0, borderRadius: "50%",
              border: "2px solid rgba(124,109,255,0.4)",
              boxShadow: "0 0 20px rgba(124,109,255,0.25), inset 0 0 12px rgba(124,109,255,0.1)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontSize: "1.4rem", fontWeight: 800, lineHeight: 1,
                background: "linear-gradient(135deg, #e8e8f0, #7c6dff)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>{avg}</span>
              <span style={{ fontSize: "0.55rem", color: "#4a4a6a", letterSpacing: "0.08em" }}>SCORE</span>
            </div>
          )}
        </div>

        {/* Middle: cover (desktop only) + title/platform/dates */}
        <div className="flex gap-4 items-start flex-1">
          {/* Thumbnail — only on sm+ */}
          {game.coverUrl && (
            <div className="hidden sm:block relative shrink-0 rounded-xl overflow-hidden shadow-2xl"
              style={{
                width: 100, height: 140,
                boxShadow: "0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,109,255,0.3)",
              }}>
              <Image src={game.coverUrl} alt={game.title} fill unoptimized className="object-cover" />
            </div>
          )}
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <h1 className="font-bold leading-tight" style={{
              fontSize: "clamp(1.4rem, 5vw, 2.4rem)",
              background: "linear-gradient(135deg, #ffffff 30%, #7c6dff 80%, #4fc3f7)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              wordBreak: "break-word",
            }}>
              {game.title}
            </h1>
            <p style={{ color: "#6a6a8a", fontSize: "0.85rem" }}>
              {game.platform}{game.genre && ` · ${game.genre}`}
            </p>
            {(game.startDate || game.platinumDate) && (
              <p style={{ color: "#4a4a6a", fontSize: "0.75rem" }}>
                {game.startDate && new Date(game.startDate).toLocaleDateString("en-US", { dateStyle: "medium" })}
                {game.platinumDate && ` → ${new Date(game.platinumDate).toLocaleDateString("en-US", { dateStyle: "medium" })}`}
              </p>
            )}
          </div>
        </div>

        {/* Bottom: trophy progress */}
        {total > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between" style={{ fontSize: "0.72rem", color: "#4a4a6a" }}>
              <span>Trophy Progress</span>
              <span style={{ color: "#4fc3f7", fontWeight: 700 }}>{earned}/{total}</span>
            </div>
            <div style={{ height: 4, borderRadius: 9999, backgroundColor: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${pct}%`,
                background: "linear-gradient(to right, #7c6dff, #4fc3f7)",
                borderRadius: 9999, boxShadow: "0 0 10px rgba(124,109,255,0.5)",
                animation: "progressFill 1.2s cubic-bezier(.22,1,.36,1) both 0.2s",
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Card 2: Ratings ── */
function RatingsCard({ game, avg }: { game: GameFull; avg: number | null }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const scores = SCORE_KEYS
    .map(({ key, label }) => ({
      label,
      value: (game as Record<string, unknown>)[key] as number | null,
    }))
    .filter((s) => s.value !== null);

  return (
    <div className="glass relative w-full rounded-2xl p-5 sm:p-7 flex flex-col gap-5" style={{ minHeight: 280 }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: 16,
        background: "radial-gradient(ellipse at top right, rgba(124,109,255,0.08), transparent 60%)",
        pointerEvents: "none",
      }} />
      <div className="flex items-center justify-between">
        <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: "0.72rem", color: "#7c6dff" }}>
          My Ratings
        </p>
        {avg !== null && (
          <span style={{ fontSize: "0.82rem", color: "#4a4a6a" }}>
            Avg <span style={{ color: "#e8e8f0", fontWeight: 700, fontSize: "1.05rem" }}>{avg}</span> / 5
          </span>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {scores.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1.5">
            <div className="flex justify-between" style={{ fontSize: "0.82rem" }}>
              <span style={{ color: "#9090b0" }}>{label}</span>
              <span style={{ color: "#e8e8f0", fontWeight: 700 }}>{value}/5</span>
            </div>
            <div style={{ height: 5, borderRadius: 9999, backgroundColor: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: animated ? `${(value! / 5) * 100}%` : "0%",
                background: "linear-gradient(to right, #7c6dff, #4fc3f7)",
                borderRadius: 9999,
                transition: "width 0.8s cubic-bezier(.22,1,.36,1)",
                boxShadow: "0 0 8px rgba(124,109,255,0.4)",
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Card 3: Trophy Hunter ── */
function TrophyCard({ game }: { game: GameFull }) {
  const earned = game.trophies.filter((t) => t.earned).length;
  const total  = game.trophies.length;
  const pct    = total > 0 ? Math.round((earned / total) * 100) : 0;
  const grades = (["PLATINUM", "GOLD", "SILVER", "BRONZE"] as TrophyGrade[])
    .map((g) => ({
      grade: g,
      earned: game.trophies.filter((t) => t.grade === g && t.earned).length,
      total:  game.trophies.filter((t) => t.grade === g).length,
    }))
    .filter((g) => g.total > 0);

  return (
    <div className="glass relative w-full rounded-2xl p-5 sm:p-7 flex flex-col gap-5" style={{ minHeight: 280 }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: 16,
        background: "radial-gradient(ellipse at bottom left, rgba(79,195,247,0.06), transparent 60%)",
        pointerEvents: "none",
      }} />
      <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: "0.72rem", color: "#4fc3f7" }}>
        Trophy Hunter
      </p>

      {/* Big number */}
      <div className="flex items-end gap-2">
        <span style={{
          fontSize: "clamp(2.8rem, 10vw, 4.5rem)", fontWeight: 800, lineHeight: 1,
          background: "linear-gradient(135deg, #ffffff, #4fc3f7)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          {earned}
        </span>
        <span style={{ fontSize: "1.1rem", color: "#4a4a6a", paddingBottom: "0.5rem" }}>
          / {total} · {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 7, borderRadius: 9999, backgroundColor: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: pct === 100
            ? "linear-gradient(to right, #7c6dff, #4fc3f7)"
            : "linear-gradient(to right, #4fc3f7, #7c6dff80)",
          borderRadius: 9999,
          animation: "progressFill 1.2s cubic-bezier(.22,1,.36,1) both 0.3s",
          boxShadow: pct === 100 ? "0 0 16px rgba(124,109,255,0.6)" : "none",
        }} />
      </div>

      {/* Grade breakdown — always 4 cols but compact on mobile */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${grades.length}, 1fr)` }}>
        {grades.map(({ grade, earned: e, total: t }) => (
          <div key={grade}
            className="flex flex-col items-center gap-1 rounded-xl py-2.5"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: `1px solid ${GRADE_COLOR[grade]}20`,
            }}>
            <span style={{ fontSize: "1.1rem" }}>{GRADE_ICON[grade]}</span>
            <span style={{ color: GRADE_COLOR[grade], fontWeight: 700, fontSize: "1rem" }}>{e}</span>
            <span style={{ color: "#4a4a6a", fontSize: "0.62rem" }}>/{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Card 4: Highlight ── */
function HighlightCard({ game }: { game: GameFull }) {
  return (
    <div className="glass relative w-full rounded-2xl p-5 sm:p-7 flex flex-col gap-5" style={{ minHeight: 280 }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: 16,
        background: "radial-gradient(ellipse at center, rgba(124,109,255,0.06), transparent 70%)",
        pointerEvents: "none",
      }} />
      <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: "0.72rem", color: "#7c6dff" }}>
        Highlights
      </p>

      <div className="flex flex-col gap-5">
        {game.quote && (
          <p style={{
            fontSize: "clamp(1rem, 3.5vw, 1.4rem)",
            fontStyle: "italic",
            color: "#e8e8f0",
            lineHeight: 1.55,
            wordBreak: "break-word",
          }}>
            &ldquo;{game.quote}&rdquo;
          </p>
        )}
        {game.highlight && (
          <div className="flex gap-3 items-start">
            <div style={{
              width: 3, borderRadius: 9999,
              backgroundColor: "#7c6dff",
              alignSelf: "stretch", flexShrink: 0,
            }} />
            <div>
              <p style={{
                color: "#7c6dff", fontSize: "0.68rem", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4,
              }}>
                Best Part
              </p>
              <p style={{ color: "#c0c0d8", fontSize: "0.9rem", lineHeight: 1.6, wordBreak: "break-word" }}>
                {game.highlight}
              </p>
            </div>
          </div>
        )}
      </div>

      {game.moodTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {game.moodTags.map((tag) => (
            <span key={tag} style={{
              fontSize: "0.68rem", padding: "3px 9px", borderRadius: 9999,
              backgroundColor: "rgba(124,109,255,0.12)",
              border: "1px solid rgba(124,109,255,0.25)",
              color: "#7c6dff",
            }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Slideshow ── */
export default function GameRecap({ game }: { game: GameFull }) {
  const avg = calcAvg(game);
  const hasHighlight = !!(game.quote || game.highlight || game.moodTags.length);
  const hasRatings   = SCORE_KEYS.some(({ key }) => (game as Record<string, unknown>)[key] !== null);
  const hasTrophies  = game.trophies.length > 0;

  const cards = [
    { id: "hero",      el: <HeroCard game={game} avg={avg} /> },
    ...(hasRatings  ? [{ id: "ratings",   el: <RatingsCard game={game} avg={avg} /> }] : []),
    ...(hasTrophies ? [{ id: "trophies",  el: <TrophyCard  game={game} /> }] : []),
    ...(hasHighlight ? [{ id: "highlight", el: <HighlightCard game={game} /> }] : []),
  ];

  const [active, setActive] = useState(0);
  const prev = useCallback(() => setActive((i) => (i - 1 + cards.length) % cards.length), [cards.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % cards.length), [cards.length]);

  const [touchX, setTouchX] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3 w-full" style={{ maxWidth: "100%", overflow: "hidden" }}>
      {/* Slideshow wrapper — clips slides */}
      <div
        className="relative rounded-2xl"
        style={{
          overflow: "hidden",
          border: "1px solid rgba(124,109,255,0.2)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,109,255,0.08)",
        }}
        onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX === null) return;
          const dx = e.changedTouches[0].clientX - touchX;
          if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
          setTouchX(null);
        }}
      >
        {/* Slide track */}
        <div style={{
          display: "flex",
          width: "100%",
          transform: `translateX(-${active * 100}%)`,
          transition: "transform 0.45s cubic-bezier(.22,1,.36,1)",
        }}>
          {cards.map((c) => (
            <div key={c.id} style={{ width: "100%", minWidth: "100%", flexShrink: 0, boxSizing: "border-box" }}>
              {c.el}
            </div>
          ))}
        </div>

        {/* Arrow buttons — hidden on very small screens */}
        {cards.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center rounded-full transition-all"
              style={{
                width: 34, height: 34,
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#e8e8f0",
                backdropFilter: "blur(8px)",
                fontSize: "1.2rem",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124,109,255,0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center rounded-full transition-all"
              style={{
                width: 34, height: 34,
                background: "rgba(0,0,0,0.5)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#e8e8f0",
                backdropFilter: "blur(8px)",
                fontSize: "1.2rem",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124,109,255,0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Dot navigation + swipe hint on mobile */}
      {cards.length > 1 && (
        <div className="flex items-center justify-center gap-3">
          {/* Mobile swipe hint */}
          <span className="text-xs sm:hidden" style={{ color: "#2a2a4a" }}>swipe</span>

          <div className="flex gap-2">
            {cards.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActive(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: active === i ? 22 : 6,
                  height: 6,
                  borderRadius: 9999,
                  backgroundColor: active === i ? "#7c6dff" : "rgba(255,255,255,0.15)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "width 0.3s ease, background-color 0.3s ease",
                  boxShadow: active === i ? "0 0 8px rgba(124,109,255,0.6)" : "none",
                }}
              />
            ))}
          </div>

          <span className="text-xs sm:hidden" style={{ color: "#2a2a4a" }}>›</span>
        </div>
      )}
    </div>
  );
}
