"use client";

import { useRouter } from "next/navigation";
import type { JournalEntry, Game, Trophy } from "@prisma/client";

type Entry = JournalEntry & { game: Game | null; trophies: Trophy[] };

const MOOD_ICONS: Record<string, string> = {
  happy: "😊", excited: "🤩", frustrated: "😤", chill: "😌",
  proud: "💪", sad: "😢", focused: "🎯", tired: "😴",
};

export default function JournalList({ entries }: { entries: Entry[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry?")) return;
    await fetch(`/api/journal/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a4a6a" }}>
        All Entries
      </h2>
      {entries.map((entry) => (
        <div key={entry.id}
          className="rounded-xl p-4 flex flex-col gap-2"
          style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: "#7c6dff" }}>
                {new Date(entry.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              {entry.mood && <span>{MOOD_ICONS[entry.mood] ?? entry.mood}</span>}
              {entry.game && <span className="text-xs" style={{ color: "#4a4a6a" }}>🎮 {entry.game.title}</span>}
            </div>
            <button onClick={() => handleDelete(entry.id)} className="text-xs" style={{ color: "#ff6b6b" }}>
              Delete
            </button>
          </div>
          <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "#e8e8f0" }}>
            {entry.diary}
          </p>
        </div>
      ))}
    </div>
  );
}
