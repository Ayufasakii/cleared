"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MOODS = ["happy","excited","frustrated","chill","proud","sad","focused","tired"];
const MOOD_ICONS: Record<string, string> = {
  happy: "😊", excited: "🤩", frustrated: "😤", chill: "😌",
  proud: "💪", sad: "😢", focused: "🎯", tired: "😴",
};

export default function JournalForm({ games }: { games: { id: string; title: string }[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  const [gameId, setGameId] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date:   form.get("date"),
        diary:  form.get("diary"),
        mood:   mood || null,
        gameId: gameId || null,
      }),
    });
    setLoading(false);
    setMood(null);
    setGameId("");
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-bold" style={{ color: "#e8e8f0" }}>New Entry</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a4a6a" }}>Date</label>
          <input name="date" type="date" required defaultValue={new Date().toISOString().split("T")[0]}
            className="rounded-lg px-4 py-3 text-sm outline-none"
            style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35", color: "#e8e8f0", colorScheme: "dark" }}
            onFocus={(e) => (e.target.style.borderColor = "#7c6dff")}
            onBlur={(e) => (e.target.style.borderColor = "#1e1e35")} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a4a6a" }}>Game</label>
          <select value={gameId} onChange={(e) => setGameId(e.target.value)}
            className="rounded-lg px-4 py-3 text-sm outline-none"
            style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35", color: "#e8e8f0" }}>
            <option value="">— none —</option>
            {games.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a4a6a" }}>Mood</label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button key={m} type="button" onClick={() => setMood(mood === m ? null : m)}
              className="px-3 py-1.5 rounded-lg text-sm transition-all"
              style={{
                backgroundColor: mood === m ? "#7c6dff" : "#0f0f1a",
                color: mood === m ? "#e8e8f0" : "#4a4a6a",
                border: `1px solid ${mood === m ? "#7c6dff" : "#1e1e35"}`,
              }}>
              {MOOD_ICONS[m]} {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a4a6a" }}>Entry</label>
        <textarea name="diary" rows={5} required placeholder="What happened today..."
          className="rounded-lg px-4 py-3 text-sm outline-none resize-none"
          style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35", color: "#e8e8f0" }}
          onFocus={(e) => (e.target.style.borderColor = "#7c6dff")}
          onBlur={(e) => (e.target.style.borderColor = "#1e1e35")} />
      </div>

      <button type="submit" disabled={loading}
        className="py-3 rounded-xl font-semibold text-sm"
        style={{ backgroundColor: "#7c6dff", color: "#e8e8f0", opacity: loading ? 0.6 : 1 }}>
        {loading ? "Saving..." : "Save Entry"}
      </button>
    </form>
  );
}
