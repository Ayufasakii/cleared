"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Trophy, TrophyGrade } from "@prisma/client";

const GRADES: TrophyGrade[] = ["PLATINUM", "GOLD", "SILVER", "BRONZE"];
const gradeIcon: Record<TrophyGrade, string> = {
  PLATINUM: "🏆", GOLD: "🥇", SILVER: "🥈", BRONZE: "🥉",
};

export default function ManageTrophies({ gameId, trophies }: { gameId: string; trophies: Trophy[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAdding(true);
    const form = new FormData(e.currentTarget);
    await fetch("/api/trophies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId,
        name:  form.get("name"),
        grade: form.get("grade"),
        note:  form.get("note") || null,
      }),
    });
    setAdding(false);
    setShowForm(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold" style={{ color: "#e8e8f0" }}>Trophies</h2>
        <button onClick={() => setShowForm((s) => !s)}
          className="text-xs px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: "#7c6dff22", color: "#7c6dff", border: "1px solid #7c6dff40" }}>
          {showForm ? "Cancel" : "+ Add Trophy"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd}
          className="rounded-xl p-4 flex flex-col gap-3"
          style={{ backgroundColor: "#0f0f1a", border: "1px solid #7c6dff40" }}>
          <input name="name" placeholder="Trophy name" required
            className="rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: "#08080f", border: "1px solid #1e1e35", color: "#e8e8f0" }} />
          <div className="flex gap-2 flex-wrap">
            {GRADES.map((g) => (
              <label key={g} className="flex items-center gap-1 cursor-pointer">
                <input type="radio" name="grade" value={g} defaultChecked={g === "BRONZE"} />
                <span className="text-xs" style={{ color: "#4a4a6a" }}>{gradeIcon[g]} {g}</span>
              </label>
            ))}
          </div>
          <input name="note" placeholder="Note (optional)"
            className="rounded-lg px-3 py-2 text-sm outline-none"
            style={{ backgroundColor: "#08080f", border: "1px solid #1e1e35", color: "#e8e8f0" }} />
          <button type="submit" disabled={adding}
            className="py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: "#7c6dff", color: "#e8e8f0" }}>
            {adding ? "Adding..." : "Add Trophy"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-2">
        {trophies.map((t) => <TrophyRow key={t.id} trophy={t} onUpdate={() => router.refresh()} />)}
      </div>
    </div>
  );
}

function TrophyRow({ trophy, onUpdate }: { trophy: Trophy; onUpdate: () => void }) {
  const [editing, setEditing] = useState(false);
  const [difficulty, setDifficulty] = useState(trophy.difficulty);
  const [fun, setFun] = useState(trophy.fun);
  const [earned, setEarned] = useState(trophy.earned);

  async function toggleEarned() {
    const newVal = !earned;
    setEarned(newVal);
    await fetch(`/api/trophies/${trophy.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ earned: newVal, earnedAt: newVal ? new Date() : null }),
    });
    onUpdate();
  }

  async function saveEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch(`/api/trophies/${trophy.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ difficulty, fun, note: form.get("note") || null }),
    });
    setEditing(false);
    onUpdate();
  }

  async function handleDelete() {
    if (!confirm("Delete this trophy?")) return;
    await fetch(`/api/trophies/${trophy.id}`, { method: "DELETE" });
    onUpdate();
  }

  return (
    <div className="rounded-xl p-3 flex flex-col gap-2"
      style={{ backgroundColor: "#0f0f1a", border: `1px solid ${earned ? "#7c6dff30" : "#1e1e35"}` }}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button onClick={toggleEarned} title="Toggle earned"
            className="text-lg leading-none">
            {earned ? "✅" : "⬜"}
          </button>
          <span className="text-xs">{gradeIcon[trophy.grade]}</span>
          <span className="text-sm font-medium" style={{ color: "#e8e8f0" }}>{trophy.name}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEditing((s) => !s)} className="text-xs" style={{ color: "#4a4a6a" }}>
            {editing ? "Cancel" : "Edit"}
          </button>
          <button onClick={handleDelete} className="text-xs" style={{ color: "#ff6b6b" }}>Del</button>
        </div>
      </div>

      {editing && (
        <form onSubmit={saveEdit} className="flex flex-col gap-2 pt-1">
          <div className="flex gap-4">
            <div>
              <p className="text-xs mb-1" style={{ color: "#4a4a6a" }}>Difficulty</p>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} type="button"
                    onClick={() => setDifficulty(difficulty === n ? null : n)}
                    style={{ color: difficulty !== null && difficulty >= n ? "#7c6dff" : "#1e1e35" }}>★</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs mb-1" style={{ color: "#4a4a6a" }}>Fun</p>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((n) => (
                  <button key={n} type="button"
                    onClick={() => setFun(fun === n ? null : n)}
                    style={{ color: fun !== null && fun >= n ? "#4fc3f7" : "#1e1e35" }}>★</button>
                ))}
              </div>
            </div>
          </div>
          <input name="note" defaultValue={trophy.note ?? ""} placeholder="Note..."
            className="rounded-lg px-3 py-2 text-xs outline-none"
            style={{ backgroundColor: "#08080f", border: "1px solid #1e1e35", color: "#e8e8f0" }} />
          <button type="submit" className="py-1.5 rounded-lg text-xs font-semibold"
            style={{ backgroundColor: "#7c6dff", color: "#e8e8f0" }}>Save</button>
        </form>
      )}
    </div>
  );
}
