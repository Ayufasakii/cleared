export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import type { JournalWithGame } from "@/lib/types";

async function getEntries(): Promise<JournalWithGame[]> {
  return prisma.journalEntry.findMany({
    orderBy: { date: "desc" },
    include: { game: true, trophies: true },
  });
}

function groupByMonth(entries: JournalWithGame[]) {
  const groups: Record<string, JournalWithGame[]> = {};
  for (const entry of entries) {
    const key = new Date(entry.date).toLocaleDateString("en-US", { year: "numeric", month: "long" });
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
  }
  return groups;
}

const MOODS: Record<string, string> = {
  happy: "😊", excited: "🤩", frustrated: "😤", chill: "😌",
  proud: "💪", sad: "😢", focused: "🎯", tired: "😴",
};

export default async function JournalPage() {
  const entries = await getEntries();
  const groups = groupByMonth(entries);

  return (
    <div className="flex flex-col gap-10 max-w-2xl">
      <h1 className="text-2xl font-bold" style={{ color: "#e8e8f0" }}>Journal</h1>

      {Object.keys(groups).length === 0 && (
        <p style={{ color: "#4a4a6a" }}>No journal entries yet.</p>
      )}

      {Object.entries(groups).map(([month, monthEntries]) => (
        <section key={month} className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold tracking-widest uppercase" style={{ color: "#4a4a6a" }}>
            {month}
          </h2>
          {monthEntries.map((entry) => (
            <div key={entry.id}
              className="rounded-xl p-5 flex flex-col gap-3"
              style={{ backgroundColor: "#0f0f1a", border: "1px solid #1e1e35", borderLeft: "3px solid #7c6dff30" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <p className="text-xs font-semibold" style={{ color: "#7c6dff" }}>
                    {new Date(entry.date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                  </p>
                  {entry.mood && (
                    <span style={{ fontSize: "1rem" }}>{MOODS[entry.mood] ?? entry.mood}</span>
                  )}
                </div>
                {entry.game && (
                  <span className="text-xs" style={{ color: "#4a4a6a" }}>
                    🎮 {entry.game.title}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#e8e8f0" }}>
                {entry.diary}
              </p>
              {entry.trophies.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {entry.trophies.map((t) => (
                    <span key={t.id} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "#1e1e35", color: "#7c6dff", border: "1px solid #7c6dff30" }}>
                      🏆 {t.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
