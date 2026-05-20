"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Game } from "@prisma/client";

type Platform = "PS4" | "PS5" | "PC" | "SWITCH" | "OTHER";
type GameStatus = "PLAYING" | "PLATINUM" | "DROPPED";

const SCORE_LABELS = [
  { key: "scoreStory",      label: "Story" },
  { key: "scoreCharacter",  label: "Characters" },
  { key: "scoreArt",        label: "Art" },
  { key: "scoreSound",      label: "Sound" },
  { key: "scoreGameplay",   label: "Gameplay" },
  { key: "scoreDifficulty", label: "Difficulty" },
] as const;

export default function EditGameForm({ game }: { game: Game }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [platform, setPlatform] = useState<Platform>(game.platform as Platform);
  const [status, setStatus] = useState<GameStatus>(game.status as GameStatus);
  const [scores, setScores] = useState<Record<string, number | null>>({
    scoreStory:      game.scoreStory,
    scoreCharacter:  game.scoreCharacter,
    scoreArt:        game.scoreArt,
    scoreSound:      game.scoreSound,
    scoreGameplay:   game.scoreGameplay,
    scoreDifficulty: game.scoreDifficulty,
  });
  const [moodInput, setMoodInput] = useState(game.moodTags.join(", "));

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const moodTags = moodInput.split(",").map((t) => t.trim()).filter(Boolean);

    await fetch(`/api/games/${game.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title:       form.get("title"),
        platform,
        genre:       form.get("genre") || null,
        status,
        review:      form.get("review") || null,
        highlight:   form.get("highlight") || null,
        quote:       form.get("quote") || null,
        replayValue: form.get("replayValue") ? Number(form.get("replayValue")) : null,
        startDate:   form.get("startDate") ? new Date(form.get("startDate") as string) : null,
        platinumDate:form.get("platinumDate") ? new Date(form.get("platinumDate") as string) : null,
        moodTags,
        ...scores,
      }),
    });
    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${game.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    await fetch(`/api/games/${game.id}`, { method: "DELETE" });
    router.push("/admin");
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold" style={{ color: "#e8e8f0" }}>Edit Game</h2>
        <button type="button" onClick={handleDelete} disabled={deleting}
          className="text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: "#ff6b6b", border: "1px solid #ff6b6b40", backgroundColor: "transparent" }}>
          {deleting ? "Deleting..." : "Delete Game"}
        </button>
      </div>

      {/* Basic info */}
      <Field label="Title" name="title" defaultValue={game.title} required />

      <div className="flex flex-wrap gap-2">
        {(["PS5","PS4","PC","SWITCH","OTHER"] as Platform[]).map((p) => (
          <ToggleBtn key={p} label={p} active={platform === p} onClick={() => setPlatform(p)} />
        ))}
      </div>

      <Field label="Genre" name="genre" defaultValue={game.genre ?? ""} />

      <div className="flex flex-wrap gap-2">
        {(["PLAYING","PLATINUM","DROPPED"] as GameStatus[]).map((s) => (
          <ToggleBtn key={s}
            label={s === "PLAYING" ? "🎮 Playing" : s === "PLATINUM" ? "🏆 Platinum" : "💀 Dropped"}
            active={status === s} onClick={() => setStatus(s)} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Start Date" name="startDate" type="date"
          defaultValue={game.startDate ? new Date(game.startDate).toISOString().split("T")[0] : ""} />
        <Field label="Platinum Date" name="platinumDate" type="date"
          defaultValue={game.platinumDate ? new Date(game.platinumDate).toISOString().split("T")[0] : ""} />
      </div>

      {/* Ratings */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a4a6a" }}>Ratings</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SCORE_LABELS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1">
              <p className="text-xs" style={{ color: "#4a4a6a" }}>{label}</p>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} type="button"
                    onClick={() => setScores((s) => ({ ...s, [key]: s[key] === n ? null : n }))}
                    style={{ color: scores[key] !== null && (scores[key] as number) >= n ? "#7c6dff" : "#1e1e35", fontSize: "1.1rem" }}>
                    ★
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review fields */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a4a6a" }}>Review</label>
        <textarea name="review" rows={4} defaultValue={game.review ?? ""}
          className="rounded-lg px-4 py-3 text-sm outline-none resize-none"
          style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35", color: "#e8e8f0" }}
          onFocus={(e) => (e.target.style.borderColor = "#7c6dff")}
          onBlur={(e) => (e.target.style.borderColor = "#1e1e35")} />
      </div>

      <Field label="Best Part (Highlight)" name="highlight" defaultValue={game.highlight ?? ""} />
      <Field label="Favorite Quote" name="quote" defaultValue={game.quote ?? ""} />

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a4a6a" }}>
          Mood Tags (comma separated)
        </label>
        <input value={moodInput} onChange={(e) => setMoodInput(e.target.value)}
          placeholder="epic, emotional, chill"
          className="rounded-lg px-4 py-3 text-sm outline-none"
          style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35", color: "#e8e8f0" }}
          onFocus={(e) => (e.target.style.borderColor = "#7c6dff")}
          onBlur={(e) => (e.target.style.borderColor = "#1e1e35")} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a4a6a" }}>Replay Value</p>
        <div className="flex gap-1">
          {[1,2,3,4,5].map((n) => (
            <button key={n} type="button" style={{ fontSize: "1.1rem" }}>★</button>
          ))}
          <input type="hidden" name="replayValue" defaultValue={game.replayValue ?? ""} />
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="py-3 rounded-xl font-semibold text-sm"
        style={{ backgroundColor: "#7c6dff", color: "#e8e8f0", opacity: loading ? 0.6 : 1 }}>
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

function Field({ label, name, defaultValue, type = "text", required }: {
  label: string; name: string; defaultValue?: string; type?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a4a6a" }}>{label}</label>
      <input name={name} type={type} defaultValue={defaultValue} required={required}
        className="rounded-lg px-4 py-3 text-sm outline-none"
        style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35", color: "#e8e8f0", colorScheme: "dark" }}
        onFocus={(e) => (e.target.style.borderColor = "#7c6dff")}
        onBlur={(e) => (e.target.style.borderColor = "#1e1e35")} />
    </div>
  );
}

function ToggleBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
      style={{
        backgroundColor: active ? "#7c6dff" : "#0f0f1a",
        color: active ? "#e8e8f0" : "#4a4a6a",
        border: `1px solid ${active ? "#7c6dff" : "#1e1e35"}`,
      }}>
      {label}
    </button>
  );
}
